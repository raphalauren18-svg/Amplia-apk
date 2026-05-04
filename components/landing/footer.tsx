import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const LINKS = {
  Plataforma: [
    { href: '/como-funciona',  label: 'Como funciona'      },
    { href: '/para-autores',   label: 'Para Autores'       },
    { href: '/para-leitores',  label: 'Para Leitores'      },
    { href: '/para-graficas',  label: 'Para Gráficas'      },
    { href: '/para-afiliados', label: 'Para Afiliados'     },
    { href: '/livros',         label: 'Catálogo de Livros' },
  ],
  Suporte: [
    { href: '/ajuda',     label: 'Central de Ajuda' },
    { href: '/faq',       label: 'FAQ'              },
    { href: '/contato',   label: 'Fale Conosco'     },
  ],
  Legal: [
    { href: '/termos',      label: 'Termos de Uso'      },
    { href: '/privacidade', label: 'Política de Privacidade' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
            <BookOpen className="w-5 h-5" />
            Amplia
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Plataforma completa para autores independentes publicarem, venderem e distribuírem seus livros no Brasil.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title}>
            <p className="text-white text-sm font-semibold mb-3">{title}</p>
            <ul className="space-y-2">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Amplia. Todos os direitos reservados.</p>
          <p>Feito no Brasil 🇧🇷</p>
        </div>
      </div>
    </footer>
  )
}
