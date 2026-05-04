import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, topic, message } = body

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    await sendContactEmail({ name, email, topic, message })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
