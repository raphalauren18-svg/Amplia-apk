import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import { BookOpen, Users, Printer, ShoppingBag, Mail, ArrowRight, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Central de Ajuda | Amplia',
  description: 'Encontre respostas sobre publicação de livros, comissões de afiliados, impressão sob demanda e suporte ao comprador na Amplia.',
}

const CATEGORIES = [
  {
    Icon: BookOpen,
    title: 'Autores',
    color: 'text-[#0D1B8E]',
    bg: 'bg-blue-50',
    href: '#autores',
    faqs: [
      { q: 'Como publico meu livro na Amplia?',         a: 'Crie uma conta com perfil Autor, acesse "Meus Livros" e clique em "Novo Livro". Envie o PDF, a capa e preencha as informações. Após análise (até 48h), seu livro vai ao ar.' },
      { q: 'Quanto custa publicar?',                    a: 'Nada. A publicação é 100% gratuita. Você só paga quando vende — na forma de percentual que fica com a plataforma.' },
      { q: 'Posso definir o preço do meu livro?',       a: 'Sim. Você define o preço digital e o preço físico separadamente, com total liberdade.' },
      { q: 'Como funciona o pagamento ao autor?',       a: 'Cada venda confirmada via PIX credita automaticamente sua parte no painel. O saque segue o ciclo de pagamento disponível no painel.' },
      { q: 'O que acontece se meu livro for rejeitado?', a: 'Você recebe um e-mail com o motivo da rejeição. Corrija o que foi apontado e reenvie para análise.' },
      { q: 'Posso editar meu livro após publicar?',     a: 'Sim. Acesse "Meus Livros", clique no livro e depois em "Editar". Alterações de preço são aplicadas imediatamente.' },
    ],
  },
  {
    Icon: Users,
    title: 'Afiliados',
    color: 'text-green-700',
    bg: 'bg-green-50',
    href: '#afiliados',
    faqs: [
      { q: 'Como me torno afiliado?',                    a: 'Cadastre-se com o perfil Afiliado. Acesse o catálogo, clique em um livro e gere seu link exclusivo.' },
      { q: 'Como minha comissão é calculada?',           a: 'Você recebe uma porcentagem do lucro líquido de cada venda vinda do seu link. O percentual exato é exibido no painel.' },
      { q: 'Posso ser afiliado e autor ao mesmo tempo?', a: 'Cada conta tem um perfil. Para acumular funções, crie contas separadas com e-mails diferentes.' },
      { q: 'Meu link tem validade?',                     a: 'Não. Seus links são permanentes enquanto o livro estiver publicado na plataforma.' },
      { q: 'Onde vejo minhas comissões?',                a: 'No menu lateral, acesse "Comissões". Lá você vê histórico completo por livro e por data.' },
    ],
  },
  {
    Icon: Printer,
    title: 'Gráficas',
    color: 'text-[#F97316]',
    bg: 'bg-orange-50',
    href: '#graficas',
    faqs: [
      { q: 'Como recebo os pedidos?',                    a: 'Pedidos aparecem automaticamente na sua fila de produção no painel assim que o PIX do comprador é confirmado.' },
      { q: 'Como atualizo o status de um pedido?',       a: 'Acesse "Produção" e use os botões de ação em cada pedido para mover entre: imprimindo → enviado → entregue.' },
      { q: 'O comprador é notificado das atualizações?', a: 'Sim. A cada mudança de status, o comprador recebe um e-mail automático via Resend.' },
      { q: 'Como defino meu preço por página?',          a: 'No perfil da sua gráfica, você informa o preço por página. O sistema usa esse valor para calcular o custo total de cada pedido.' },
      { q: 'Quando recebo pelo pedido?',                 a: 'Sua parte é creditada no painel assim que você marca o pedido como "enviado". O saque segue o ciclo de pagamento.' },
    ],
  },
  {
    Icon: ShoppingBag,
    title: 'Compradores',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    href: '#compradores',
    faqs: [
      { q: 'Como acesso meu livro digital após a compra?', a: 'Após a confirmação do PIX, o livro aparece em "Minha Biblioteca". Clique em "Ler agora" para abrir o leitor.' },
      { q: 'Qual o prazo para o livro físico?',           a: 'O prazo depende da gráfica parceira e da sua localização. Você é notificado por e-mail em cada etapa da produção e envio.' },
      { q: 'Posso ler em outros dispositivos?',           a: 'Sim. O leitor é web — acesse em qualquer navegador com a mesma conta e seu progresso será sincronizado.' },
      { q: 'Posso solicitar reembolso?',                  a: 'Para produtos digitais com defeito comprovado, reembolsos podem ser solicitados em até 7 dias. Entre em contato pelo suporte.' },
      { q: 'O PIX é seguro?',                             a: 'Sim. Os pagamentos são processados pelo Asaas, empresa regulamentada pelo Banco Central do Brasil.' },
    ],
  },
]

export default function AjudaPage() {
  return (
    <>
      <Navbar forceDark />
      <main className="pt-24 pb-20">

        {/* Header */}
        <section className="bg-gradient-to-br from-[#0D1B8E] to-[#4A7AFF] py-16 px-4 text-center mb-16">
          <div className="absolute inset-0 bg-navy-pattern opacity-50" />
          <div className="relative max-w-2xl mx-auto">
            <h1 className="text-4xl font-display font-bold text-white mb-4">Central de Ajuda</h1>
            <p className="text-blue-200 text-lg mb-8">Encontre respostas para as dúvidas mais comuns sobre a Amplia.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {CATEGORIES.map(({ title, href, Icon, color, bg }) => (
                <a key={title} href={href}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                  <Icon className="w-4 h-4" />
                  {title}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 space-y-16">
          {CATEGORIES.map(({ Icon, title, color, bg, href, faqs }) => (
            <section key={title} id={href.slice(1)}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-900">{title}</h2>
              </div>
              <div className="space-y-4">
                {faqs.map(({ q, a }) => (
                  <details key={q} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{q}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 text-xl leading-none">+</span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Ainda com dúvidas */}
        <section className="mt-20 bg-gray-50 py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <MessageCircle className="w-10 h-10 text-[#4A7AFF] mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Ainda com dúvidas?</h2>
            <p className="text-gray-500 mb-8">Nosso time de suporte está disponível para ajudar você.</p>
            <Link href="/contato"
              className="inline-flex items-center gap-2 bg-[#0D1B8E] hover:bg-[#4A7AFF] text-white font-bold px-8 py-4 rounded-xl transition-colors">
              <Mail className="w-4 h-4" /> Falar com o suporte
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
