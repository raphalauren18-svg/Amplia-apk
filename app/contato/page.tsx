'use client'

import { useState } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Mail, MessageCircle, Clock, Send, Loader2, CheckCircle, BookOpen, Users, Printer, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const TOPICS = [
  { value: 'publicacao',   label: 'Publicação de livro',     Icon: BookOpen    },
  { value: 'afiliado',     label: 'Programa de afiliados',   Icon: Users       },
  { value: 'grafica',      label: 'Parceria gráfica',        Icon: Printer     },
  { value: 'compra',       label: 'Minha compra ou pedido',  Icon: ShoppingBag },
  { value: 'pagamento',    label: 'Pagamento / reembolso',   Icon: Mail        },
  { value: 'outro',        label: 'Outro assunto',           Icon: MessageCircle },
]

export default function ContatoPage() {
  const [form, setForm]   = useState({ name: '', email: '', topic: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Em produção: conectar ao Resend ou endpoint de contato
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <>
        <Navbar forceDark />
        <main className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-3">Mensagem enviada!</h1>
            <p className="text-gray-500 mb-8">Nossa equipe responde em até 24 horas úteis pelo e-mail informado.</p>
            <Link href="/"
              className="inline-flex items-center gap-2 bg-[#0D1B8E] hover:bg-[#4A7AFF] text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Voltar ao início
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar forceDark />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Fale com a Amplia</h1>
            <p className="text-gray-500 text-lg">Nossa equipe está aqui para ajudar. Selecione o assunto e descreva sua dúvida.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info lateral */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <Mail className="w-6 h-6 text-[#4A7AFF] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                <a href="mailto:contato@amplia.com.br"
                  className="text-[#0D1B8E] text-sm hover:underline">
                  contato@amplia.com.br
                </a>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <Clock className="w-6 h-6 text-[#4A7AFF] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Tempo de resposta</h3>
                <p className="text-gray-500 text-sm">Até 24 horas úteis em dias de semana.</p>
              </div>
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <MessageCircle className="w-6 h-6 text-[#0D1B8E] mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Central de Ajuda</h3>
                <p className="text-gray-500 text-sm mb-3">Antes de enviar, confira se sua dúvida já tem resposta lá.</p>
                <Link href="/ajuda" className="text-[#0D1B8E] text-sm font-medium hover:underline">
                  Ir para a Central de Ajuda →
                </Link>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Seu nome"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                    <input
                      required type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Assunto</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TOPICS.map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, topic: value }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors text-left ${
                          form.topic === value
                            ? 'border-[#0D1B8E] bg-blue-50 text-[#0D1B8E]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Descreva sua dúvida com o máximo de detalhes possível..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.topic}
                  className="w-full bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold py-4 rounded-xl transition-colors shadow-orange disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    : <><Send className="w-4 h-4" /> Enviar mensagem</>
                  }
                </button>

                {!form.topic && (
                  <p className="text-xs text-gray-400 text-center">Selecione um assunto para continuar</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
