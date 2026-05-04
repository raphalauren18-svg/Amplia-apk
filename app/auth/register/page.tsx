'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Loader2 } from 'lucide-react'

const ROLES = [
  { value: 'author',    label: 'Autor — quero publicar livros'       },
  { value: 'reader',    label: 'Leitor — quero comprar livros'        },
  { value: 'affiliate', label: 'Afiliado — quero indicar e ganhar'    },
  { value: 'printer',   label: 'Gráfica — quero imprimir sob demanda' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ full_name: '', email: '', password: '', role: 'reader' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email:    form.email,
      password: form.password,
      options:  {
        data: { full_name: form.full_name, role: form.role },
      },
    })

    if (err) {
      setError(
        err.message.includes('already registered')
          ? 'Este e-mail já está cadastrado.'
          : 'Erro ao criar conta. Tente novamente.',
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-brand mb-8">
        <BookOpen className="w-6 h-6" />
        Amplia
      </Link>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Criar conta grátis</h1>
        <p className="text-gray-500 text-sm mb-7">Sem cartão de crédito, sem mensalidade.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              placeholder="Seu Nome"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quero me cadastrar como</label>
            <select
              value={form.role}
              onChange={e => update('role', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Ao criar a conta você concorda com os{' '}
            <Link href="/termos" className="text-brand hover:underline">Termos de Uso</Link>
            {' '}e a{' '}
            <Link href="/privacidade" className="text-brand hover:underline">Política de Privacidade</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-brand font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
