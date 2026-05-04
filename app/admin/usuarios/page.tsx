import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Users, Search, Shield } from 'lucide-react'

async function changeRole(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string
  const role   = formData.get('role')   as string
  const admin  = createAdminClient()
  await admin.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/usuarios')
}

const ROLE_LABELS: Record<string, string> = {
  reader:    'Leitor',
  author:    'Autor',
  affiliate: 'Afiliado',
  printer:   'Gráfica',
  admin:     'Admin',
}

const ROLE_COLORS: Record<string, string> = {
  reader:    'bg-gray-100 text-gray-600',
  author:    'bg-blue-100 text-[#0D1B8E]',
  affiliate: 'bg-purple-100 text-purple-700',
  printer:   'bg-orange-100 text-[#F97316]',
  admin:     'bg-red-100 text-red-700',
}

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')

  const { q = '', role: roleFilter = '' } = await searchParams

  let query = admin.from('profiles').select('*').order('created_at', { ascending: false })
  if (roleFilter) query = query.eq('role', roleFilter)

  const { data: profiles } = await query

  const filtered = (profiles ?? []).filter((p: any) => {
    if (!q) return true
    const search = q.toLowerCase()
    return (
      p.full_name?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search)
    )
  })

  const counts = (profiles ?? []).reduce((acc: Record<string, number>, p: any) => {
    acc[p.role] = (acc[p.role] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Usuários</h1>
        <p className="text-gray-500 mb-6">Gerencie todos os usuários da plataforma</p>

        {/* Resumo por role */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <a key={role} href={`?role=${roleFilter === role ? '' : role}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-[#0D1B8E] text-white'
                  : `${ROLE_COLORS[role]} hover:opacity-80`
              }`}>
              {label} ({counts[role] ?? 0})
            </a>
          ))}
        </div>

        {/* Busca */}
        <form method="GET" className="relative mb-6">
          {roleFilter && <input type="hidden" name="role" value={roleFilter} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#4A7AFF] outline-none transition-colors bg-white"
          />
        </form>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{filtered.length} usuário{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(filtered as any[]).map(profile => (
                <div key={profile.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A7AFF] to-[#0D1B8E] flex items-center justify-center shrink-0 overflow-hidden">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white font-bold text-sm">
                          {(profile.full_name || profile.email || 'U')[0].toUpperCase()}
                        </span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {profile.full_name || '—'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                  </div>

                  {/* Role atual */}
                  <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${ROLE_COLORS[profile.role] ?? ROLE_COLORS.reader}`}>
                    {ROLE_LABELS[profile.role] ?? profile.role}
                  </span>

                  {/* Alterar role */}
                  <form action={changeRole} className="flex items-center gap-2 shrink-0">
                    <input type="hidden" name="userId" value={profile.id} />
                    <select
                      name="role"
                      defaultValue={profile.role}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:border-[#4A7AFF] outline-none bg-white text-gray-700"
                    >
                      {Object.entries(ROLE_LABELS).map(([r, l]) => (
                        <option key={r} value={r}>{l}</option>
                      ))}
                    </select>
                    <button type="submit"
                      className="flex items-center gap-1 bg-[#0D1B8E] hover:bg-[#4A7AFF] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                      <Shield className="w-3 h-3" /> Alterar
                    </button>
                  </form>

                  {/* Data */}
                  <span className="text-xs text-gray-400 shrink-0 hidden lg:block">
                    {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
