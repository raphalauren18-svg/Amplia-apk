import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import {
  BookOpen, CheckCircle, ArrowRight, DollarSign, TrendingUp,
  Trophy, Star, Medal, Crown, BarChart3, Upload, Eye,
  Zap, Shield, Package,
} from 'lucide-react'

export const metadata = {
  title: 'Para Autores — Publique seu livro sem gastar nada | Amplia',
  description: 'Publique seu livro digital e físico de graça. Defina seu preço, acompanhe vendas em tempo real e receba até 70% do lucro líquido. Cadastre-se na Amplia.',
}

const BENEFITS = [
  { Icon: Upload,    title: 'Publicação gratuita',    desc: 'Suba seu PDF, defina o preço e publique em minutos. Sem taxa, sem contrato.' },
  { Icon: DollarSign,title: 'Até 70% do lucro',       desc: 'Você fica com a maior parte. O restante vai para afiliado e plataforma — de forma transparente.' },
  { Icon: Package,   title: 'Físico sem estoque',      desc: 'A gráfica só imprime quando a venda acontece. Você não precisa comprar nada antecipado.' },
  { Icon: BarChart3, title: 'Dashboard completo',      desc: 'Acompanhe vendas, receita, ranking e XP em tempo real no seu painel.' },
  { Icon: Eye,       title: 'Vitrine profissional',    desc: 'Capa, descrição, ISBN e preço digital/físico numa página de vendas pronta.' },
  { Icon: Zap,       title: 'Gamificação e conquistas',desc: 'Ganhe XP, suba de nível e apareça no ranking de autores em destaque.' },
]

const STEPS = [
  { n: '01', title: 'Crie sua conta',     desc: 'Cadastro gratuito em menos de 1 minuto. Escolha o perfil Autor.' },
  { n: '02', title: 'Suba seu livro',     desc: 'Envie o PDF, a capa e preencha os dados. Ficará em análise por até 48h.' },
  { n: '03', title: 'Receba aprovação',   desc: 'Após aprovação, seu livro aparece no catálogo e fica disponível para compra.' },
  { n: '04', title: 'Venda e receba',     desc: 'Cada venda confirmada no PIX credita automaticamente a sua parte no painel.' },
]

const LEVELS = [
  { Icon: Star,  label: 'Iniciante',     sub: 'Primeiro livro publicado', color: 'text-gray-500',    bg: 'bg-gray-100'    },
  { Icon: Medal, label: 'Profissional',  sub: '5 ou mais livros',         color: 'text-[#4A7AFF]',   bg: 'bg-blue-100'    },
  { Icon: Crown, label: 'Destaque',      sub: 'Top 10 da plataforma',     color: 'text-yellow-600',  bg: 'bg-yellow-100'  },
]

const FAQ = [
  { q: 'É realmente gratuito publicar?',           a: 'Sim. Não cobramos taxa de publicação, mensalidade ou percentual de entrada. Ganhamos apenas quando você vende.' },
  { q: 'Eu mantenho meus direitos autorais?',      a: 'Totalmente. Você cede à Amplia apenas uma licença de distribuição não exclusiva. Seus direitos são inteiramente seus.' },
  { q: 'Como funciona o livro físico?',             a: 'Quando alguém compra o físico, a gráfica parceira imprime e envia. Você não toca em nada — só recebe a sua parte.' },
  { q: 'Quando recebo meu dinheiro?',               a: 'Após a confirmação do PIX, sua parte é creditada no painel. O saque para conta bancária fica disponível conforme o ciclo de pagamento.' },
  { q: 'Posso ter afiliados divulgando meu livro?', a: 'Sim! Afiliados cadastrados podem criar links de divulgação para qualquer livro publicado. Você ganha um pouco menos (60%) mas vende muito mais.' },
]

export default function ParaAutoresPage() {
  return (
    <>
      <Navbar forceDark />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#0D1B8E] to-[#4A7AFF] overflow-hidden pt-24 pb-20 px-4">
          <div className="absolute inset-0 bg-navy-pattern opacity-100" />
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-[#F97316]/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-[#FBBF24]" />
              <span className="text-white/90 text-sm font-medium">Para Autores Independentes</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Publique seu livro<br />
              <span className="text-[#FBBF24]">sem gastar nada</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Suba seu PDF, defina o preço e venda digital e físico sem estoque. Você fica com até 70% do lucro — a Amplia cuida do resto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-orange hover:-translate-y-0.5">
                Publicar meu livro <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/como-funciona"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
                Como funciona
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: 'Grátis', sub: 'para publicar' },
                { value: '70%',    sub: 'do lucro' },
                { value: 'PDF',    sub: '+ físico sob demanda' },
              ].map(({ value, sub }) => (
                <div key={sub} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-blue-200 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#0D1B8E] rounded-full text-sm font-medium mb-4">Tudo que você precisa</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Por que publicar na Amplia?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#0D1B8E]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como publicar */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Como publicar seu livro</h2>
              <p className="text-gray-500">4 passos simples. Do PDF à venda em menos de 48h.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(({ n, title, desc }) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                  <span className="text-4xl font-bold text-gray-100 absolute top-4 right-5 leading-none select-none">{n}</span>
                  <p className="text-[#0D1B8E] font-bold text-sm mb-2">{n}</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Níveis de autor */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" /> Sistema de evolução
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Evolua como autor</h2>
            <p className="text-gray-500 mb-12">Ganhe XP a cada publicação e venda. Suba de nível e apareça em destaque na plataforma.</p>
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
                    <CheckCircle className="w-5 h-5 text-[#4A7AFF] shrink-0 mt-0.5" />
                    {q}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0D1B8E] py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Seu livro merece ser lido</h2>
            <p className="text-blue-200 mb-8 text-lg">Cadastre-se agora e publique seu primeiro livro de graça.</p>
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
