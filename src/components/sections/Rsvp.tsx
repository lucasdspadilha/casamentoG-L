import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, Search, ArrowLeft, Users, X } from 'lucide-react'
import { SectionTitle } from '../ui/SectionTitle'
import { searchGroups, findGroupById } from '../../lib/guests'
import {
  getRsvpByGroup,
  saveRsvp,
  type RsvpEntry,
} from '../../lib/rsvp'
import { celebrate } from '../../lib/confetti'
import { formatPhone, isValidPhone } from '../../lib/phone'
import { useEscapeKey } from '../../lib/useEscapeKey'
import type { GuestGroup } from '../../data/guestGroups'

type Step = 'search' | 'group' | 'details' | 'success'

interface Details {
  phone: string
  message: string
}

const emptyDetails: Details = { phone: '', message: '' }

export function Rsvp() {
  const [step, setStep] = useState<Step>('search')
  const [query, setQuery] = useState('')
  const [groupId, setGroupId] = useState<string | null>(null)
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [plusOneName, setPlusOneName] = useState('')
  const [details, setDetails] = useState<Details>(emptyDetails)
  const [pendingEntry, setPendingEntry] = useState<RsvpEntry | null>(null)
  const [existingEntry, setExistingEntry] = useState<RsvpEntry | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const results = useMemo(() => searchGroups(query), [query])
  const group = groupId ? findGroupById(groupId) : undefined

  function pickGroup(g: GuestGroup) {
    setGroupId(g.id)
    // Sempre começa limpo — sem reaproveitar dados de RSVPs anteriores.
    setAttending('')
    setSelectedIds(g.guests.filter((x) => !x.isPlusOnePlaceholder).map((x) => x.id))
    setPlusOneName('')
    setDetails(emptyDetails)
    setStep('group')
  }

  function toggleGuest(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function goToDetails() {
    if (!group) return
    if (attending === 'no') {
      submit('no', [])
      return
    }
    setStep('details')
  }

  function buildEntry(
    finalAttending: 'yes' | 'no',
    finalIds: string[]
  ): RsvpEntry {
    const placeholder = group!.guests.find((g) => g.isPlusOnePlaceholder)
    const hasPlusOne =
      placeholder && finalIds.includes(placeholder.id) && plusOneName.trim().length > 0
    return {
      groupId: group!.id,
      attending: finalAttending,
      attendingGuestIds: finalAttending === 'yes' ? finalIds : [],
      plusOneName: hasPlusOne ? plusOneName.trim() : undefined,
      phone: details.phone.trim() || undefined,
      message: details.message.trim() || undefined,
      submittedAt: new Date().toISOString(),
    }
  }

  async function submit(finalAttending: 'yes' | 'no', finalIds: string[]) {
    if (!group || submitting) return
    setSubmitting(true)
    const entry = buildEntry(finalAttending, finalIds)
    try {
      const existing = await getRsvpByGroup(group.id)
      if (existing) {
        // Já existe RSVP — pede confirmação antes de sobrescrever.
        setPendingEntry(entry)
        setExistingEntry(existing)
        return
      }
      await saveRsvp(entry)
      setStep('success')
    } catch (err) {
      alert(
        'Erro ao enviar confirmação: ' +
          (err instanceof Error ? err.message : 'tente novamente')
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmOverwrite() {
    if (!pendingEntry || submitting) return
    setSubmitting(true)
    try {
      // Backend cuida do editCount e previousVersions automaticamente
      await saveRsvp(pendingEntry)
      setPendingEntry(null)
      setExistingEntry(null)
      setStep('success')
    } catch (err) {
      alert(
        'Erro ao atualizar confirmação: ' +
          (err instanceof Error ? err.message : 'tente novamente')
      )
    } finally {
      setSubmitting(false)
    }
  }

  function cancelOverwrite() {
    setPendingEntry(null)
    setExistingEntry(null)
  }

  return (
    <section id="rsvp" className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-xl mx-auto">
        <SectionTitle
          label="Até 10 de Agosto de 2026"
          title="Confirmar Presença"
          subtitle="Comece digitando seu nome ou o da família que vocês fazem parte."
        />

        <AnimatePresence mode="wait">
          {step === 'search' && (
            <SearchStep
              key="search"
              query={query}
              setQuery={setQuery}
              results={results}
              onPick={pickGroup}
            />
          )}
          {step === 'group' && group && (
            <GroupStep
              key="group"
              group={group}
              attending={attending}
              setAttending={setAttending}
              selectedIds={selectedIds}
              toggleGuest={toggleGuest}
              plusOneName={plusOneName}
              setPlusOneName={setPlusOneName}
              onBack={() => setStep('search')}
              onContinue={goToDetails}
              submitting={submitting}
            />
          )}
          {step === 'details' && group && (
            <DetailsStep
              key="details"
              details={details}
              setDetails={setDetails}
              onBack={() => setStep('group')}
              onSubmit={() => submit('yes', selectedIds)}
              submitting={submitting}
            />
          )}
          {step === 'success' && group && (
            <SuccessStep
              key="success"
              group={group}
              attending={attending === 'no' ? 'no' : 'yes'}
              count={selectedIds.length}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {existingEntry && group && (
          <OverwriteDialog
            group={group}
            existing={existingEntry}
            onCancel={cancelOverwrite}
            onConfirm={confirmOverwrite}
            submitting={submitting}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function OverwriteDialog({
  group,
  existing,
  onCancel,
  onConfirm,
  submitting,
}: {
  group: GuestGroup
  existing: RsvpEntry
  onCancel: () => void
  onConfirm: () => void
  submitting: boolean
}) {
  useEscapeKey(onCancel)

  const prevNames = existing.attendingGuestIds
    .map((id) => {
      const g = group.guests.find((x) => x.id === id)
      if (!g) return null
      if (g.isPlusOnePlaceholder) return existing.plusOneName || 'Acompanhante'
      return g.name
    })
    .filter(Boolean) as string[]

  const submittedDate = new Date(existing.submittedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className="fixed inset-0 bg-charcoal/40 z-50 flex items-end sm:items-center justify-center sm:px-6"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 flex flex-col gap-5"
      >
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-sage">
            Atenção
          </p>
          <h3 className="font-serif text-2xl text-charcoal mt-2">
            Esta família já tem uma confirmação
          </h3>
        </div>

        <div className="bg-white border border-sage-light/30 rounded-xl p-4 flex flex-col gap-2">
          <p className="font-serif text-lg text-charcoal">{group.label}</p>
          <p className="font-sans text-xs text-charcoal-light">
            Confirmado em <strong>{submittedDate}</strong>
          </p>
          {existing.attending === 'yes' ? (
            <p className="font-sans text-sm text-charcoal-light">
              <strong className="text-charcoal">
                {prevNames.length} {prevNames.length === 1 ? 'pessoa vai' : 'pessoas vão'}:
              </strong>{' '}
              {prevNames.join(', ')}
            </p>
          ) : (
            <p className="font-sans text-sm text-charcoal-light">
              <strong className="text-charcoal">Marcou que não vai.</strong>
            </p>
          )}
          {existing.editCount !== undefined && existing.editCount > 0 && (
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-light/60">
              Já foi editado {existing.editCount}× antes
            </p>
          )}
        </div>

        <p className="font-sans text-sm text-charcoal-light leading-relaxed">
          Tem certeza que quer <strong>substituir</strong> essa confirmação pela
          nova? Se foi engano, é só cancelar e voltar.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light border border-sage-light/40 px-6 py-3 rounded-full hover:bg-charcoal hover:text-cream hover:border-charcoal transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 font-sans text-xs tracking-[0.2em] uppercase bg-sage text-cream px-6 py-3 rounded-full hover:bg-sage-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Salvando...' : 'Sim, substituir'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="mt-12"
    >
      {children}
    </motion.div>
  )
}

function SearchStep({
  query,
  setQuery,
  results,
  onPick,
}: {
  query: string
  setQuery: (q: string) => void
  results: GuestGroup[]
  onPick: (g: GuestGroup) => void
}) {
  return (
    <StepWrap>
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light/60"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite seu nome ou o da família..."
            className="w-full bg-white border border-sage-light/30 rounded-xl pl-11 pr-4 py-4 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-light/50 hover:text-charcoal cursor-pointer"
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {query.length >= 2 && results.length === 0 && (
          <p className="text-center font-sans text-sm text-charcoal-light leading-relaxed py-6">
            Hmm, não achamos esse nome.<br />
            Confira a grafia ou nos chame no WhatsApp.
          </p>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((g) => {
              const allInLabel = g.guests.every((x) =>
                g.label.toLowerCase().includes(x.name.toLowerCase())
              )
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onPick(g)}
                  className="w-full text-left bg-white border border-sage-light/30 rounded-xl px-5 py-4 hover:border-sage hover:bg-sage-light/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-serif text-lg text-charcoal">{g.label}</p>
                      {!allInLabel && (
                        <p className="font-sans text-xs text-charcoal-light mt-0.5">
                          {g.guests.map((x) => x.name).join(' · ')}
                        </p>
                      )}
                    </div>
                    <Users
                      size={18}
                      className="text-sage-light shrink-0 group-hover:text-sage transition-colors"
                    />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </StepWrap>
  )
}

function GroupStep({
  group,
  attending,
  setAttending,
  selectedIds,
  toggleGuest,
  plusOneName,
  setPlusOneName,
  onBack,
  onContinue,
  submitting,
}: {
  group: GuestGroup
  attending: 'yes' | 'no' | ''
  setAttending: (a: 'yes' | 'no') => void
  selectedIds: string[]
  toggleGuest: (id: string) => void
  plusOneName: string
  setPlusOneName: (n: string) => void
  onBack: () => void
  onContinue: () => void
  submitting: boolean
}) {
  const placeholder = group.guests.find((g) => g.isPlusOnePlaceholder)
  const placeholderSelected =
    placeholder && selectedIds.includes(placeholder.id)
  const placeholderInvalid = placeholderSelected && !plusOneName.trim()

  const realGuestsSelected = selectedIds.filter(
    (id) => !group.guests.find((g) => g.id === id)?.isPlusOnePlaceholder
  ).length

  const canContinue =
    attending === 'no' ||
    (attending === 'yes' &&
      realGuestsSelected > 0 &&
      !placeholderInvalid)

  return (
    <StepWrap>
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1.5 font-sans text-xs text-charcoal-light hover:text-charcoal transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        <div className="bg-white border border-sage-light/30 rounded-xl px-5 py-4">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-1">
            Grupo encontrado
          </p>
          <p className="font-serif text-2xl text-charcoal">{group.label}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Vão comparecer? *
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAttending('yes')}
              className={`flex-1 font-sans text-xs py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                attending === 'yes'
                  ? 'bg-sage text-cream border-sage'
                  : 'bg-white text-charcoal-light border-sage-light/30 hover:border-sage'
              }`}
            >
              Sim, com certeza! 🥂
            </button>
            <button
              type="button"
              onClick={() => setAttending('no')}
              className={`flex-1 font-sans text-xs py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                attending === 'no'
                  ? 'bg-sage text-cream border-sage'
                  : 'bg-white text-charcoal-light border-sage-light/30 hover:border-sage'
              }`}
            >
              Não poderemos ir
            </button>
          </div>
        </div>

        {attending === 'yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-3"
          >
            <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
              Quem vai? Marque os presentes
            </label>
            <div className="flex flex-col gap-2">
              {group.guests.map((g) => {
                const checked = selectedIds.includes(g.id)
                return (
                  <label
                    key={g.id}
                    className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                      checked
                        ? 'border-sage bg-sage-light/10'
                        : 'border-sage-light/30 hover:border-sage-light'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGuest(g.id)}
                      className="w-4 h-4 accent-sage cursor-pointer"
                    />
                    <span className="font-sans text-sm text-charcoal">
                      {g.name}
                      {g.isPlusOnePlaceholder && (
                        <span className="ml-2 font-sans text-[10px] tracking-[0.15em] uppercase text-sage">
                          (acompanhante)
                        </span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>

            {placeholderSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-1.5"
              >
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                  Nome do acompanhante *
                </label>
                <input
                  type="text"
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || submitting}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting
            ? 'Enviando...'
            : attending === 'no'
              ? 'Enviar resposta'
              : 'Continuar'}
        </button>
      </div>
    </StepWrap>
  )
}

function DetailsStep({
  details,
  setDetails,
  onBack,
  onSubmit,
  submitting,
}: {
  details: Details
  setDetails: (d: Details) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}) {
  function update<K extends keyof Details>(key: K, value: Details[K]) {
    setDetails({ ...details, [key]: value })
  }

  return (
    <StepWrap>
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1.5 font-sans text-xs text-charcoal-light hover:text-charcoal transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Voltar
        </button>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            WhatsApp *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={details.phone}
            onChange={(e) => update('phone', formatPhone(e.target.value))}
            placeholder="(11) 9 0000-0000"
            required
            maxLength={16}
            className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors"
          />
          {details.phone && !isValidPhone(details.phone) && (
            <p className="font-sans text-xs text-red-500">
              Digite um número completo (DDD + 9 dígitos do celular).
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
            Mensagem para os noivos (opcional)
          </label>
          <textarea
            value={details.message}
            onChange={(e) => update('message', e.target.value)}
            rows={3}
            placeholder="Deixe um recado especial..."
            className="w-full bg-white border border-sage-light/30 rounded-xl px-4 py-3 font-sans text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-sage transition-colors resize-none"
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValidPhone(details.phone) || submitting}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-sage text-cream font-sans text-xs tracking-[0.2em] uppercase py-4 rounded-full hover:bg-sage-dark transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send size={14} />
          {submitting ? 'Enviando...' : 'Confirmar'}
        </button>
      </div>
    </StepWrap>
  )
}

function SuccessStep({
  group,
  attending,
  count,
}: {
  group: GuestGroup
  attending: 'yes' | 'no'
  count: number
}) {
  useEffect(() => {
    if (attending === 'yes') celebrate()
  }, [attending])

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 max-w-md mx-auto flex flex-col items-center text-center gap-6"
    >
      <CheckCircle size={48} className="text-sage" />
      <h3 className="font-serif text-3xl font-light text-charcoal">
        {attending === 'yes' ? 'Até lá! 🌿' : 'Vamos sentir sua falta!'}
      </h3>
      <p className="font-sans text-sm text-charcoal-light leading-relaxed">
        {attending === 'yes' ? (
          <>
            Confirmação recebida pra <strong>{group.label}</strong>.<br />
            {count === 1 ? '1 pessoa' : `${count} pessoas`} vão celebrar com a
            gente. Mal podemos esperar!
          </>
        ) : (
          <>
            Obrigado por avisar, <strong>{group.label}</strong>. Estaremos
            pensando em vocês no dia.
          </>
        )}
      </p>
    </motion.div>
  )
}
