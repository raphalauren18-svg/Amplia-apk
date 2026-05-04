import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderStatusEmail, sendBookApprovalEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, payment } = body

    if (!payment?.externalReference) {
      return NextResponse.json({ ok: true })
    }

    const admin  = createAdminClient()
    const saleId = payment.externalReference

    /* ── PAGAMENTO CONFIRMADO ─────────────────────────────── */
    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const { data: sale } = await admin
        .from('sales')
        .select('*, books(title, pages, spine_mm, has_ear_flap, pdf_url, author_id, authors(user_id)), profiles:buyer_id(full_name, email)')
        .eq('id', saleId)
        .single()

      if (!sale) return NextResponse.json({ error: 'Venda não encontrada' }, { status: 404 })

      const total        = Number(payment.value ?? sale.total)
      const printCost    = Number(sale.print_cost ?? 0)
      const profit       = total - printCost
      const hasAffiliate = !!sale.affiliate_id

      // Splits — usa platform_settings quando disponível, fallback hardcoded
      const { data: settings } = await admin
        .from('platform_settings')
        .select('key, value')
        .in('key', [
          'author_share_digital_no_affiliate',
          'author_share_digital_with_affiliate',
          'affiliate_share_digital',
          'author_share_physical_no_affiliate',
          'author_share_physical_with_affiliate',
          'affiliate_share_physical',
        ])

      const cfg = Object.fromEntries((settings ?? []).map((r: any) => [r.key, Number(r.value) / 100]))

      let authorPct: number, affiliatePct: number, platformPct: number

      if (sale.type === 'digital') {
        authorPct    = hasAffiliate ? (cfg['author_share_digital_with_affiliate']  ?? 0.60) : (cfg['author_share_digital_no_affiliate']  ?? 0.70)
        affiliatePct = hasAffiliate ? (cfg['affiliate_share_digital'] ?? 0.20) : 0
      } else {
        authorPct    = hasAffiliate ? (cfg['author_share_physical_with_affiliate'] ?? 0.60) : (cfg['author_share_physical_no_affiliate'] ?? 0.70)
        affiliatePct = hasAffiliate ? (cfg['affiliate_share_physical'] ?? 0.20) : 0
      }
      platformPct = 1 - authorPct - affiliatePct

      const authorShare    = parseFloat((profit * authorPct).toFixed(2))
      const affiliateShare = parseFloat((profit * affiliatePct).toFixed(2))
      const platformShare  = parseFloat((profit * platformPct).toFixed(2))
      const printerShare   = printCost // gráfica recebe o custo de impressão

      // Atualizar venda
      await admin.from('sales').update({
        status:           'paid',
        asaas_payment_id: payment.id,
        total,
        author_share:     authorShare,
        affiliate_share:  affiliateShare,   // ← campo correto do schema
        printer_share:    printerShare,
        platform_share:   platformShare,
        updated_at:       new Date().toISOString(),
      }).eq('id', saleId)

      // ── XP do autor (50 XP por venda) ─────────────────────
      if (sale.books?.author_id) {
        await admin
          .from('author_xp')
          .upsert({
            author_id:   sale.books.author_id,
            total_xp:    50,
            total_sales: 1,
            updated_at:  new Date().toISOString(),
          }, { onConflict: 'author_id', ignoreDuplicates: false })
          .then(async () => {
            // Incrementar usando RPC se existir, senão faz update manual
            const { data: current } = await admin
              .from('author_xp')
              .select('total_xp, total_sales')
              .eq('author_id', sale.books.author_id)
              .single()
            if (current) {
              await admin.from('author_xp').update({
                total_xp:   (current.total_xp   ?? 0) + 50,
                total_sales:(current.total_sales ?? 0) + 1,
                updated_at: new Date().toISOString(),
              }).eq('author_id', sale.books.author_id)
            }
          })
          .catch(() => {})
      }

      // ── XP do afiliado (30 XP por venda) ──────────────────
      if (sale.affiliate_id) {
        const { data: affXp } = await admin
          .from('affiliate_xp')
          .select('total_xp, total_sales, total_revenue')
          .eq('affiliate_id', sale.affiliate_id)
          .single()
        if (affXp) {
          await admin.from('affiliate_xp').update({
            total_xp:     (affXp.total_xp    ?? 0) + 30,
            total_sales:  (affXp.total_sales  ?? 0) + 1,
            total_revenue:(affXp.total_revenue ?? 0) + affiliateShare,
            updated_at:   new Date().toISOString(),
          }).eq('affiliate_id', sale.affiliate_id)
        }
      }

      // ── XP do leitor (20 XP por compra) ───────────────────
      if (sale.buyer_id) {
        const { data: readerXp } = await admin
          .from('reader_xp')
          .select('total_xp, books_acquired')
          .eq('reader_id', sale.buyer_id)
          .single()
        if (readerXp) {
          await admin.from('reader_xp').update({
            total_xp:       (readerXp.total_xp       ?? 0) + 20,
            books_acquired: (readerXp.books_acquired  ?? 0) + 1,
            updated_at:     new Date().toISOString(),
          }).eq('reader_id', sale.buyer_id)
        } else {
          await admin.from('reader_xp').insert({
            reader_id:      sale.buyer_id,
            total_xp:       20,
            books_acquired: 1,
          }).catch(() => {})
        }
      }

      // ── Notificar comprador por email ──────────────────────
      if (sale.profiles?.email) {
        await sendOrderStatusEmail({
          to:        sale.profiles.email,
          buyerName: sale.profiles.full_name ?? 'Cliente',
          bookTitle: sale.books?.title ?? 'Livro',
          status:    'paid',
          orderId:   saleId,
        }).catch(() => {})
      }
    }

    /* ── PAGAMENTO VENCIDO / CANCELADO ───────────────────── */
    if (event === 'PAYMENT_OVERDUE' || event === 'PAYMENT_DELETED') {
      await admin.from('sales').update({
        status:     'cancelled',
        updated_at: new Date().toISOString(),
      }).eq('id', saleId)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[Asaas webhook]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
