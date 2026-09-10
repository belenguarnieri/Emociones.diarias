import { useEffect, useState } from 'react'
import { ADULTO_ESCALAS } from '../data/schema'
import { getAdultObservations, saveAdultObservation, getSortedAdultObservations } from '../data/storage'

const SUGGESTED_DAYS = [1, 7, 14, 20]

function emptyForm() {
  return { weight: '', scales: {}, behaviorChanges: '', otherNotes: '' }
}

export default function AdultObservations() {
  const [dayNumber, setDayNumber] = useState(1)
  const [form, setForm] = useState(emptyForm())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const all = getAdultObservations()
    setForm(all[dayNumber] || emptyForm())
  }, [dayNumber])

  function save() {
    saveAdultObservation(dayNumber, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const history = getSortedAdultObservations()

  return (
    <div className="adult">
      <h2>👤 Observaciones del adulto</h2>
      <p className="section-intro">
        Este espacio es para vos. Sugerimos completarlo los días 1, 7, 14 y 20, aunque podés
        hacerlo cualquier día.
      </p>

      <div className="adult__day-picker">
        <label>Día</label>
        <div className="safety__options">
          {SUGGESTED_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              className={`safety__option ${dayNumber === d ? 'safety__option--active' : ''}`}
              onClick={() => setDayNumber(d)}
            >
              Día {d}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          className="adult__day-input"
          value={dayNumber}
          onChange={(e) => setDayNumber(Number(e.target.value) || 1)}
        />
      </div>

      <div className="question">
        <p className="question__text">Peso (kg)</p>
        <input
          type="text"
          value={form.weight}
          placeholder="Opcional"
          onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
        />
      </div>

      {ADULTO_ESCALAS.map((label) => (
        <div key={label} className="symptom-row">
          <div className="symptom-row__header">
            <span>{label}</span>
            <span className="symptom-row__value">{form.scales[label] ?? '—'}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={form.scales[label] || 1}
            onChange={(e) => setForm((f) => ({ ...f, scales: { ...f.scales, [label]: Number(e.target.value) } }))}
          />
        </div>
      ))}

      <div className="note-field">
        <label className="note-field__label">Cambios de conducta que hayas notado</label>
        <textarea
          rows={3}
          placeholder="Texto libre"
          value={form.behaviorChanges}
          onChange={(e) => setForm((f) => ({ ...f, behaviorChanges: e.target.value }))}
        />
      </div>

      <div className="note-field">
        <label className="note-field__label">Otros síntomas o situaciones importantes</label>
        <textarea
          rows={3}
          placeholder="Texto libre"
          value={form.otherNotes}
          onChange={(e) => setForm((f) => ({ ...f, otherNotes: e.target.value }))}
        />
      </div>

      <button type="button" className="btn-primary btn-save" onClick={save}>
        Guardar observación del día {dayNumber}
      </button>
      {saved && <p className="saved-flash">Observación guardada</p>}

      {history.length > 0 && (
        <div className="adult__history">
          <h3>📋 Observaciones guardadas</h3>
          {history.map((h) => (
            <p key={h.dayNumber}>Día {h.dayNumber} — {h.weight ? `${h.weight} kg` : 'sin peso registrado'}</p>
          ))}
        </div>
      )}
    </div>
  )
}
