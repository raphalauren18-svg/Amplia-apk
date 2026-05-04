import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, DollarSign, TrendingUp, Users, BookOpen, ShoppingBag } from 'lucide-react'

export default async function AdminRelatoriosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalUsers },
    { count: totalAuthors },
    { count: totalAffiliates },
    { count: totalBooks },
    { data: salesData },
    { data: recentSales },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'author'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'affiliate'),
    admin.from('books').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    admin.from('sales').select('total, author_share, affiliate_commission, printer_share, platform_share, type, created_at').eq('status', 'paid'),
    admin.from('sales')
      .select('id, total, type, created_at, books(title), profiles:buyer_id(full_name, email)')
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const revenue = {
    total:      salesData?.reduce((s, r) => s + Number(r.total ?? 0), 0)      ?? 0,
    platform:   salesData?.reduce((s, r) => s + Number(r.platform_share ?? 0), 0) ?? 0,
    authors:    salesData?.reduce((s, r) => s + Number(r.author_share ?? 0), 0)   ?? 0,
    affiliates: salesData?.reduce((s, r) => s + Number(r.affiliate_commission ?? 0), 0) ?? 0,
    printers:   salesData?.reduce((s, r) => s + Number(r.printer_share ?? 0), 0)  ?? 0,
  }
  const totalSales    = salesData?.length ?? 0
  const digitalSales  = salesData?.filter(s => s.type === 'digital').length  ?? 0
  const physicalSales = salesData?.filter(s => s.type === 'physical').length ?? 0

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Relatórios</h1>
        <p className="text-gray-500 mb-8">Visão financeira e operacional da plataforma</p>

        {/* Cards principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Receita total',      value: fmt(revenue.total),    Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50'   },
            { label: 'Ganho plataforma',   value: fmt(revenue.platform), Icon: TrendingUp, color: 'text-[#F97316]',  bg: 'bg-orange-50'  },
            { label: 'Total de vendas',    value: String(totalSales),    Icon: ShoppingBag,color: 'text-[#0D1B8E]',  bg: 'bg-blue-50'    },
            { label: 'Livros publicados',  value: String(totalBooks ?? 0), Icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50'  },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Distribuição de receita */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4A7AFF]" /> Distribuição da receita
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Plataforma',  value: revenue.platform,   pct: revenue.total > 0 ? (revenue.platform / revenue.total * 100).toFixed(1) : '0', color: 'bg-[#F97316]' },
                { label: 'Autores',     value: revenue.authors,    pct: revenue.total > 0 ? (revenue.authors / revenue.total * 100).toFixed(1) : '0', color: 'bg-[#0D1B8E]' },
                { label: 'Afiliados',   value: revenue.affiliates, pct: revenue.total > 0 ? (revenue.affiliates / revenue.total * 100).toFixed(1) : '0', color: 'bg-purple-500' },
                { label: 'Gráficas',    value: revenue.printers,   pct: revenue.total > 0 ? (revenue.printers / revenue.total * 100).toFixed(1) : '0', color: 'bg-green-500' },
              ].map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{fmt(value)} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usuários e vendas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4A7AFF]" /> Usuários e vendas
            </h2>
            <dl className="space-y-4">
              {[
                { label: 'Total de usuários',  value: String(totalUsers ?? 0)     },
                { label: 'Autores cadastrados',value: String(totalAuthors ?? 0)   },
                { label: 'Afiliados',          value: String(totalAffiliates ?? 0)},
                { label: 'Vendas digitais',    value: String(digitalSales)        },
                { label: 'Vendas físicas',     value: String(physicalSales)       },
                { label: 'Ticket médio',       value: totalSales > 0 ? fmt(revenue.total / totalSales) : 'R$ 0,00' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Últimas vendas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4A7AFF]" /> Últimas vendas
            </h2>
          </div>
          {(!recentSales || recentSales.length === 0) ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Nenhuma venda registrada ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(recentSales as any[]).map(sale => (
                <div key={sale.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{sale.books?.title ?? 'Livro'}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {sale.profiles?.full_name ?? sale.profiles?.email ?? 'Comprador'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sale.type === 'digital' ? 'bg-blue-50 text-[#0D1B8E]' : 'bg-orange-50 text-[#F97316]'}`}>
                    {sale.type === 'digital' ? 'Digital' : 'Físico'}
                  </span>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600 text-sm">{fmt(Number(sale.total ?? 0))}</p>
                    <p className="text-xs text-gray-400">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
