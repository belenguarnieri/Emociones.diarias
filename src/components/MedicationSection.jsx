import { MEDICAMENTOS, MEDICAMENTO_OPCIONES } from '../data/schema'

// value: { Sertralina: {taken, time}, Risperidona: {taken, time}, notes }
export default function MedicationSection({ value = {}, onChange }) {
  function update(med, patch) {
    const current = value[med] || { taken: '', time: '' }
    onChange({ ...value, [med]: { ...current, ...patch } })
  }

  return (
    <div className="medication">
      {MEDICAMENTOS.map((med) => {
        const entry = value[med] || { taken: '', time: '' }
        return (
          <div key={med} className="medication__row">
            <p className="question__text">{med}: ¿tomaste hoy la medicación?</p>
            <div className="safety__options">
              {MEDICAMENTO_OPCIONES.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`safety__option ${entry.taken === opt ? 'safety__option--active' : ''}`}
                  onClick={() => update(med, { taken: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
            {entry.taken === 'Sí' && (
              <div className="medication__time">
                <label>¿A qué hora aproximadamente?</label>
                <input
                  type="time"
                  value={entry.time || ''}
                  onChange={(e) => update(med, { time: e.target.value })}
                />
              </div>
            )}
          </div>
        )
      })}

      <div className="note-field">
        <label className="note-field__label">
          ¿Pasó algo particular después de tomarla? (opcional)
        </label>
        <p className="question__help">
          Por ejemplo: me dio sueño, me sentí mareada, me dolió la cabeza, me sentí más inquieta.
        </p>
        <textarea
          rows={2}
          placeholder="Opcional"
          value={value.notes || ''}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  )
}
