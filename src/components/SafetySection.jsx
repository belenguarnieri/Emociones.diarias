import { SAFETY_QUESTIONS, CRISIS_MESSAGE } from '../data/schema'

export function safetyTriggersAlert(answers) {
  return SAFETY_QUESTIONS.some((q) => q.alertValues.includes(answers?.[q.id]))
}

export default function SafetySection({ answers = {}, onChange }) {
  function setAnswer(id, val) {
    onChange({ ...answers, [id]: val })
  }

  return (
    <div className="safety">
      <p className="safety__intro">
        Estas preguntas se repiten todos los días. Contestá con calma, no hay respuestas
        "correctas": esta información es solo para que tu profesional pueda acompañarte mejor.
      </p>
      {SAFETY_QUESTIONS.map((q) => (
        <div key={q.id} className="safety__question">
          <p className="question__text">{q.text}</p>
          <div className="safety__options">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`safety__option ${answers[q.id] === opt ? 'safety__option--active' : ''}`}
                onClick={() => setAnswer(q.id, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CrisisModal({ onClose }) {
  return (
    <div className="crisis-overlay" role="alertdialog" aria-modal="true">
      <div className="crisis-card">
        <p>{CRISIS_MESSAGE}</p>
        <button type="button" className="crisis-card__btn" onClick={onClose}>
          Ya lo leí
        </button>
      </div>
    </div>
  )
}
