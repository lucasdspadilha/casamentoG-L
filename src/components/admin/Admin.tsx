import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  LogOut,
  Download,
  Trash2,
  Check,
  X,
  Clock,
  Users,
  Heart,
  Gift,
  Plus,
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react'
import { ManualGiftDialog } from './ManualGiftDialog'
import { guestGroups } from '../../data/guestGroups'
import {
  getAllRsvps,
  clearAllRsvps,
  type RsvpEntry,
  type PreviousVersion,
} from '../../lib/rsvp'
import {
  getAllGifts,
  clearAllGifts,
  type GiftRecord,
} from '../../lib/gifts'
import { formatBRL } from '../../lib/money'
import { login, logout, getCurrentUser, type AuthUser } from '../../lib/auth'

type MainTab = 'rsvp' | 'gifts'
type FilterTab = 'all' | 'confirmed' | 'declined' | 'pending'

export function Admin() {
  const [authState, setAuthState] = useState<
    'loading' | 'unauthed' | AuthUser
  >('loading')

  useEffect(() => {
    getCurrentUser()
      .then((user) => setAuthState(user ?? 'unauthed'))
      .catch(() => setAuthState('unauthed'))
  }, [])

  if (authState === 'loading') {
    return (
      <section className="min-h-screen bg-cream flex items-center justify-center px-6">
        <p className="font-sans text-sm text-charcoal-light">Carregando...</p>
      </section>
    )
  }
  if (authState === 'unauthed') {
    return <LoginScreen onSuccess={(user) => setAuthState(user)} />
  }
  return <Dashboard onLogout={() => setAuthState('unauthed')} />
}

function LoginScreen({ onSuccess }: { onSuccess: (u: AuthUser) => void }) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, pwd)
      onSuccess(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.')
      setPwd('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-cream flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-sm flex flex-col items-center gap-6 bg-white border border-sage-light/30 rounded-2xl p-8"
      >
        <Lock size={32} className="text-sage" />
        <div className="text-center">
          <h1 className="font-serif text-2xl text-charcoal">Painel dos noivos</h1>
          <p className="font-sans text-xs text-charcoal-light mt-1">
            Acesso restrito
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="E-mail"
            autoFocus
            required
            disabled={loading}
            className={`w-full bg-cream border rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none transition-colors ${
              error
                ? 'border-red-400 focus:border-red-500'
                : 'border-sage-light/30 focus:border-sage'
            }`}
          />
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value)
              setError('')
            }}
            placeholder="Senha"
            required
            disabled={loading}
            className={`w-full bg-cream border rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none transition-colors ${
              error
                ? 'border-red-400 focus:border-red-500'
                : 'border-sage-light/30 focus:border-sage'
            }`}
          />
          {error && <p className="font-sans text-xs text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !email || !pwd}
          className="w-full bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-3 rounded-full hover:bg-sage-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </motion.form>
    </section>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [mainTab, setMainTab] = useState<MainTab>('rsvp')

  async function doLogout() {
    await logout()
    onLogout()
  }

  return (
    <section className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl text-charcoal">
              Painel dos noivos
            </h1>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light mt-1">
              Giulia & Lucas · 07 set 2026
            </p>
          </div>
          <button
            onClick={doLogout}
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-charcoal-light border border-sage-light/40 px-4 py-2 rounded-full hover:bg-charcoal hover:text-cream hover:border-charcoal transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Sair
          </button>
        </header>

        <div className="flex gap-2 mb-8 border-b border-sage-light/30">
          <MainTabBtn
            active={mainTab === 'rsvp'}
            onClick={() => setMainTab('rsvp')}
          >
            <Users size={14} /> Confirmações
          </MainTabBtn>
          <MainTabBtn
            active={mainTab === 'gifts'}
            onClick={() => setMainTab('gifts')}
          >
            <Gift size={14} /> Presentes
          </MainTabBtn>
        </div>

        {mainTab === 'rsvp' ? <RsvpPanel /> : <GiftsPanel />}
      </div>
    </section>
  )
}

function RsvpPanel() {
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<FilterTab>('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllRsvps()
      setRsvps(data)
    } catch {
      setRsvps([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const confirmed = rsvps.filter((r) => r.attending === 'yes')
    const declined = rsvps.filter((r) => r.attending === 'no')
    const respondedIds = new Set(rsvps.map((r) => r.groupId))
    const pendingGroups = guestGroups.filter((g) => !respondedIds.has(g.id))
    return { confirmed, declined, pendingGroups }
  }, [rsvps])

  const rows = useMemo(() => {
    type RsvpRowItem = {
      kind: 'rsvp'
      rsvp: RsvpEntry
      group: (typeof guestGroups)[number]
    }
    type PendingRowItem = {
      kind: 'pending'
      group: (typeof guestGroups)[number]
    }
    type Row = RsvpRowItem | PendingRowItem

    const toRsvpRow = (r: RsvpEntry): RsvpRowItem | null => {
      const group = guestGroups.find((g) => g.id === r.groupId)
      if (!group) return null
      return { kind: 'rsvp', rsvp: r, group }
    }

    if (tab === 'confirmed') {
      return stats.confirmed.map(toRsvpRow).filter(Boolean) as Row[]
    }
    if (tab === 'declined') {
      return stats.declined.map(toRsvpRow).filter(Boolean) as Row[]
    }
    if (tab === 'pending') {
      return stats.pendingGroups.map(
        (g): PendingRowItem => ({ kind: 'pending', group: g })
      )
    }
    return [
      ...(stats.confirmed.map(toRsvpRow).filter(Boolean) as Row[]),
      ...(stats.declined.map(toRsvpRow).filter(Boolean) as Row[]),
      ...stats.pendingGroups.map(
        (g): PendingRowItem => ({ kind: 'pending', group: g })
      ),
    ]
  }, [tab, stats])

  function exportJson() {
    const data = JSON.stringify(rsvps, null, 2)
    downloadFile(data, `rsvp-${new Date().toISOString().slice(0, 10)}.json`)
  }

  async function clearAll() {
    if (
      !confirm('Apagar TODAS as confirmações? Essa ação não pode ser desfeita.')
    )
      return
    try {
      await clearAllRsvps()
      await load()
    } catch (err) {
      alert(
        'Erro ao limpar: ' + (err instanceof Error ? err.message : 'unknown')
      )
    }
  }

  if (loading) {
    return (
      <p className="font-sans text-sm text-charcoal-light text-center py-12">
        Carregando confirmações...
      </p>
    )
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-6">
        <ActionBtn icon={<Download size={14} />} onClick={exportJson}>
          Exportar
        </ActionBtn>
        <ActionBtn icon={<Trash2 size={14} />} onClick={clearAll} danger>
          Limpar
        </ActionBtn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pessoas confirmadas"
          value={stats.confirmed.reduce(
            (s, r) => s + r.attendingGuestIds.length,
            0
          )}
          highlight
        />
        <StatCard
          label="Famílias confirmadas"
          value={stats.confirmed.length}
        />
        <StatCard label="Não vão" value={stats.declined.length} />
        <StatCard label="Pendentes" value={stats.pendingGroups.length} />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <TabBtn active={tab === 'all'} onClick={() => setTab('all')}>
          Todos ({guestGroups.length})
        </TabBtn>
        <TabBtn
          active={tab === 'confirmed'}
          onClick={() => setTab('confirmed')}
        >
          Confirmados ({stats.confirmed.length})
        </TabBtn>
        <TabBtn active={tab === 'declined'} onClick={() => setTab('declined')}>
          Não vão ({stats.declined.length})
        </TabBtn>
        <TabBtn active={tab === 'pending'} onClick={() => setTab('pending')}>
          Pendentes ({stats.pendingGroups.length})
        </TabBtn>
      </div>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <p className="font-sans text-sm text-charcoal-light text-center py-12">
            Nada por aqui.
          </p>
        )}
        {rows.map((row) =>
          row.kind === 'rsvp' ? (
            <RsvpRow key={row.rsvp.groupId} rsvp={row.rsvp} group={row.group} />
          ) : (
            <PendingRow key={row.group.id} group={row.group} />
          )
        )}
      </div>
    </div>
  )
}

function GiftsPanel() {
  const [gifts, setGifts] = useState<GiftRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showManual, setShowManual] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllGifts()
      setGifts(data)
    } catch {
      setGifts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const total = gifts.reduce((s, g) => s + g.total, 0)
    const items = gifts.reduce((s, g) => s + g.items.length, 0)
    return { total, items, count: gifts.length }
  }, [gifts])

  function exportJson() {
    const data = JSON.stringify(gifts, null, 2)
    downloadFile(
      data,
      `presentes-${new Date().toISOString().slice(0, 10)}.json`
    )
  }

  async function clearAll() {
    if (
      !confirm(
        'Apagar TODOS os registros de presentes? Essa ação não pode ser desfeita.'
      )
    )
      return
    try {
      await clearAllGifts()
      await load()
    } catch (err) {
      alert(
        'Erro ao limpar: ' + (err instanceof Error ? err.message : 'unknown')
      )
    }
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-6 flex-wrap">
        <ActionBtn
          icon={<Plus size={14} />}
          onClick={() => setShowManual(true)}
          primary
        >
          Adicionar presente
        </ActionBtn>
        <ActionBtn icon={<Download size={14} />} onClick={exportJson}>
          Exportar
        </ActionBtn>
        <ActionBtn icon={<Trash2 size={14} />} onClick={clearAll} danger>
          Limpar
        </ActionBtn>
      </div>

      <AnimatePresence>
        {showManual && (
          <ManualGiftDialog
            onClose={() => setShowManual(false)}
            onSaved={() => {
              setShowManual(false)
              load()
            }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total recebido"
          value={formatBRL(stats.total)}
          highlight
          asText
        />
        <StatCard label="Presentes" value={stats.count} />
        <StatCard label="Itens" value={stats.items} />
      </div>

      <div className="flex flex-col gap-3">
        {loading && (
          <p className="font-sans text-sm text-charcoal-light text-center py-12">
            Carregando presentes...
          </p>
        )}
        {!loading && gifts.length === 0 && (
          <p className="font-sans text-sm text-charcoal-light text-center py-12">
            Nenhum presente registrado ainda.
          </p>
        )}
        {!loading &&
          gifts.map((gift) => <GiftRow key={gift.id} gift={gift} />)}
      </div>
    </div>
  )
}

function GiftRow({ gift }: { gift: GiftRecord }) {
  return (
    <div className="bg-white border border-sage-light/30 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-serif text-lg text-charcoal flex items-center gap-2">
            <Heart size={14} className="text-sage" /> {gift.giverName}
          </p>
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light mt-0.5">
            {new Date(gift.submittedAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <span className="font-serif text-xl text-sage">
          {formatBRL(gift.total)}
        </span>
      </div>

      <ul className="flex flex-col gap-1 bg-cream rounded-lg p-3">
        {gift.items.map((it) => (
          <li
            key={it.wishId}
            className="flex justify-between font-sans text-xs text-charcoal"
          >
            <span>{it.title}</span>
            <span className="text-charcoal-light">{formatBRL(it.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
  asText,
}: {
  label: string
  value: number | string
  highlight?: boolean
  asText?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-5 border ${
        highlight
          ? 'bg-sage text-cream border-sage'
          : 'bg-white border-sage-light/30 text-charcoal'
      }`}
    >
      <p
        className={`font-sans text-[10px] tracking-[0.2em] uppercase ${
          highlight ? 'text-cream/70' : 'text-charcoal-light'
        }`}
      >
        {label}
      </p>
      <p className={`font-serif mt-2 ${asText ? 'text-2xl' : 'text-4xl'}`}>
        {value}
      </p>
    </div>
  )
}

function MainTabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] px-5 py-3 border-b-2 transition-colors cursor-pointer -mb-px ${
        active
          ? 'text-sage border-sage'
          : 'text-charcoal-light border-transparent hover:text-charcoal'
      }`}
    >
      {children}
    </button>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-colors cursor-pointer ${
        active
          ? 'bg-sage text-cream border-sage'
          : 'bg-white text-charcoal-light border-sage-light/30 hover:border-sage'
      }`}
    >
      {children}
    </button>
  )
}

function ActionBtn({
  icon,
  onClick,
  children,
  danger,
  primary,
}: {
  icon: React.ReactNode
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
  primary?: boolean
}) {
  const style = danger
    ? 'text-red-500 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500'
    : primary
      ? 'bg-sage text-cream border-sage hover:bg-sage-dark hover:border-sage-dark'
      : 'text-charcoal-light border-sage-light/40 hover:bg-sage hover:text-cream hover:border-sage'

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-colors cursor-pointer ${style}`}
    >
      {icon}
      {children}
    </button>
  )
}

function RsvpRow({
  rsvp,
  group,
}: {
  rsvp: RsvpEntry
  group: {
    label: string
    guests: { id: string; name: string; isPlusOnePlaceholder?: boolean }[]
  }
}) {
  const [expanded, setExpanded] = useState(false)

  const goingNames = rsvp.attendingGuestIds
    .map((id) => {
      const g = group.guests.find((x) => x.id === id)
      if (!g) return null
      if (g.isPlusOnePlaceholder) return rsvp.plusOneName || 'Acompanhante'
      return g.name
    })
    .filter(Boolean) as string[]

  const yes = rsvp.attending === 'yes'
  const editCount = rsvp.editCount ?? 0
  const history = rsvp.previousVersions ?? []

  return (
    <div className="bg-white border border-sage-light/30 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-serif text-lg text-charcoal">{group.label}</p>
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light mt-0.5">
            {new Date(rsvp.submittedAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {editCount > 0 && (
            <span className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/30">
              editado {editCount}×
            </span>
          )}
          <span
            className={`flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${
              yes
                ? 'bg-sage-light/30 text-sage-dark'
                : 'bg-charcoal/10 text-charcoal'
            }`}
          >
            {yes ? <Check size={12} /> : <X size={12} />}
            {yes ? 'Confirmado' : 'Não vai'}
          </span>
        </div>
      </div>

      {yes && goingNames.length > 0 && (
        <div className="flex items-center gap-2 font-sans text-sm text-charcoal-light">
          <Users size={14} className="text-sage shrink-0" />
          <span>{goingNames.join(', ')}</span>
        </div>
      )}

      {rsvp.phone && (
        <div className="flex flex-wrap gap-4 font-sans text-xs text-charcoal-light">
          <span>📱 {rsvp.phone}</span>
        </div>
      )}

      {rsvp.message && (
        <p className="font-serif text-sm text-charcoal italic border-l-2 border-sage-light pl-3">
          “{rsvp.message}”
        </p>
      )}

      {history.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light hover:text-sage transition-colors cursor-pointer self-start"
          >
            <History size={12} />
            {expanded ? 'Ocultar' : 'Ver'} histórico ({history.length})
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {expanded && (
            <div className="flex flex-col gap-2 mt-1">
              {history
                .slice()
                .reverse()
                .map((prev, idx) => (
                  <HistoryItem
                    key={`${prev.submittedAt}-${idx}`}
                    version={prev}
                    label={`Versão ${history.length - idx}`}
                    group={group}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function HistoryItem({
  version,
  label,
  group,
}: {
  version: PreviousVersion
  label: string
  group: {
    guests: { id: string; name: string; isPlusOnePlaceholder?: boolean }[]
  }
}) {
  const names = version.attendingGuestIds
    .map((id) => {
      const g = group.guests.find((x) => x.id === id)
      if (!g) return null
      if (g.isPlusOnePlaceholder) return version.plusOneName || 'Acompanhante'
      return g.name
    })
    .filter(Boolean) as string[]

  const yes = version.attending === 'yes'

  return (
    <div className="bg-cream rounded-lg px-4 py-3 flex flex-col gap-1.5 border-l-2 border-gold/40">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light">
          {label} · {new Date(version.submittedAt).toLocaleString('pt-BR')}
        </p>
        <span
          className={`font-sans text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${
            yes
              ? 'bg-sage-light/40 text-sage-dark'
              : 'bg-charcoal/10 text-charcoal'
          }`}
        >
          {yes ? 'Confirmou' : 'Não ia'}
        </span>
      </div>

      {yes && names.length > 0 && (
        <p className="font-sans text-xs text-charcoal-light">
          <strong className="text-charcoal">{names.length}:</strong>{' '}
          {names.join(', ')}
        </p>
      )}

      {version.phone && (
        <p className="font-sans text-xs text-charcoal-light">
          📱 {version.phone}
        </p>
      )}

      {version.message && (
        <p className="font-serif text-xs italic text-charcoal-light/80">
          “{version.message}”
        </p>
      )}
    </div>
  )
}

function PendingRow({
  group,
}: {
  group: { id: string; label: string; guests: { name: string }[] }
}) {
  return (
    <div className="bg-cream-dark/40 border border-sage-light/20 rounded-xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <p className="font-serif text-base text-charcoal-light">{group.label}</p>
        <p className="font-sans text-xs text-charcoal-light/70 mt-0.5">
          {group.guests.map((x) => x.name).join(' · ')}
        </p>
      </div>
      <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-white text-charcoal-light/70">
        <Clock size={12} /> Pendente
      </span>
    </div>
  )
}

function downloadFile(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
