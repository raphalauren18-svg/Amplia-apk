import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import Link from 'next/link'
import {
  BookOpen, ArrowRight, Smartphone, Moon, Bookmark,
  Package, CheckCircle, Library, BarChart3, Star, Wifi,
} from 'lucide-react'

export const metadata = {
  title: 'Para Leitores — Livros independentes digitais e físicos | Amplia',
  description: 'Descubra e compre livros de autores independentes brasileiros. Digital com leitor integrado ou físico impresso sob demanda. Cadastre-se na Amplia.',
}

const BENEFITS = [
  { Icon: BookOpen,  title: 'Autores independentes',   desc: 'Descubra obras únicas que você não encontra nas grandes livrarias — direto do autor para você.' },
  { Icon: Smartphone,title: 'Leitor integrado',        desc: 'Sem baixar nada. Leia diretamente no navegador, no celular ou no computador.' },
  { Icon: Bookmark,  title: 'Continue de onde parou',  desc: 'Seu progresso é salvo automaticamente. Abra em qualquer dispositivo e continue a leitura.' },
  { Icon: Package,   title: 'Físico sob demanda',      desc: 'Prefere papel? Compre o físico e receba impresso em casa pela gráfica parceira.' },
  { Icon: Moon,      title: 'Modo escuro',             desc: 'Leia de noite sem cansar os olhos. O leitor tem modo claro, escuro e ajuste de fonte.' },
  { Icon: Library,   title: 'Biblioteca pessoal',      desc: 'Todos os livros que você comprou ficam na sua biblioteca, para sempre acessíveis.' },
]

const FEATURES = [
  { Icon: BarChart3, label: 'Progresso salvo'    },
  { Icon: Bookmark,  label: 'Marcadores de página' },
  { Icon: Moon,      label: 'Modo escuro'          },
  { Icon: Star,      label: 'Avalie o livro'       },
  { Icon: Smartphone,label: 'Mobile-first'         },
  { Icon: Wifi,      label: 'Funciona offline'     },
]

const FAQ = [
  { q: 'Posso ler no celular?',          a: 'Sim. O leitor é mobile-first, funciona em qualquer navegador moderno, sem instalar nada.' },
  { q: 'O que acontece se eu quiser o físico também?', a: 'Você pode comprar digital e físico separadamente. O digital é liberado instantaneamente após o PIX.' },
  { q: 'Posso baixar o PDF?',            a: 'Por padrão, o acesso é via leitor web protegido para preservar os direitos autorais dos autores. Autores podem liberar download a seu critério.' },
  { q: 'Os livros somem se o autor sair da plataforma?', a: 'Não. Livros comprados ficam na sua biblioteca independente do status do autor.' },
  { q: 'Como pago?',                     a: 'Todos os pagamentos são via PIX, instantâneo e sem taxa extra para o comprador.' },
]

export default function ParaLeitoresPage() {
  return (
    <>
      <Navbar forceDark />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-purple-700 to-violet-600 overflow-hidden pt-24 pb-20 px-4">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-purple-200" />
              <span className="text-white/90 text-sm font-medium">Para Leitores</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Livros que você<br />
              <span className="text-purple-200">não encontra em outro lugar</span>
            </h1>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubra autores independentes brasileiros. Compre digital com leitor integrado ou físico impresso sob demanda — sem assinatura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/livros"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-orange hover:-translate-y-0.5">
                Ver catálogo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/cadastro"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors">
                Criar conta grátis
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: 'PIX',    sub: 'pagamento instantâneo' },
                { value: 'Online', sub: 'leia no navegador' },
                { value: 'Físico', sub: 'impresso sob demanda' },
              ].map(({ value, sub }) => (
                <div key={sub} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-purple-200 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">Experiência completa</span>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Leitura moderna, apoio real a autores</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map(({ Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leitor visual */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Leitor integrado no navegador</h2>
              <p className="text-gray-500">Sem instalar nada. Leia como se fosse um livro real.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Mock leitor */}
              <div className="bg-[#F5F0E8] rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">📖 Seu Livro · Capítulo 3</span>
                  <span className="text-xs text-purple-600 font-medium">Pág 45 / 180</span>
                </div>
                <div className="flex justify-center gap-3 mb-3">
                  {[0, 1].map(i => (
                    <div key={i} className="w-16 h-24 bg-white rounded border border-gray-200 shadow-sm flex flex-col p-2 gap-1">
                      <div className="h-1 bg-gray-200 rounded w-full" />
                      <div className="h-1 bg-gray-200 rounded w-4/5" />
                      <div className="h-1 bg-gray-200 rounded w-full" />
                      <div className="h-1 bg-gray-200 rounded w-3/4" />
                      <div className="h-1 bg-gray-200 rounded w-full" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-purple-500 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-purple-600">25%</span>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {FEATURES.map(({ Icon, label }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Icon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">Dúvidas frequentes</h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    {q}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-purple-700 to-violet-600 py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Descubra seu próximo livro favorito</h2>
            <p className="text-purple-200 mb-8 text-lg">Autores independentes brasileiros esperando por você.</p>
            <Link href="/livros"
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-orange">
              Ver catálogo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
