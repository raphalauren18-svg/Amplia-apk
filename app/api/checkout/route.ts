import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ASAAS_URL = process.env.NEXT_PUBLIC_ASAAS_ENV === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3'

export async function POST(request: Request) {
  try {
    const { bookId, type, affiliateSlug, deliveryAddress } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // Validar endereço para físico
    if (type === 'physical' && !deliveryAddress?.street) {
      return NextResponse.json({ error: 'Endereço de entrega é obrigatório para compra física' }, { status: 400 })
    }

    // Buscar livro com autor
    const { data: book } = await supabase
      .from('books')
      .select('*, authors(id, user_id)')
      .eq('id', bookId)
      .eq('status', 'published')
      .single()
    if (!book) return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 })

    const price = type === 'digital'
      ? Number(book.digital_price ?? book.price)
      : Number(book.physical_price ?? book.price)

    // Buscar afiliado pelo slug (se houver)
    let affiliateId: string | null = null
    if (affiliateSlug) {
      const { data: link } = await supabase
        .from('affiliate_links')
        .select('affiliate_id')
        .eq('slug', affiliateSlug)
        .eq('book_id', bookId)
        .single()
      if (link) affiliateId = link.affiliate_id
    }

    // Buscar gráfica disponível (menor custo)
    let printerId: string | null = null
    let printCost = 0
    if (type === 'physical' && book.pages) {
      const { data: printers } = await supabase
        .from('printers')
        .select('id, price_per_page')
        .eq('active', true)
        .order('price_per_page', { ascending: true })
        .limit(1)
      if (printers && printers.length > 0) {
        const printer = printers[0]
        printerId = printer.id
        printCost = parseFloat((book.pages * Number(printer.price_per_page ?? 0.05)).toFixed(2))
      }
    }

    // Criar venda
    const { data: sale, error: saleError } = await supabase.from('sales').insert({
      book_id:          bookId,
      buyer_id:         user.id,
      affiliate_id:     affiliateId,
      printer_id:       printerId,       // ← sempre associa gráfica quando físico
      type,
      status:           'pending',
      total:            price,
      print_cost:       printCost,
      author_share:     0,
      affiliate_share:  0,
      platform_share:   0,
      printer_share:    0,
      delivery_address: deliveryAddress ?? null,
    }).select().single()

    if (saleError) return NextResponse.json({ error: saleError.message }, { status: 500 })

    // Buscar perfil do comprador
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    // Criar/buscar customer no Asaas
    const customerRes = await fetch(`${ASAAS_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        name:              profile?.full_name ?? 'Cliente Amplia',
        email:             profile?.email ?? user.email,
        externalReference: user.id,
      }),
    })
    const customer = await customerRes.json()

    if (!customer.id) {
      return NextResponse.json({ error: 'Erro ao criar cliente no Asaas' }, { status: 500 })
    }

    // Criar cobrança PIX
    const paymentRes = await fetch(`${ASAAS_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        customer:          customer.id,
        billingType:       'PIX',
        value:             price,
        dueDate:           new Date(Date.now() + 30 * 60 * 1000).toISOString().split('T')[0],
        description:       `${book.title} — ${type === 'digital' ? 'Digital' : 'Físico'}`,
        externalReference: sale.id,
      }),
    })
    const payment = await paymentRes.json()

    if (!payment.id) {
      // Limpar venda pendente se Asaas falhou
      await supabase.from('sales').delete().eq('id', sale.id)
      return NextResponse.json({ error: 'Erro ao criar cobrança no Asaas' }, { status: 500 })
    }

    return NextResponse.json({
      saleId:    sale.id,
      pixQrCode: payment.pixQrCodeImage,
      pixKey:    payment.pixAddressKey,
      paymentId: payment.id,
      value:     price,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
