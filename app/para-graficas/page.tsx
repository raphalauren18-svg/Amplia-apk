import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import {
  Printer, ArrowRight, Package, Shield, TrendingUp,
  CheckCircle, Truck, DollarSign, Clock, BarChart3, Layers,
} from 'lucide-react'

export const metadata = {
  title: 'Para Gráficas — Receba pedidos de impressão sob demanda | Amplia',
  description: 'Seja uma gráfica parceira da Amplia. Receba pedidos de impressão de livros independentes, sem captação de clientes. Produção sob demanda, pagamento garantido.',
}

const BENEFITS = [
  { Icon: Package,   title: 'Pedidos sem captação',      desc: 'Autores da plataforma geram demanda automaticamente. Você só produz — sem prospectar, sem comercial.' },
  { Icon: DollarSign,title: 'Pagamento garantido',       desc: 'O pedido só chega até você depois que o PIX do comprador foi confirmado. Zero risco de inadimplência.' },
  { Icon: Shield,    title: 'Sem estoque',                desc: 'Cada pedido é único. Sem overruns, sem encalhe, sem galpão cheio de livros parados.' },
  { Icon: BarChart3, title: 'Dashboard de produção',     desc: 'Visualize fila de impressão, status de pedidos e receita em um painel completo.' },
  { Icon: Truck,     title: 'Controle da entrega',       desc: 'Você atualiza o status (imprimindo → enviado → entregue) e o comprador recebe notificações automáticas.' },
  { Icon: TrendingUp,title: 'Demanda crescente',         desc: 'Cada novo autor cadastrado na Amplia é um cliente potencial. A demanda cresce com a plataforma.' },
]

const STEPS = [
  { n: '01', title: 'Cadastre sua gráfica', desc: 'Crie uma conta, escolha o perfil Gráfica e preencha seu preço por página.' },
  { n: '02', title: 'Receba pedidos',       desc: 'Quando um leitor compra um físico, o pedido aparece na sua fila de produção.' },
  { n: '03', title: 'Produza e envie',      desc: 'Imprima conforme as especificações do livro e envie para o endereço do comprador.' },
  { n: '04', title: 'Receba seu valor',     desc: 'Assim que confirmar o envio, sua parte da receita é creditada no painel.' },
]

const SPECS = [
  { label: 'Número de páginas',  desc: 'Informado pelo autor no cadastro do livro' },
  { label: 'Espessura da lombada', desc: 'Calculada automaticamente em mm' },
  { label: 'Orelha',             desc: 'Indicado se o livro tem orelha' },
  { label: 'Capa',               desc: 'Imagem de alta resolução disponível para download' },
  { label: 'Endereço de entrega',desc: 'Fornecido pelo comprador no checkout' },
]

const FAQ = [
  { q: 'Preciso pagar para ser parceira?',   a: 'Não. O cadastro é gratuito. Você define seu preço por página e recebe pelos pedidos produzidos.' },
  { q: 'Como defino meu preço?',             a: 'Você informa o preço por página no seu perfil. O sistema usa esse valor para calcular o custo total e escolher a gráfica disponível.' },
  { q: 'Posso recusar pedidos?',             a: 'Os pedidos chegam automaticamente para a gráfica selecionada. Você pode contatar o suporte em casos de impossibilidade de produção.' },
  { q: 'Como recebo os arquivos para impressão?', a: 'O PDF do miolo e a capa ficam disponíveis no seu painel quando o pedido entra na fila.' },
  { q: 'Há volume mínimo?',                  a: 'Não. Você pode produzir um único exemplar por pedido. A impressão sob demanda é justamente esse modelo.' },
]

export default function ParaGraficasPage() {
  return (
    <>
      <Navbar forceDark />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#F97316] to-[#FBBF24] overflow-hidden pt-24 pb-20 px-4">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-8">
              <Printer className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Para Gráficas Parceiras</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Pedidos de impressão<br />
              <span className="text-white/80">sem captação de clientes</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Seja parceira da Amplia e receba pedidos de livros independentes sob demanda. Você produz e envia — nós garantimos o pagamento antecipado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#F97316] font-bold px-8 py-4 rounded-full text-lg transition-all hover:bg-gray-50 shadow-lg hover:-translate-y-0.5">
                Quero ser parceira <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/como-funciona"
                className="inline-flex items-center justify-center border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
                Como funciona
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: '0',       sub: 'captação necessária' },
                { value: 'Pago',    sub: 'antes de produzir' },
                { value: '1+',      sub: 'exemplares por pedido' },
              ].map(({ value, sub }) => (
                <div key={sub} className="bg-white/20 border border-white/20 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-white/80 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-[#F97316] rounded-full text-sm font-medium mb-4">Por que parceirar com a Amplia</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Produção garantida, pagamento na frente</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Especificações recebidas */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#0D1B8E] rounded-full text-sm font-medium mb-4">Informações por pedido</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">O que você recebe em cada pedido</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {SPECS.map(({ label, desc }, i) => (
                <div key={label} className={`flex items-start gap-4 p-5 ${i < SPECS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Como a parceria funciona</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                  <span className="text-4xl font-bold text-gray-100 absolute top-4 right-5 leading-none select-none">{n}</span>
                  <p className="text-[#F97316] font-bold text-sm mb-2">{n}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Dúvidas frequentes</h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                    {q}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#F97316] to-[#FBBF24] py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Torne-se uma gráfica parceira</h2>
            <p className="text-white/90 mb-8 text-lg">Cadastre-se gratuitamente e comece a receber pedidos de produção.</p>
            <Link href="/auth/cadastro"
              className="inline-flex items-center gap-2 bg-white text-[#F97316] font-bold px-10 py-4 rounded-full text-lg transition-colors hover:bg-gray-50 shadow-lg">
              Criar conta grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
