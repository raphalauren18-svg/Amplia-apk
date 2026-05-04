import Link from 'next/link'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { HowItWorks } from '@/components/landing/how-it-works'
import {
  BookOpen, ArrowRight, Users, Printer,
  ShoppingBag, Star, Shield, Zap,
} from 'lucide-react'

export const metadata = {
  title: 'Amplia — Publique, Venda e Distribua seus Livros',
  description: 'Plataforma completa para autores independentes. Publique seu livro, conecte-se com gráficas parceiras e venda através de afiliados em todo o Brasil.',
}

const STATS = [
  { value: '100%',    label: 'Gratuito para publicar' },
  { value: 'até 70%', label: 'De lucro para o autor'  },
  { value: 'Brasil',  label: 'Entrega em todo o país' },
]

const AUDIENCES = [
  {
    Icon: BookOpen,
    title: 'Autores',
    desc:  'Publique seu livro sem custo, defina seu preço e acompanhe cada venda em tempo real.',
    href:  '/para-autores',
    cta:   'Quero publicar',
  },
  {
    Icon: ShoppingBag,
    title: 'Leitores',
    desc:  'Descubra livros independentes brasileiros em digital e físico, com entrega em casa.',
    href:  '/para-leitores',
    cta:   'Ver catálogo',
  },
  {
    Icon: Users,
    title: 'Afiliados',
    desc:  'Indique livros com seu link e ganhe comissão em cada venda realizada.',
    href:  '/para-afiliados',
    cta:   'Quero ser afiliado',
  },
  {
    Icon: Printer,
    title: 'Gráficas',
    desc:  'Receba pedidos de impressão sob demanda sem necessidade de estoque.',
    href:  '/para-graficas',
    cta:   'Ser parceira',
  },
]

const FEATURES = [
  { Icon: Zap,    title: 'Publicação em minutos',    desc: 'Suba seu PDF e publique imediatamente, sem burocracia.' },
  { Icon: Shield, title: 'Pagamentos seguros',       desc: 'Processamos via Asaas com Pix e cartão de crédito.' },
  { Icon: Star,   title: 'Royalties transparentes',  desc: 'Veja exatamente quanto você ganha em cada venda.' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-brand-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            Plataforma independente 100% brasileira
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
            Publique, venda e distribua{' '}
            <span className="text-yellow-300">seus livros</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Da publicação à entrega física, tudo numa plataforma. Sem estoque, sem custo inicial, sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-brand font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              Criar conta grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/livros"
              className="border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-display font-bold text-yellow-300">{value}</p>
                <p className="text-xs text-blue-200 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
              A Amplia é para todos
            </h2>
            <p className="text-gray-500 text-lg">Escolha como você quer fazer parte do ecossistema.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AUDIENCES.map(({ Icon, title, desc, href, cta }) => (
              <div key={title} className="group border border-gray-200 rounded-2xl p-6 hover:border-brand hover:shadow-md transition-all">
                <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
                <Link
                  href={href}
                  className="text-brand text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
              Tudo que você precisa em um só lugar
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-brand py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Pronto para publicar seu livro?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Crie sua conta gratuitamente e publique seu primeiro livro ainda hoje.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-brand font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Começar agora — é grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
