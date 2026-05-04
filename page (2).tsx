import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import {
  Users, ArrowRight, DollarSign, TrendingUp, Link2,
  CheckCircle, Zap, Flame, Shield, BarChart3, QrCode, Share2,
} from 'lucide-react'

export const metadata = {
  title: 'Para Afiliados — Ganhe comissão indicando livros | Amplia',
  description: 'Divulgue livros com seu link exclusivo e ganhe até 20% em cada venda confirmada. Sem investimento, sem estoque. Cadastre-se gratuitamente na Amplia.',
}

const BENEFITS = [
  { Icon: Link2,    title: 'Link exclusivo por livro', desc: 'Cada link gerado tem seu ID. Toda venda vinda do seu link credita a comissão automaticamente.' },
  { Icon: DollarSign,title:'Comissão automática',      desc: 'No momento que o PIX é confirmado, sua parte cai no painel. Sem aprovação manual.' },
  { Icon: BarChart3, title: 'Métricas em tempo real',  desc: 'Veja cliques, conversões e comissões por livro. Saiba o que está funcionando.' },
  { Icon: QrCode,    title: 'QR Code pronto',          desc: 'Cada link tem um QR code gerado para usar em materiais físicos, stories e apresentações.' },
  { Icon: Share2,    title: 'Loja personalizada',      desc: 'Monte sua vitrine de afiliado com os livros que você escolher divulgar.' },
  { Icon: Shield,    title: 'Zero investimento',       desc: 'Não precisa comprar, armazenar ou entregar nada. Só divulgar e ganhar.' },
]

const STEPS = [
  { n: '01', title: 'Crie sua conta',       desc: 'Cadastro gratuito. Escolha o perfil Afiliado na seleção de role.' },
  { n: '02', title: 'Escolha seus livros',  desc: 'Navegue pelo catálogo e selecione os livros que quer divulgar.' },
  { n: '03', title: 'Gere seu link',        desc: 'Um clique cria seu link exclusivo e QR code para cada livro.' },
  { n: '04', title: 'Compartilhe e ganhe',  desc: 'Divulgue onde quiser. A comissão é creditada em cada venda confirmada.' },
]

const LEVELS = [
  { Icon: Zap,        label: 'Iniciante',    sub: '0 a 10 vendas',  color: 'text-gray-500',   bg: 'bg-gray-100'    },
  { Icon: TrendingUp, label: 'Top Afiliado', sub: '50+ vendas',     color: 'text-green-600',  bg: 'bg-green-100'   },
  { Icon: Flame,      label: 'Elite',        sub: '200+ vendas',    color: 'text-[#F97316]',  bg: 'bg-orange-100'  },
]

const FAQ = [
  { q: 'Preciso pagar algo para ser afiliado?', a: 'Não. O cadastro é gratuito e não há mensalidade. Você só ganha — nunca paga.' },
  { q: 'Quanto recebo por venda?',              a: 'Por padrão, 20% do lucro líquido de cada venda que vier pelo seu link. O percentual exato é exibido no painel.' },
  { q: 'Posso divulgar qualquer livro?',        a: 'Sim, qualquer livro publicado na Amplia pode ser afiliado. Você escolhe quais divulgar.' },
  { q: 'Quando o dinheiro cai na conta?',       a: 'Assim que o PIX do comprador é confirmado, sua comissão é creditada no seu painel da Amplia.' },
  { q: 'Tem limite de livros que posso divulgar?', a: 'Não. Crie links para quantos livros quiser e monte sua loja de afiliado do jeito que funcionar melhor para você.' },
]

export default function ParaAfiliadosPage() {
  return (
    <>
      <Navbar forceDark />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-green-700 to-emerald-500 overflow-hidden pt-24 pb-20 px-4">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <Users className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Para Afiliados</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Ganhe comissão<br />
              <span className="text-yellow-300">indicando livros</span>
            </h1>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Gere seu link exclusivo, divulgue nos seus canais e receba até 20% de cada venda confirmada — sem investimento, sem estoque.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-orange hover:-translate-y-0.5">
                Quero ser afiliado <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/livros"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
                Ver catálogo
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: '20%',    sub: 'de comissão' },
                { value: 'Grátis', sub: 'para cadastrar' },
                { value: '0',      sub: 'investimento' },
              ].map(({ value, sub }) => (
                <div key={sub} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-green-200 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">Vantagens exclusivas</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Por que ser afiliado Amplia?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Passo a passo */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Como começar a ganhar</h2>
              <p className="text-gray-500">Em 4 passos você já está gerando comissões.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                  <span className="text-4xl font-bold text-gray-100 absolute top-4 right-5 leading-none select-none">{n}</span>
                  <p className="text-green-600 font-bold text-sm mb-2">{n}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Níveis */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-[#F97316] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" /> Programa de níveis
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Suba de nível e ganhe mais</h2>
            <p className="text-gray-500 mb-12">Quanto mais você vende, mais visibilidade e benefícios você recebe dentro da plataforma.</p>
            <div className="grid grid-cols-3 gap-6">
              {LEVELS.map(({ Icon, label, sub, color, bg }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                  <p className="text-gray-500 text-xs">{sub}</p>
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
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    {q}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-700 py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Comece a ganhar hoje</h2>
            <p className="text-green-200 mb-8 text-lg">Crie sua conta, escolha os livros e compartilhe seu link. É isso.</p>
            <Link href="/auth/cadastro"
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-orange">
              Criar conta grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
