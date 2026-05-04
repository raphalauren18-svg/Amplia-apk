import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  BookOpen, DollarSign, TrendingUp, ShoppingBag,
  Package, Printer, Link2, Trophy, ArrowRight,
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()

  const role = profile?.role ?? 'reader'
  const name = profile?.full_name?.split(' ')[0] ?? 'você'

  const TITLES: Record<string, string> = {
    author:    `Olá, ${name}!`,
    affiliate: `Olá, ${name}!`,
    printer:   `Olá, ${name}!`,
    reader:    `Olá, ${name}!`,
    admin:     'Painel Administrativo',
  }

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">{TITLES[role]}</h1>
        <p className="text-gray-500 mb-8">Bem-vindo de volta à Amplia.</p>

        {role === 'author'    && <AuthorDashboard userId={user.id} />}
        {role === 'affiliate' && <AffiliateDashboard userId={user.id} />}
        {role === 'printer'   && <PrinterDashboard userId={user.id} />}
        {role === 'reader'    && <ReaderDashboard userId={user.id} />}
        {role === 'admin'     && <AdminDashboard />}
      </div>
    </main>
  )
}

/* ── AUTHOR ─────────────────────────────────────────────── */
async function AuthorDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: author } = await supabase.from('authors').select('id').eq('user_id', userId).single()

  const [
    { count: totalBooks },
    { data: salesData },
    { data: xpData },
  ] = await Promise.all([
    author
      ? supabase.from('books').select('*', { count: 'exact', head: true }).eq('author_id', author.id).eq('status', 'published')
      : Promise.resolve({ count: 0 }),
    author
      ? supabase.from('sales').select('author_share').eq('books.author_id', author.id).in('status', ['paid','printing','shipped','delivered'])
      : Promise.resolve({ data: [] }),
    author
      ? supabase.from('author_xp').select('total_xp, level').eq('author_id', author.id).single()
      : Promise.resolve({ data: null }),
  ])

  const totalReceita = (salesData ?? []).reduce((s: number, r: any) => s + Number(r.author_share ?? 0), 0)
  const totalVendas  = (salesData ?? []).length
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  const stats = [
    { label: 'Livros publicados', value: String(totalBooks ?? 0), Icon: BookOpen,   color: 'text-[#0D1B8E]', bg: 'bg-blue-50',   href: '/dashboard/livros'   },
    { label: 'Receita total',     value: fmt(totalReceita),        Icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50',  href: '/dashboard/vendas'   },
    { label: 'Total de vendas',   value: String(totalVendas),      Icon: TrendingUp, color: 'text-[#F97316]', bg: 'bg-orange-50', href: '/dashboard/vendas'   },
    { label: 'XP acumulado',      value: String(xpData?.total_xp ?? 0), Icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/gamificacao' },
  ]

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>
      <QuickLinks links={[
        { label: 'Publicar novo livro', href: '/dashboard/livros/novo', color: 'bg-[#0D1B8E] text-white hover:bg-[#4A7AFF]' },
        { label: 'Ver minhas vendas',   href: '/dashboard/vendas',      color: 'bg-green-50 text-green-700 hover:bg-green-100' },
        { label: 'Minha jornada',       href: '/dashboard/gamificacao', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
        { label: 'Feed social',         href: '/dashboard/feed',        color: 'bg-orange-50 text-[#F97316] hover:bg-orange-100' },
      ]} />
    </>
  )
}

/* ── AFFILIATE ──────────────────────────────────────────── */
async function AffiliateDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: affiliate } = await supabase.from('affiliates').select('id').eq('user_id', userId).single()

  const [
    { data: salesData },
    { count: totalLinks },
  ] = await Promise.all([
    affiliate
      ? supabase.from('sales').select('affiliate_share').eq('affiliate_id', affiliate.id).in('status', ['paid','printing','shipped','delivered'])
      : Promise.resolve({ data: [] }),
    affiliate
      ? supabase.from('affiliate_links').select('*', { count: 'exact', head: true }).eq('affiliate_id', affiliate.id)
      : Promise.resolve({ count: 0 }),
  ])

  const totalComissoes = (salesData ?? []).reduce((s: number, r: any) => s + Number(r.affiliate_share ?? 0), 0)
  const totalVendas    = (salesData ?? []).length
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  const stats = [
    { label: 'Comissões totais', value: fmt(totalComissoes), Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50',  href: '/dashboard/comissoes' },
    { label: 'Vendas realizadas',value: String(totalVendas), Icon: TrendingUp, color: 'text-[#0D1B8E]', bg: 'bg-blue-50',   href: '/dashboard/comissoes' },
    { label: 'Links ativos',     value: String(totalLinks ?? 0), Icon: Link2, color: 'text-[#F97316]', bg: 'bg-orange-50', href: '/dashboard/loja'      },
  ]

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>
      <QuickLinks links={[
        { label: 'Ver catálogo de livros', href: '/dashboard/catalogo',  color: 'bg-[#0D1B8E] text-white hover:bg-[#4A7AFF]' },
        { label: 'Minha loja',             href: '/dashboard/loja',      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
        { label: 'Comissões detalhadas',   href: '/dashboard/comissoes', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
      ]} />
    </>
  )
}

/* ── PRINTER ────────────────────────────────────────────── */
async function PrinterDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: printer } = await supabase.from('printers').select('id').eq('user_id', userId).single()

  const [
    { count: pedidosNovos },
    { count: pedidosProducao },
    { data: receitaData },
    { count: entregues },
  ] = await Promise.all([
    printer
      ? supabase.from('sales').select('*', { count: 'exact', head: true }).eq('printer_id', printer.id).eq('status', 'paid').eq('type', 'physical')
      : Promise.resolve({ count: 0 }),
    printer
      ? supabase.from('sales').select('*', { count: 'exact', head: true }).eq('printer_id', printer.id).eq('status', 'printing').eq('type', 'physical')
      : Promise.resolve({ count: 0 }),
    printer
      ? supabase.from('sales').select('printer_share').eq('printer_id', printer.id).in('status', ['printing','shipped','delivered']).eq('type', 'physical')
      : Promise.resolve({ data: [] }),
    printer
      ? supabase.from('sales').select('*', { count: 'exact', head: true }).eq('printer_id', printer.id).eq('status', 'delivered').eq('type', 'physical')
      : Promise.resolve({ count: 0 }),
  ])

  const receita = (receitaData ?? []).reduce((s: number, r: any) => s + Number(r.printer_share ?? 0), 0)
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  const stats = [
    { label: 'Novos pedidos',    value: String(pedidosNovos ?? 0),    Icon: Package,  color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/dashboard/pedidos?tab=paid'     },
    { label: 'Em produção',      value: String(pedidosProducao ?? 0), Icon: Printer,  color: 'text-blue-600',   bg: 'bg-blue-50',   href: '/dashboard/producao?tab=printing' },
    { label: 'Receita total',    value: fmt(receita),                  Icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', href: '/dashboard/receita'              },
    { label: 'Entregas concluídas', value: String(entregues ?? 0),    Icon: ShoppingBag, color: 'text-[#0D1B8E]', bg: 'bg-blue-50', href: '/dashboard/producao?tab=delivered' },
  ]

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>
      <QuickLinks links={[
        { label: 'Fila de pedidos', href: '/dashboard/pedidos',  color: 'bg-[#0D1B8E] text-white hover:bg-[#4A7AFF]'          },
        { label: 'Produção',        href: '/dashboard/producao', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'     },
        { label: 'Receita',         href: '/dashboard/receita',  color: 'bg-green-50 text-green-700 hover:bg-green-100'        },
      ]} />
    </>
  )
}

/* ── READER ─────────────────────────────────────────────── */
async function ReaderDashboard({ userId }: { userId: string }) {
  const supabase = await createClient()

  const [
    { count: totalAdquiridos },
    { data: progressData },
  ] = await Promise.all([
    supabase.from('sales').select('*', { count: 'exact', head: true }).eq('buyer_id', userId).in('status', ['paid','delivered']).eq('type', 'digital'),
    supabase.from('reading_progress').select('book_id, percentage').eq('user_id', userId),
  ])

  const lidos      = (progressData ?? []).filter((p: any) => Number(p.percentage) >= 90).length
  const totalPages = 0 // não temos sum agregado — mostra livros

  const stats = [
    { label: 'Livros adquiridos', value: String(totalAdquiridos ?? 0), Icon: BookOpen,    color: 'text-[#0D1B8E]', bg: 'bg-blue-50',   href: '/dashboard/meus-livros' },
    { label: 'Livros concluídos', value: String(lidos),                 Icon: TrendingUp,  color: 'text-green-600', bg: 'bg-green-50',  href: '/dashboard/meus-livros' },
    { label: 'Em leitura',        value: String((progressData ?? []).length - lidos), Icon: Trophy, color: 'text-[#F97316]', bg: 'bg-orange-50', href: '/dashboard/meus-livros' },
  ]

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>
      <QuickLinks links={[
        { label: 'Minha biblioteca',  href: '/dashboard/meus-livros', color: 'bg-[#0D1B8E] text-white hover:bg-[#4A7AFF]'      },
        { label: 'Descobrir livros',  href: '/livros',                color: 'bg-blue-50 text-[#0D1B8E] hover:bg-blue-100'      },
        { label: 'Meus pedidos',      href: '/dashboard/meus-pedidos',color: 'bg-orange-50 text-[#F97316] hover:bg-orange-100'  },
      ]} />
    </>
  )
}

/* ── ADMIN ──────────────────────────────────────────────── */
async function AdminDashboard() {
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalBooks },
    { data: salesData },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('books').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    admin.from('sales').select('total, platform_share').eq('status', 'paid'),
  ])

  const totalReceita  = (salesData ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const platformShare = (salesData ?? []).reduce((s, r) => s + Number(r.platform_share ?? 0), 0)
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`

  const stats = [
    { label: 'Usuários',        value: String(totalUsers ?? 0), Icon: TrendingUp,  color: 'text-[#0D1B8E]', bg: 'bg-blue-50',   href: '/admin/usuarios'  },
    { label: 'Livros publicados',value: String(totalBooks ?? 0), Icon: BookOpen,   color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/livros'     },
    { label: 'Receita total',   value: fmt(totalReceita),        Icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50',  href: '/admin/relatorios' },
    { label: 'Ganho plataforma',value: fmt(platformShare),       Icon: ShoppingBag,color: 'text-[#F97316]',  bg: 'bg-orange-50', href: '/admin/relatorios' },
  ]

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>
      <QuickLinks links={[
        { label: 'Gerenciar usuários', href: '/admin/usuarios',      color: 'bg-[#0D1B8E] text-white hover:bg-[#4A7AFF]'         },
        { label: 'Aprovar livros',     href: '/admin/livros',        color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'    },
        { label: 'Relatórios',         href: '/admin/relatorios',    color: 'bg-green-50 text-green-700 hover:bg-green-100'       },
        { label: 'Configurações',      href: '/admin/configuracoes', color: 'bg-orange-50 text-[#F97316] hover:bg-orange-100'     },
      ]} />
    </>
  )
}

/* ── SHARED ─────────────────────────────────────────────── */
function QuickLinks({ links }: { links: { label: string; href: string; color: string }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Acesso rápido</h2>
      <div className="grid grid-cols-2 gap-3">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`${l.color} rounded-xl p-4 font-medium text-sm transition-colors flex items-center justify-between gap-2`}>
            {l.label}
            <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  )
}
