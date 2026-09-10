import { getSortedDays, getSortedAdultObservations, getTreatmentInfo, getStartDate } from '../data/storage'
import { SINTOMAS_FISICOS, SAFETY_QUESTIONS } from '../data/schema'

function val(entry, qid) {
  const v = entry?.form?.answers?.[qid]?.value
  return typeof v === 'number' ? v : null
}

function average(nums) {
  const valid = nums.filter((n) => typeof n === 'number')
  if (!valid.length) return '—'
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}

function EmotionRow({ label, qid, days }) {
  const values = days.map((d) => val(d, qid))
  const first = values[0] ?? '—'
  const first5 = average(values.slice(0, 5))
  const last5 = average(values.slice(-5))
  return (
    <tr>
      <td>{label}</td>
      <td>{first}</td>
      <td>{first5}</td>
      <td>{last5}</td>
    </tr>
  )
}

function countAdherence(days, med) {
  let taken = 0, missed = 0, unknown = 0
  days.forEach((d) => {
    const t = d?.form?.medication?.[med]?.taken
    if (t === 'Sí') taken++
    else if (t === 'No') missed++
    else unknown++
  })
  return { taken, missed, unknown }
}

function symptomsSummary(days) {
  const rows = []
  SINTOMAS_FISICOS.forEach((name) => {
    const occurrences = days.filter((d) => (d?.form?.symptoms?.[name]?.intensity || 0) > 0)
    if (!occurrences.length) return
    const maxIntensity = Math.max(...occurrences.map((d) => d.form.symptoms[name].intensity))
    const notes = occurrences
      .filter((d) => d.form.symptoms[name].note)
      .map((d) => `Día ${d.dayNumber}: ${d.form.symptoms[name].note}`)
    rows.push({ name, days: occurrences.length, maxIntensity, notes: notes.join(' · ') })
  })
  return rows
}

function safetyDays(days) {
  return days
    .map((d) => ({ d, safety: d.form.safety || {} }))
    .filter(({ safety }) =>
      SAFETY_QUESTIONS.some((q) => safety[q.id] && safety[q.id] !== q.options[0])
    )
}

function freeTextEntries(days, adultObs) {
  const entries = []
  days.forEach((d) => {
    Object.entries(d.form.answers || {}).forEach(([, a]) => {
      if (a?.note) entries.push({ date: d.date, dayNumber: d.dayNumber, source: 'Adolescente', text: a.note })
    })
    if (d.form.medication?.notes) {
      entries.push({ date: d.date, dayNumber: d.dayNumber, source: 'Adolescente (medicación)', text: d.form.medication.notes })
    }
  })
  adultObs.forEach((o) => {
    if (o.behaviorChanges) entries.push({ date: `Día ${o.dayNumber}`, dayNumber: o.dayNumber, source: 'Adulto', text: o.behaviorChanges })
    if (o.otherNotes) entries.push({ date: `Día ${o.dayNumber}`, dayNumber: o.dayNumber, source: 'Adulto', text: o.otherNotes })
  })
  return entries.sort((a, b) => a.dayNumber - b.dayNumber)
}

export default function Report() {
  const days = getSortedDays()
  const adultObs = getSortedAdultObservations()
  const treatment = getTreatmentInfo()
  const start = getStartDate()

  if (!days.length) {
    return <p className="empty-state">Todavía no hay registros para generar el informe.</p>
  }

  const end = days[days.length - 1].date
  const sertralina = countAdherence(days, 'Sertralina')
  const risperidona = countAdherence(days, 'Risperidona')
  const symptomRows = symptomsSummary(days)
  const flaggedDays = safetyDays(days)
  const freeText = freeTextEntries(days, adultObs)

  const activationHigh = days.filter(
    (d) => (val(d, 'q7') ?? 0) >= 7 || (val(d, 'q8') && val(d, 'q8') >= 7) || (val(d, 'q9') ?? 0) >= 7 || (val(d, 'q10') ?? 0) >= 7
  )

  return (
    <div className="report">
      <div className="report__actions no-print">
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          Imprimir / guardar como PDF
        </button>
      </div>

      <h1><span className="no-print">📋 </span>Informe para el próximo control</h1>

      <section>
        <h2>1. Tratamiento registrado</h2>
        <p>Sertralina: {treatment.sertralina}</p>
        <p>Risperidona: {treatment.risperidona}</p>
        <p>Horario indicado: {treatment.horario}</p>
        <p>Período registrado: {start} a {end} ({days.length} días con registro)</p>
      </section>

      <section>
        <h2>2. Adherencia</h2>
        <table className="report-table">
          <thead><tr><th></th><th>Tomadas</th><th>Omitidas</th><th>No recuerda</th></tr></thead>
          <tbody>
            <tr><td>Sertralina</td><td>{sertralina.taken}</td><td>{sertralina.missed}</td><td>{sertralina.unknown}</td></tr>
            <tr><td>Risperidona</td><td>{risperidona.taken}</td><td>{risperidona.missed}</td><td>{risperidona.unknown}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>3. Evolución emocional</h2>
        <table className="report-table">
          <thead><tr><th></th><th>Día 1</th><th>Prom. días 1–5</th><th>Prom. últimos 5</th></tr></thead>
          <tbody>
            <EmotionRow label="Ánimo" qid="q1" days={days} />
            <EmotionRow label="Tristeza" qid="q2" days={days} />
            <EmotionRow label="Ansiedad" qid="q3" days={days} />
            <EmotionRow label="Irritabilidad" qid="q4" days={days} />
            <EmotionRow label="Interés / disfrute" qid="q5" days={days} />
            <EmotionRow label="Energía" qid="q6" days={days} />
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Sueño</h2>
        <p>Calidad del sueño — promedio: {average(days.map((d) => val(d, 'q12')))}</p>
        <p>Somnolencia diurna — promedio: {average(days.map((d) => val(d, 'q13')))}</p>
        <p>Dificultad para dormir — promedio: {average(days.map((d) => val(d, 'q14')))}</p>
      </section>

      <section>
        <h2>5. Activación / inquietud</h2>
        <p>
          Inquietud, necesidad de movimiento, impulsividad o pensamientos acelerados: promedios de
          {' '}{average(days.map((d) => val(d, 'q7')))} / {average(days.map((d) => val(d, 'q9')))} / {average(days.map((d) => val(d, 'q10')))}
        </p>
        <p>Días con algún valor ≥7 en esta sección: {activationHigh.length ? activationHigh.map((d) => d.dayNumber).join(', ') : 'ninguno'}</p>
      </section>

      <section>
        <h2>6. Efectos físicos</h2>
        {symptomRows.length ? (
          <table className="report-table">
            <thead><tr><th>Síntoma</th><th>Días</th><th>Intensidad máx.</th><th>Observaciones</th></tr></thead>
            <tbody>
              {symptomRows.map((r) => (
                <tr key={r.name}><td>{r.name}</td><td>{r.days}</td><td>{r.maxIntensity}</td><td>{r.notes || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se registraron síntomas físicos relevantes.</p>
        )}
      </section>

      <section>
        <h2>7. Apetito y peso</h2>
        <p>Apetito — promedio: {average(days.map((d) => (typeof d?.form?.appetite?.q15?.value === 'number' ? d.form.appetite.q15.value : null)))}</p>
        {adultObs.length ? (
          <table className="report-table">
            <thead><tr><th>Día</th><th>Peso (kg)</th></tr></thead>
            <tbody>{adultObs.map((o) => <tr key={o.dayNumber}><td>{o.dayNumber}</td><td>{o.weight || '—'}</td></tr>)}</tbody>
          </table>
        ) : <p>Sin registros de peso del adulto.</p>}
      </section>

      <section>
        <h2>8. Funcionamiento</h2>
        <p>Dificultad para actividades cotidianas — promedio: {average(days.map((d) => val(d, 'q17')))}</p>
        <p>Aislamiento — promedio: {average(days.map((d) => val(d, 'q18')))}</p>
        <p>Valoración general del día — promedio: {average(days.map((d) => val(d, 'q19')))}</p>
      </section>

      <section className="report__safety">
        <h2>9. Seguridad</h2>
        {flaggedDays.length ? (
          <>
            <p>Días con alguna respuesta distinta de la opción "sin riesgo" en esta sección:</p>
            <table className="report-table">
              <thead><tr><th>Día</th><th>Fecha</th>{SAFETY_QUESTIONS.map((q) => <th key={q.id}>{q.id}</th>)}</tr></thead>
              <tbody>
                {flaggedDays.map(({ d, safety }) => (
                  <tr key={d.date}>
                    <td>{d.dayNumber}</td>
                    <td>{d.date}</td>
                    {SAFETY_QUESTIONS.map((q) => <td key={q.id}>{safety[q.id] || '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No se registraron respuestas de riesgo en esta sección durante el período.</p>
        )}
      </section>

      <section>
        <h2>10. Observaciones libres</h2>
        {freeText.length ? (
          freeText.map((e, i) => (
            <p key={i}><strong>{e.date} ({e.source}):</strong> {e.text}</p>
          ))
        ) : (
          <p>No se registraron observaciones escritas.</p>
        )}
      </section>

      <section>
        <h2>11. Preguntas para conversar con el psiquiatra</h2>
        <ul>
          <li>¿Los cambios observados son compatibles con la adaptación inicial al tratamiento?</li>
          <li>¿La somnolencia o inquietud observada requiere algún ajuste?</li>
          <li>¿Cómo evolucionó el sueño desde el inicio?</li>
          <li>¿Hay algún efecto adverso que requiera seguimiento?</li>
          <li>¿Qué cambios conviene continuar registrando?</li>
        </ul>
      </section>

      <p className="report__disclaimer">
        Este informe fue generado a partir de un autorregistro diario. No incluye interpretaciones
        clínicas, diagnósticos ni recomendaciones sobre la medicación.
      </p>
    </div>
  )
}
