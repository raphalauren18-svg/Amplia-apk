'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { BookOpen, Save, Loader2, ArrowLeft, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'

export default function EditarLivroPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [book,     setBook]     = useState<any>(null)
  const [form, setForm] = useState({
    title:          '',
    description:    '',
    price:          '',
    digital_price:  '',
    physical_price: '',
    pages:          '',
    isbn:           '',
    spine_mm:       '',
    has_ear_flap:   false,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: author } = await supabase.from('authors').select('id').eq('user_id', user.id).single()
      if (!author) { router.push('/dashboard/livros'); return }

      const { data: b } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .eq('author_id', author.id)
        .single()

      if (!b) { router.push('/dashboard/livros'); return }

      setBook(b)
      setForm({
        title:          b.title          ?? '',
        description:    b.description    ?? '',
        price:          String(b.price   ?? ''),
        digital_price:  String(b.digital_price  ?? ''),
        physical_price: String(b.physical_price ?? ''),
        pages:          String(b.pages   ?? ''),
        isbn:           b.isbn           ?? '',
        spine_mm:       String(b.spine_mm ?? ''),
        has_ear_flap:   !!b.has_ear_flap,
      })
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('books').update({
      title:          form.title.trim(),
      description:    form.description.trim() || null,
      price:          parseFloat(form.price)          || 0,
      digital_price:  parseFloat(form.digital_price)  || null,
      physical_price: parseFloat(form.physical_price) || null,
      pages:          parseInt(form.pages)             || null,
      isbn:           form.isbn.trim()                 || null,
      spine_mm:       parseFloat(form.spine_mm)        || null,
      has_ear_flap:   form.has_ear_flap,
      updated_at:     new Date().toISOString(),
    }).eq('id', id)

    if (error) toast.error('Erro ao salvar: ' + error.message)
    else { toast.success('Livro atualizado!'); router.push(`/dashboard/livros/${id}`) }
    setSaving(false)
  }

  const field = (label: string, key: keyof typeof form, opts?: { placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={opts?.type ?? 'text'}
        value={form[key] as string}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        step={opts?.type === 'number' ? 'any' : undefined}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors"
      />
    </div>
  )

  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 text-[#4A7AFF] animate-spin" />
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/livros/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar ao livro
        </Link>

        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Editar livro</h1>
        <p className="text-gray-500 mb-8">Atualize as informações do seu livro</p>

        {book?.status === 'published' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
            ⚠️ Este livro está publicado. Alterações serão aplicadas imediatamente.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Informações básicas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4A7AFF]" /> Informações básicas
            </h2>
            {field('Título', 'title', { placeholder: 'Título do livro' })}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4}
                placeholder="Descreva seu livro..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors resize-none"
              />
            </div>
            {field('ISBN', 'isbn', { placeholder: '978-...' })}
          </div>

          {/* Preços */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4A7AFF]" /> Preços
            </h2>
            {field('Preço digital (R$)', 'digital_price', { type: 'number', placeholder: '29,90' })}
            {field('Preço físico (R$)', 'physical_price', { type: 'number', placeholder: '59,90' })}
          </div>

          {/* Especificações gráficas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4A7AFF]" /> Especificações gráficas
            </h2>
            {field('Número de páginas', 'pages', { type: 'number', placeholder: '200' })}
            {field('Lombada (mm)', 'spine_mm', { type: 'number', placeholder: 'Calculada automaticamente' })}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, has_ear_flap: !p.has_ear_flap }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form.has_ear_flap ? 'bg-[#0D1B8E]' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.has_ear_flap ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className="text-sm text-gray-700">Com orelha</span>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold py-4 rounded-xl transition-colors shadow-orange disabled:opacity-50 flex items-center justify-center gap-2">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              : <><Save className="w-4 h-4" /> Salvar alterações</>
            }
          </button>
        </form>
      </div>
    </main>
  )
}
