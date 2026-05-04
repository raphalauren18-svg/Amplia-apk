'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Menu, X, LogIn } from 'lucide-react'

const NAV_LINKS = [
  { href: '/como-funciona', label: 'Como funciona' },
  { href: '/para-autores',  label: 'Para Autores'  },
  { href: '/para-leitores', label: 'Para Leitores' },
  { href: '/livros',        label: 'Catálogo'      },
  { href: '/ajuda',         label: 'Ajuda'         },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-brand">
          <BookOpen className="w-6 h-6" />
          Amplia
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-600 hover:text-brand transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-brand flex items-center gap-1.5 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Criar conta grátis
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-700 py-2 hover:text-brand transition-colors"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <hr className="border-gray-100 my-1" />
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 py-2"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-brand text-white px-4 py-2.5 rounded-lg text-center font-medium"
            onClick={() => setOpen(false)}
          >
            Criar conta grátis
          </Link>
        </div>
      )}
    </header>
  )
}
