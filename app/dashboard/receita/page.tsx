import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DollarSign, TrendingUp, Package, Printer, CheckCircle } from 'lucide-react'

export default async function ReceitaGraficaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: printer } = await supabase.from('printers').select('id').eq('user_id', user.id).single()

  const { data: orders } = printer
    ? await supabase
        .from('sales')
        .select('id, print_cost, printer_share, status, created_at, books(title, cover_url)')
        .eq('printer_id', printer.id)
        .eq('type', 'physical')
        .in('status', ['printing', 'shipped', 'delivered'])
        .order('created_at', { ascending: false })
    : { data: [] }

  const totalReceita  = (orders ?? []).reduce((s: number, o: any) => s + Number(o.printer_share  ?? 0), 0)
  const totalCusto    = (orders ?? []).reduce((s: number, o: any) => s + Number(o.print_cost ?? 0), 0)
  const totalPedidos  = (orders ?? []).length
  const entregues     = (orders ?? []).filter((o: any) => o.status === 'delivered').length

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  // Agrupar por mês para mini-histórico
  const byMonth: Record<string, number> = {}
  ;(orders ?? []).forEach((o: any) => {
    const m = new Date(o.created_at).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    byMonth[m] = (byMonth[m] ?? 0) + Number(o.printer_share ?? 0)
  })
  const monthEntries = Object.entries(byMonth).slice(-6)

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Receita</h1>
        <p className="text-gray-500 mb-8">Acompanhe seus ganhos como gráfica parceira</p>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Receita total',   value: fmt(totalReceita), Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50'   },
            { label: 'Custo de prod.',  value: fmt(totalCusto),   Icon: Printer,    color: 'text-[#0D1B8E]', bg: 'bg-blue-50'    },
            { label: 'Total pedidos',   value: String(totalPedidos), Icon: Package, color: 'text-[#F97316]', bg: 'bg-orange-50'  },
            { label: 'Entregues',       value: String(entregues), Icon: CheckCircle,color: 'text-teal-600',  bg: 'bg-teal-50'    },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Receita por mês */}
          {monthEntries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4A7AFF]" /> Receita por mês
              </h2>
              <div className="space-y-3">
                {(() => {
                  const max = Math.max(...monthEntries.map(([, v]) => v), 1)
                  return monthEntries.map(([month, value]) => (
                    <div key={month}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">{month}</span>
                        <span className="font-semibold text-gray-900">{fmt(value)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${(value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          )}

          {/* Resumo financeiro */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#4A7AFF]" /> Resumo financeiro
            </h2>
            <dl className="space-y-4">
              {[
                { label: 'Receita total',     value: fmt(totalReceita), color: 'text-green-600 font-bold' },
                { label: 'Custo de produção', value: fmt(totalCusto),   color: 'text-gray-900' },
                { label: 'Margem estimada',   value: fmt(totalReceita - totalCusto), color: totalReceita - totalCusto >= 0 ? 'text-green-600' : 'text-red-500' },
                { label: 'Ticket médio',      value: totalPedidos > 0 ? fmt(totalReceita / totalPedidos) : 'R$ 0,00', color: 'text-gray-900' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className={`${color}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Histórico de pedidos</h2>
          </div>
          {(!orders || orders.length === 0) ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum pedido concluído ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(orders as any[]).map((order: any) => (
                <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {order.books?.cover_url
                      ? <img src={order.books.cover_url} alt="" className="w-full h-full object-cover" />
                      : <Package className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{order.books?.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700'  :
                        order.status === 'shipped'   ? 'bg-indigo-100 text-indigo-700':
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status === 'delivered' ? 'Entregue' : order.status === 'shipped' ? 'Enviado' : 'Imprimindo'}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600 text-sm">{fmt(Number(order.printer_share ?? 0))}</p>
                    <p className="text-xs text-gray-400">sua parte</p>
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
