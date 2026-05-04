'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Settings, Percent, Save, Loader2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

/* 
  A tabela do schema é platform_settings (key TEXT primary key, value TEXT)
  Não existe platform_config — este arquivo usa a tabela correta.
*/

const KEYS = {
  AUTHOR_DIGITAL_NO_AFF:    'author_share_digital_no_affiliate',
  AUTHOR_DIGITAL_WITH_AFF:  'author_share_digital_with_affiliate',
  AFFILIATE_DIGITAL:        'affiliate_share_digital',
  AUTHOR_PHYSICAL_NO_AFF:   'author_share_physical_no_affiliate',
  AUTHOR_PHYSICAL_WITH_AFF: 'author_share_physical_with_affiliate',
  AFFILIATE_PHYSICAL:       'affiliate_share_physical',
  SUPPORT_EMAIL:            'support_email',
  ASAAS_ENV:                'asaas_env',
}

export default function AdminConfiguracoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  const [form, setForm] = useState({
    author_digital_no_aff:    '70',
    author_digital_with_aff:  '60',
    affiliate_digital:        '20',
    author_physical_no_aff:   '70',
    author_physical_with_aff: '60',
    affiliate_physical:       '20',
    support_email:            'contato@amplia.com.br',
    asaas_env:                'sandbox',
  })

  // Percentuais calculados
  const platform_digital_no_aff    = 100 - parseInt(form.author_digital_no_aff    || '0')
  const platform_digital_with_aff  = 100 - parseInt(form.author_digital_with_aff  || '0') - parseInt(form.affiliate_digital   || '0')
  const platform_physical_no_aff   = 100 - parseInt(form.author_physical_no_aff   || '0')
  const platform_physical_with_aff = 100 - parseInt(form.author_physical_with_aff || '0') - parseInt(form.affiliate_physical  || '0')

  const isValid = platform_digital_no_aff >= 0 && platform_digital_with_aff >= 0
               && platform_physical_no_aff >= 0 && platform_physical_with_aff >= 0

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }

      const { data: settings } = await supabase
        .from('platform_settings')
        .select('key, value')

      if (settings) {
        const cfg = Object.fromEntries(settings.map((s: any) => [s.key, s.value]))
        setForm(prev => ({
          ...prev,
          author_digital_no_aff:    cfg[KEYS.AUTHOR_DIGITAL_NO_AFF]    ?? '70',
          author_digital_with_aff:  cfg[KEYS.AUTHOR_DIGITAL_WITH_AFF]  ?? '60',
          affiliate_digital:        cfg[KEYS.AFFILIATE_DIGITAL]         ?? '20',
          author_physical_no_aff:   cfg[KEYS.AUTHOR_PHYSICAL_NO_AFF]   ?? '70',
          author_physical_with_aff: cfg[KEYS.AUTHOR_PHYSICAL_WITH_AFF] ?? '60',
          affiliate_physical:       cfg[KEYS.AFFILIATE_PHYSICAL]        ?? '20',
          support_email:            cfg[KEYS.SUPPORT_EMAIL]             ?? 'contato@amplia.com.br',
          asaas_env:                cfg[KEYS.ASAAS_ENV]                 ?? 'sandbox',
        }))
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) { toast.error('Os percentuais não podem ultrapassar 100%'); return }
    setSaving(true)

    const supabase = createClient()
    const upserts = [
      { key: KEYS.AUTHOR_DIGITAL_NO_AFF,    value: form.author_digital_no_aff    },
      { key: KEYS.AUTHOR_DIGITAL_WITH_AFF,  value: form.author_digital_with_aff  },
      { key: KEYS.AFFILIATE_DIGITAL,        value: form.affiliate_digital        },
      { key: KEYS.AUTHOR_PHYSICAL_NO_AFF,   value: form.author_physical_no_aff   },
      { key: KEYS.AUTHOR_PHYSICAL_WITH_AFF, value: form.author_physical_with_aff },
      { key: KEYS.AFFILIATE_PHYSICAL,       value: form.affiliate_physical       },
      { key: KEYS.SUPPORT_EMAIL,            value: form.support_email            },
      { key: KEYS.ASAAS_ENV,               value: form.asaas_env                },
    ]

    const { error } = await supabase.from('platform_settings').upsert(upserts, { onConflict: 'key' })
    if (error) toast.error('Erro ao salvar: ' + error.message)
    else toast.success('Configurações salvas!')
    setSaving(false)
  }

  const numField = (label: string, key: keyof typeof form, color: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number" min="0" max="100"
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm focus:border-[#4A7AFF] outline-none"
        />
        <Percent className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${color}`} />
      </div>
    </div>
  )

  const PlatformBar = ({ author, affiliate, label }: { author: number; affiliate: number; label: string }) => {
    const platform = 100 - author - affiliate
    return (
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="bg-[#0D1B8E] h-full" style={{ width: `${author}%` }} title={`Autor: ${author}%`} />
          {affiliate > 0 && <div className="bg-purple-500 h-full" style={{ width: `${affiliate}%` }} title={`Afiliado: ${affiliate}%`} />}
          <div className="bg-[#F97316] h-full" style={{ width: `${Math.max(0, platform)}%` }} title={`Plataforma: ${platform}%`} />
        </div>
        <div className="flex gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0D1B8E] inline-block" />Autor {author}%</span>
          {affiliate > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />Afiliado {affiliate}%</span>}
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F97316] inline-block" />Plataforma {Math.max(0, platform)}%</span>
        </div>
      </div>
    )
  }

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
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Configurações da plataforma</h1>
        <p className="text-gray-500 mb-8">Ajuste os percentuais de divisão de receita e parâmetros gerais</p>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Digital sem afiliado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#4A7AFF]" /> Venda digital — sem afiliado
            </h2>
            {numField('Autor (%)', 'author_digital_no_aff', 'text-[#0D1B8E]')}
            <PlatformBar author={parseInt(form.author_digital_no_aff || '0')} affiliate={0} label="" />
            {platform_digital_no_aff < 0 && (
              <p className="text-xs text-red-500">A soma ultrapassa 100%</p>
            )}
          </div>

          {/* Digital com afiliado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-500" /> Venda digital — com afiliado
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {numField('Autor (%)',   'author_digital_with_aff', 'text-[#0D1B8E]')}
              {numField('Afiliado (%)', 'affiliate_digital',       'text-purple-500')}
            </div>
            <PlatformBar
              author={parseInt(form.author_digital_with_aff || '0')}
              affiliate={parseInt(form.affiliate_digital || '0')}
              label=""
            />
            {platform_digital_with_aff < 0 && (
              <p className="text-xs text-red-500">A soma ultrapassa 100%</p>
            )}
          </div>

          {/* Físico sem afiliado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-green-500" /> Venda física — sem afiliado
            </h2>
            <p className="text-xs text-gray-400">Aplicado sobre o valor após dedução do custo de impressão</p>
            {numField('Autor (%)', 'author_physical_no_aff', 'text-[#0D1B8E]')}
            <PlatformBar author={parseInt(form.author_physical_no_aff || '0')} affiliate={0} label="" />
          </div>

          {/* Físico com afiliado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#F97316]" /> Venda física — com afiliado
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {numField('Autor (%)',    'author_physical_with_aff', 'text-[#0D1B8E]')}
              {numField('Afiliado (%)', 'affiliate_physical',        'text-purple-500')}
            </div>
            <PlatformBar
              author={parseInt(form.author_physical_with_aff || '0')}
              affiliate={parseInt(form.affiliate_physical || '0')}
              label=""
            />
          </div>

          {/* Dados gerais */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#4A7AFF]" /> Dados gerais
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail de suporte</label>
              <input
                type="email"
                value={form.support_email}
                onChange={e => setForm(p => ({ ...p, support_email: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ambiente Asaas</label>
              <select
                value={form.asaas_env}
                onChange={e => setForm(p => ({ ...p, asaas_env: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#4A7AFF] outline-none bg-white"
              >
                <option value="sandbox">Sandbox (testes)</option>
                <option value="production">Produção</option>
              </select>
              {form.asaas_env === 'production' && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Modo produção: cobranças reais serão realizadas.
                </p>
              )}
            </div>
          </div>

          <button type="submit" disabled={saving || !isValid}
            className="w-full bg-[#F97316] hover:bg-[#FBBF24] text-white font-bold py-4 rounded-xl transition-colors shadow-orange disabled:opacity-50 flex items-center justify-center gap-2">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              : <><Save className="w-4 h-4" /> Salvar configurações</>
            }
          </button>
        </form>
      </div>
    </main>
  )
}
