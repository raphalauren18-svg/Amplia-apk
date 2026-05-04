import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'noreply@amplia.com.br'

/* ── Tipagens ─────────────────────────────────────────────────────────────── */

interface OrderStatusEmailParams {
  to:        string
  buyerName: string
  bookTitle: string
  status:    'confirmed' | 'printing' | 'shipped' | 'delivered'
  trackingCode?: string
}

interface BookApprovalEmailParams {
  to:        string
  authorName: string
  bookTitle:  string
  approved:   boolean
  reason?:    string
}

interface ContactEmailParams {
  name:    string
  email:   string
  topic:   string
  message: string
}

/* ── Templates inline (HTML simples, sem dependências extras) ─────────────── */

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#f4f4f5; font-family: system-ui, sans-serif; }
  .wrap { max-width:560px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; }
  .header { background:#0D1B8E; padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:22px; font-weight:700; letter-spacing:-0.3px; }
  .header p  { color:#a5b4fc; margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; color:#1e293b; font-size:15px; line-height:1.65; }
  .btn { display:inline-block; margin:20px 0; padding:12px 28px; background:#0D1B8E; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px; }
  .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600; }
  .badge-green  { background:#dcfce7; color:#166534; }
  .badge-red    { background:#fee2e2; color:#991b1b; }
  .badge-blue   { background:#dbeafe; color:#1e40af; }
  .footer { padding:20px 32px; background:#f8fafc; color:#94a3b8; font-size:12px; border-top:1px solid #e2e8f0; }
</style>
</head>
<body><div class="wrap">${content}</div></body></html>`
}

/* ── Funções públicas ─────────────────────────────────────────────────────── */

export async function sendOrderStatusEmail({
  to, buyerName, bookTitle, status, trackingCode,
}: OrderStatusEmailParams) {
  const labels: Record<string, { label: string; msg: string }> = {
    confirmed: { label: 'Pedido confirmado',  msg: 'Seu pagamento foi confirmado e o pedido está sendo processado.' },
    printing:  { label: 'Em impressão',       msg: 'Seu livro está sendo impresso pela gráfica parceira.' },
    shipped:   { label: 'Enviado',            msg: 'Seu livro foi enviado pelos Correios.' },
    delivered: { label: 'Entregue',           msg: 'Seu livro foi entregue. Aproveite a leitura!' },
  }

  const { label, msg } = labels[status]

  const html = baseTemplate(`
    <div class="header">
      <h1>Amplia</h1>
      <p>Atualização do seu pedido</p>
    </div>
    <div class="body">
      <p>Olá, <strong>${buyerName}</strong>!</p>
      <p><span class="badge badge-blue">${label}</span></p>
      <p>Livro: <strong>${bookTitle}</strong></p>
      <p>${msg}</p>
      ${trackingCode ? `<p>Código de rastreio: <strong>${trackingCode}</strong></p>` : ''}
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Ver meus pedidos</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Amplia — Todos os direitos reservados</div>
  `)

  return resend.emails.send({
    from:    FROM,
    to,
    subject: `[Amplia] ${label} — ${bookTitle}`,
    html,
  })
}

export async function sendBookApprovalEmail({
  to, authorName, bookTitle, approved, reason,
}: BookApprovalEmailParams) {
  const html = baseTemplate(`
    <div class="header">
      <h1>Amplia</h1>
      <p>Avaliação do seu livro</p>
    </div>
    <div class="body">
      <p>Olá, <strong>${authorName}</strong>!</p>
      <p>
        <span class="badge ${approved ? 'badge-green' : 'badge-red'}">
          ${approved ? 'Aprovado' : 'Reprovado'}
        </span>
      </p>
      <p>Seu livro <strong>"${bookTitle}"</strong> foi ${approved ? 'aprovado e já está disponível no catálogo' : 'reprovado pela nossa equipe de curadoria'}.</p>
      ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/livros">Ver meus livros</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Amplia — Todos os direitos reservados</div>
  `)

  return resend.emails.send({
    from:    FROM,
    to,
    subject: `[Amplia] Seu livro foi ${approved ? 'aprovado' : 'reprovado'} — ${bookTitle}`,
    html,
  })
}

export async function sendContactEmail({ name, email, topic, message }: ContactEmailParams) {
  const html = baseTemplate(`
    <div class="header">
      <h1>Amplia</h1>
      <p>Nova mensagem de contato</p>
    </div>
    <div class="body">
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Assunto:</strong> ${topic}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Amplia</div>
  `)

  return resend.emails.send({
    from:     FROM,
    to:       FROM,
    replyTo:  email,
    subject:  `[Contato] ${topic} — ${name}`,
    html,
  })
}
