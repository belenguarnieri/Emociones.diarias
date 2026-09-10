import { useEffect, useState } from 'react'
import {
  ANIMO,
  ACTIVACION,
  SUENO,
  APETITO,
  FUNCIONAMIENTO,
  FISICO_META,
  SEGURIDAD_META,
  MEDICACION_META,
  TRATAMIENTO,
} from '../data/schema'
import ScaleQuestion from './ScaleQuestion'
import SymptomsMatrix from './SymptomsMatrix'
import SafetySection, { safetyTriggersAlert, CrisisModal } from './SafetySection'
import MedicationSection from './MedicationSection'
import { getDay, saveDay, dayNumberForDate, todayISO, getStartDate } from '../data/storage'

const SCALE_SECTIONS = [ANIMO, ACTIVACION, SUENO, FUNCIONAMIENTO]

function emptyForm() {
  return {
    answers: {}, // q1: {value, note}
    hoursSlept: '',
    symptoms: {},
    appetite: {}, // q15: {value, note}, q16: {value}
    safety: {},
    medication: {},
  }
}

export default function DailyCheckin({ dateISO, onSaved }) {
  const [form, setForm] = useState(emptyForm())
  const [openSection, setOpenSection] = useState('animo')
  const [showCrisis, setShowCrisis] = useState(false)
  const [confirmEdit, setConfirmEdit] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [existing, setExisting] = useState(null)

  const dayNumber = dayNumberForDate(dateISO)

  useEffect(() => {
    const rec = getDay(dateISO)
    setExisting(rec)
    setForm(rec ? rec.form : emptyForm())
  }, [dateISO])

  function updateAnswer(qid, patch) {
    setForm((f) => ({ ...f, answers: { ...f.answers, [qid]: patch } }))
  }

  function attemptSave() {
    if (existing && !confirmEdit) {
      setConfirmEdit(true)
      return
    }
    doSave()
  }

  function doSave() {
    saveDay(dateISO, { form })
    setConfirmEdit(false)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
    if (safetyTriggersAlert(form.safety)) {
      setShowCrisis(true)
    }
    onSaved?.()
  }

  const sectionsList = [
    { id: 'animo', label: ANIMO.title, emoji: ANIMO.emoji, hue: ANIMO.hue },
    { id: 'activacion', label: ACTIVACION.title, emoji: ACTIVACION.emoji, hue: ACTIVACION.hue },
    { id: 'sueno', label: SUENO.title, emoji: SUENO.emoji, hue: SUENO.hue },
    { id: 'fisico', label: FISICO_META.title, emoji: FISICO_META.emoji, hue: FISICO_META.hue },
    { id: 'apetito', label: APETITO.title, emoji: APETITO.emoji, hue: APETITO.hue },
    { id: 'funcionamiento', label: FUNCIONAMIENTO.title, emoji: FUNCIONAMIENTO.emoji, hue: FUNCIONAMIENTO.hue },
    { id: 'seguridad', label: SEGURIDAD_META.title, emoji: SEGURIDAD_META.emoji, hue: SEGURIDAD_META.hue },
    { id: 'medicacion', label: MEDICACION_META.title, emoji: MEDICACION_META.emoji, hue: MEDICACION_META.hue },
  ]

  return (
    <div className="checkin">
      {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} />}

      <div className="checkin__progress">
        <div className="checkin__progress-bar">
          <div
            className="checkin__progress-fill"
            style={{ width: `${Math.min(100, (dayNumber / TRATAMIENTO.duracionDias) * 100)}%` }}
          />
        </div>
        <span>Día {dayNumber} de {TRATAMIENTO.duracionDias}</span>
      </div>

      {confirmEdit && (
        <div className="edit-confirm">
          <p>Ya habías completado el registro de este día. ¿Querés modificarlo?</p>
          <div className="edit-confirm__actions">
            <button type="button" onClick={() => setConfirmEdit(false)}>Cancelar</button>
            <button type="button" className="btn-primary" onClick={doSave}>Sí, modificar</button>
          </div>
        </div>
      )}

      {sectionsList.map((s) => (
        <div
          key={s.id}
          className={`accordion ${openSection === s.id ? 'accordion--open' : ''} ${s.hue ? `accordion--${s.hue}` : ''}`}
        >
          <button
            type="button"
            className="accordion__header"
            onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
          >
            <span className="accordion__emoji">{s.emoji}</span>
            <span className="accordion__label">{s.label}</span>
            <span className="accordion__chevron">{openSection === s.id ? '−' : '+'}</span>
          </button>

          {openSection === s.id && (
            <div className="accordion__body">
              {s.id === 'fisico' && (
                <SymptomsMatrix
                  value={form.symptoms}
                  onChange={(symptoms) => setForm((f) => ({ ...f, symptoms }))}
                />
              )}

              {s.id === 'sueno' && (
                <div className="hours-field">
                  <label>¿Cuántas horas dormiste aproximadamente anoche?</label>
                  <input
                    type="text"
                    placeholder="Ej: 7h 30min"
                    value={form.hoursSlept}
                    onChange={(e) => setForm((f) => ({ ...f, hoursSlept: e.target.value }))}
                  />
                </div>
              )}

              {s.id === 'apetito' && (
                <>
                  <ScaleQuestion
                    question={APETITO.questions[0]}
                    value={form.appetite.q15?.value}
                    note={form.appetite.q15?.note}
                    appetiteLabels={APETITO.questions[0].labels}
                    hue={APETITO.hue}
                    onChange={(patch) => setForm((f) => ({ ...f, appetite: { ...f.appetite, q15: patch } }))}
                  />
                  <div className="question">
                    <p className="question__text">{APETITO.questions[1].text}</p>
                    <div className="safety__options">
                      {APETITO.questions[1].options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`safety__option ${form.appetite.q16?.value === opt ? 'safety__option--active' : ''}`}
                          onClick={() =>
                            setForm((f) => ({ ...f, appetite: { ...f.appetite, q16: { value: opt } } }))
                          }
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {s.id === 'seguridad' && (
                <SafetySection
                  answers={form.safety}
                  onChange={(safety) => setForm((f) => ({ ...f, safety }))}
                />
              )}

              {s.id === 'medicacion' && (
                <MedicationSection
                  value={form.medication}
                  onChange={(medication) => setForm((f) => ({ ...f, medication }))}
                />
              )}

              {SCALE_SECTIONS.filter((sec) => sec.id === s.id).map((sec) => (
                <div key={sec.id}>
                  {sec.intro && <p className="section-intro">{sec.intro}</p>}
                  {sec.questions.map((q) => (
                    <ScaleQuestion
                      key={q.id}
                      question={q}
                      value={form.answers[q.id]?.value}
                      note={form.answers[q.id]?.note}
                      hue={sec.hue}
                      onChange={(patch) => updateAnswer(q.id, patch)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn-primary btn-save" onClick={attemptSave}>
        Guardar registro de hoy
      </button>
      {savedFlash && <p className="saved-flash">Registro guardado</p>}
    </div>
  )
}
