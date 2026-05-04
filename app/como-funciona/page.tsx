import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { HowItWorks } from '@/components/landing/how-it-works'
import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Printer, Store } from 'lucide-react'

const ROLES = [
  {
    Icon: BookOpen,
    title: 'Para Autores',
    desc: 'Publique seu livro, defina o preço e acompanhe suas vendas em tempo real. Sem burocracia.',
    href: '/auth/cadastro',
    color: 'text-[#0D1B8E]',
    bg: 'bg-blue-50',
    cta: 'Quero publicar',
  },
  {
    Icon: Store,
    title: 'Para Afiliados',
    desc: 'Indique livros com seu link exclusivo e ganhe comissão em cada venda. Renda extra sem esforço.',
    href: '/auth/cadastro',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    cta: 'Quero afiliar',
  },
  {
    Icon: Printer,
    title: 'Para Gráficas',
    desc: 'Receba pedidos de impressão de autores independentes. Sem captação de clientes, só produção.',
    href: '/auth/cadastro',
    color: 'text-[#F97316]',
    bg: 'bg-orange-50',
    cta: 'Quero produzir',
  },
  {
    Icon: Users,
    title: 'Para Leitores',
    desc: 'Descubra obras únicas de autores brasileiros. Compre digital ou físico impresso sob demanda.',
    href: '/livros',
    color: 'text-green-600',
    bg: 'bg-green-50',
    cta: 'Ver catálogo',
  },
]

export default function ComoFuncionaPage() {
  return (
    <>
      <Navbar forceDark />
      <main className="pt-24 pb-20">

        {/* Hero da página */}
        <section className="max-w-4xl mx-auto px-4 text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#0D1B8E] rounded-full text-sm font-medium mb-6">
            Simples e transparente
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
            Como a <span className="text-[#0D1B8E]">Amplia</span> funciona
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Uma plataforma que conecta autores, afiliados, gráficas e leitores em um ecossistema editorial independente.
          </p>
        </section>

        {/* Componente de passos */}
        <HowItWorks />

        {/* Para quem é */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Para quem é a Amplia?</h2>
            <p className="text-gray-500 text-lg">Cada participante tem um papel e uma recompensa justa</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLES.map(({ Icon, title, desc, href, color, bg, cta }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex flex-col">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{desc}</p>
                <Link href={href}
                  className={`flex items-center gap-2 text-sm font-medium ${color} hover:gap-3 transition-all`}>
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#0D1B8E] py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-blue-200 mb-8">
              Crie sua conta gratuitamente e faça parte do movimento editorial independente brasileiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/cadastro"
                className="bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                Criar conta grátis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/livros"
                className="border border-white/30 hover:bg-white/10 text-white font-medium px-8 py-4 rounded-xl transition-colors">
                Ver catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
