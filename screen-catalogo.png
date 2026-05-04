import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OrderActions } from '@/components/dashboard/order-actions'
import { Printer, Clock, Truck, CheckCircle, Package, BarChart3 } from 'lucide-react'

const STAGES = [
  { key: 'paid',      label: 'Fila de impressão', Icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50'  },
  { key: 'printing',  label: 'Em produção',        Icon: Printer,      color: 'text-blue-600',   bg: 'bg-blue-50'    },
  { key: 'shipped',   label: 'Enviados',            Icon: Truck,        color: 'text-indigo-600', bg: 'bg-indigo-50'  },
  { key: 'delivered', label: 'Entregues',           Icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50'   },
]

export default async function ProducaoPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'paid' } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: printer } = await supabase.from('printers').select('id').eq('user_id', user.id).single()

  // Contagens por status para os badges
  const counts: Record<string, number> = {}
  if (printer) {
    await Promise.all(
      STAGES.map(async ({ key }) => {
        const { count } = await supabase
          .from('sales')
          .select('*', { count: 'exact', head: true })
          .eq('printer_id', printer.id)
          .eq('status', key)
          .eq('type', 'physical')
        counts[key] = count ?? 0
      })
    )
  }

  const { data: orders } = printer
    ? await supabase
        .from('sales')
        .select('*, books(title, cover_url, pages, spine_mm, has_ear_flap), profiles:buyer_id(full_name, email)')
        .eq('printer_id', printer.id)
        .eq('status', tab)
        .eq('type', 'physical')
        .order('created_at', { ascending: false })
    : { data: [] }

  const activeStage = STAGES.find(s => s.key === tab) ?? STAGES[0]

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Produção</h1>
        <p className="text-gray-500 mb-6">Gerencie o fluxo completo de produção gráfica</p>

        {/* Kanban-style status tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STAGES.map(({ key, label, Icon, color, bg }) => (
            <a key={key} href={`?tab=${key}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                tab === key
                  ? 'border-[#0D1B8E] bg-[#0D1B8E] text-white shadow-navy'
                  : `${bg} border-transparent hover:border-gray-200`
              }`}>
              <div className="relative">
                <Icon className={`w-6 h-6 ${tab === key ? 'text-white' : color}`} />
                {(counts[key] ?? 0) > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    tab === key ? 'bg-white text-[#0D1B8E]' : 'bg-[#F97316] text-white'
                  }`}>
                    {counts[key]}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium text-center ${tab === key ? 'text-white' : 'text-gray-700'}`}>
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Header da lista */}
        <div className="flex items-center gap-3 mb-4">
          <activeStage.Icon className={`w-5 h-5 ${activeStage.color}`} />
          <h2 className="text-lg font-semibold text-gray-900">{activeStage.label}</h2>
          <span className="ml-auto text-sm text-gray-500">{orders?.length ?? 0} pedido{(orders?.length ?? 0) !== 1 ? 's' : ''}</span>
        </div>

        {(!orders || orders.length === 0) ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-14 text-center">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Nenhum pedido nesta etapa</p>
            <p className="text-gray-300 text-sm mt-1">
              {tab === 'paid' ? 'Novos pedidos aparecerão aqui' : 'Atualize o status dos pedidos anteriores'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(orders as any[]).map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                    {order.books?.cover_url
                      ? <img src={order.books.cover_url} alt="" className="w-full h-full object-cover" />
                      : <Package className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{order.books?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {order.profiles?.full_name ?? order.profiles?.email ?? 'Comprador'}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                      {order.books?.pages     && <span>📄 {order.books.pages} páginas</span>}
                      {order.books?.spine_mm  && <span>📏 Lombada: {order.books.spine_mm}mm</span>}
                      {order.books?.has_ear_flap && <span>📋 Com orelha</span>}
                      <span className="font-medium text-green-600">
                        💰 R$ {Number(order.print_cost ?? 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    {order.delivery_address && (() => {
                      const a = order.delivery_address
                      return (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                          <p className="font-medium text-gray-700 mb-0.5">Endereço:</p>
                          <p>{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''} · {a.city}/{a.state} · CEP {a.zip}</p>
                        </div>
                      )
                    })()}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs font-mono text-gray-400 mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <OrderActions
                  orderId={order.id}
                  currentStatus={order.status}
                  buyerEmail={order.profiles?.email}
                  bookTitle={order.books?.title}
                  buyerName={order.profiles?.full_name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
