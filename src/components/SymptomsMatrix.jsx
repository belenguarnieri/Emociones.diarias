import { SINTOMAS_FISICOS } from '../data/schema'

// value: { [nombreSintoma]: { intensity: 0-10, note } , otro: { label, intensity, note } }
export default function SymptomsMatrix({ value = {}, onChange }) {
  function update(name, patch) {
    const current = value[name] || { intensity: 0, note: '' }
    onChange({ ...value, [name]: { ...current, ...patch } })
  }

  const otro = value.otro || { label: '', intensity: 0, note: '' }

  return (
    <div className="symptoms">
      <p className="section-intro">
        Marcá qué tan intenso fue cada síntoma hoy. Si no apareció, dejalo en 0.
      </p>
      {SINTOMAS_FISICOS.map((name) => {
        const entry = value[name] || { intensity: 0, note: '' }
        return (
          <div key={name} className="symptom-row">
            <div className="symptom-row__header">
              <span>{name}</span>
              <span className="symptom-row__value">{entry.intensity}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={entry.intensity}
              onChange={(e) => update(name, { intensity: Number(e.target.value) })}
            />
            <div className="symptom-row__labels">
              <span>0 = no apareció</span>
              <span>10 = intensidad máxima</span>
            </div>
            {entry.intensity >= 4 && (
              <textarea
                className="symptom-row__note"
                placeholder="Contanos qué sentiste y aproximadamente cuánto duró"
                rows={2}
                value={entry.note || ''}
                onChange={(e) => update(name, { note: e.target.value })}
              />
            )}
          </div>
        )
      })}

      <div className="symptom-row">
        <div className="symptom-row__header">
          <span>Otro síntoma</span>
          <span className="symptom-row__value">{otro.intensity}</span>
        </div>
        <input
          type="text"
          placeholder="¿Cuál?"
          value={otro.label}
          onChange={(e) => onChange({ ...value, otro: { ...otro, label: e.target.value } })}
          className="symptom-row__other-input"
        />
        <input
          type="range"
          min={0}
          max={10}
          value={otro.intensity}
          onChange={(e) => onChange({ ...value, otro: { ...otro, intensity: Number(e.target.value) } })}
        />
        {otro.intensity >= 4 && (
          <textarea
            className="symptom-row__note"
            placeholder="Contanos qué sentiste y aproximadamente cuánto duró"
            rows={2}
            value={otro.note || ''}
            onChange={(e) => onChange({ ...value, otro: { ...otro, note: e.target.value } })}
          />
        )}
      </div>
    </div>
  )
}
