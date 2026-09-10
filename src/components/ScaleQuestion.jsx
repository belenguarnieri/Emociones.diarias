import { useState } from 'react'

// Pregunta de escala 1-10 (o 1-10 con tres etiquetas, para apetito).
// value puede ser un número 1-10, o "unknown" si tocó "No sé".
export default function ScaleQuestion({ question, value, note, onChange, appetiteLabels, hue }) {
  const [showNote, setShowNote] = useState(Boolean(note))
  const current = value === 'unknown' ? null : value

  function setValue(v) {
    onChange({ value: v, note })
  }

  function setNote(n) {
    onChange({ value, note: n })
  }

  return (
    <div className="question">
      <p className="question__text">{question.text}</p>
      {question.help && <p className="question__help">{question.help}</p>}

      <div className="scale">
        <div className="scale__track">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`scale__dot ${hue ? `scale__dot--${hue}` : ''} ${current === n ? 'scale__dot--active' : ''}`}
              onClick={() => setValue(n)}
              aria-label={`${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        {appetiteLabels ? (
          <div className="scale__labels scale__labels--triple">
            <span>{appetiteLabels[1]}</span>
            <span>{appetiteLabels[5]}</span>
            <span>{appetiteLabels[10]}</span>
          </div>
        ) : (
          <div className="scale__labels">
            <span>1 = {question.minLabel}</span>
            <span>10 = {question.maxLabel}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`unknown-btn ${value === 'unknown' ? 'unknown-btn--active' : ''}`}
        onClick={() => setValue(value === 'unknown' ? null : 'unknown')}
      >
        No sé / no puedo evaluarlo
      </button>

      {!showNote ? (
        <button type="button" className="note-toggle" onClick={() => setShowNote(true)}>
          ¿Querés contar algo más sobre esto?
        </button>
      ) : (
        <div className="note-field">
          <label className="note-field__label">
            {question.extraNote || '¿Querés contar algo más sobre esto? (opcional)'}
          </label>
          <textarea
            value={note || ''}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Opcional"
          />
        </div>
      )}
    </div>
  )
}
