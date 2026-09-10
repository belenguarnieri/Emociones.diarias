// Estas funciones solo juntan y ordenan los datos que ya se cargaron.
// A propósito NO interpretan si algo "mejoró" o "empeoró", ni usan
// lenguaje clínico: eso queda para el psiquiatra en el control.

import { SINTOMAS_FISICOS } from './schema'

function val(day, qid) {
  const v = day?.form?.answers?.[qid]?.value
  return typeof v === 'number' ? v : null
}

export function daySafetyFlagged(day) {
  const safety = day?.form?.safety || {}
  const alertMap = {
    q21: ['Sí, y sentí que podría hacerlo'],
    q22: ['Sí'],
    q23: ['No estoy segura', 'No'],
  }
  return Object.entries(alertMap).some(([id, values]) => values.includes(safety[id]))
}

export function computeDaySummary(day) {
  if (!day) return null
  const symptoms = SINTOMAS_FISICOS.filter((name) => (day.form.symptoms?.[name]?.intensity || 0) > 0).map(
    (name) => ({ name, intensity: day.form.symptoms[name].intensity })
  )
  const med = day.form.medication || {}
  const medStatus =
    med.Sertralina?.taken === 'Sí' && med.Risperidona?.taken === 'Sí'
      ? 'ambas tomadas'
      : 'alguna dosis sin confirmar'

  return {
    dayNumber: day.dayNumber,
    date: day.date,
    mood: val(day, 'q1'),
    energy: val(day, 'q6'),
    sleepQuality: val(day, 'q12'),
    hoursSlept: day.form.hoursSlept || null,
    symptoms,
    medicationStatus: medStatus,
    safetyFlagged: daySafetyFlagged(day),
  }
}

export function computeMonthSummary(days) {
  if (!days.length) return null
  const moods = days.map((d) => val(d, 'q1')).filter((n) => typeof n === 'number')
  const sleeps = days.map((d) => val(d, 'q12')).filter((n) => typeof n === 'number')
  const avg = (arr) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null)
  const daysWithSymptoms = days.filter((d) =>
    SINTOMAS_FISICOS.some((name) => (d.form.symptoms?.[name]?.intensity || 0) > 0)
  ).length
  const flaggedDays = days.filter(daySafetyFlagged)

  return {
    totalDays: days.length,
    avgMood: avg(moods),
    avgSleepQuality: avg(sleeps),
    daysWithSymptoms,
    flaggedDayNumbers: flaggedDays.map((d) => d.dayNumber),
  }
}
