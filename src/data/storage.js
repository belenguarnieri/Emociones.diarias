// Todo el registro vive en el localStorage del navegador/teléfono.
// No se envía a ningún servidor. Cada día se guarda con su fecha real,
// así que un día sin completar simplemente no existe: nunca se inventa
// ni se rellena con ceros.

const KEY_DAYS = 'registro_dias_v1'
const KEY_ADULT = 'registro_adulto_v1'
const KEY_START = 'registro_fecha_inicio_v1'
const KEY_TREATMENT = 'registro_tratamiento_v1'

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getStartDate() {
  let start = localStorage.getItem(KEY_START)
  if (!start) {
    start = todayISO()
    localStorage.setItem(KEY_START, start)
  }
  return start
}

export function setStartDate(dateISO) {
  localStorage.setItem(KEY_START, dateISO)
}

export function dayNumberForDate(dateISO) {
  const start = getStartDate()
  const diff = Math.round((new Date(dateISO) - new Date(start)) / 86400000)
  return diff + 1
}

export function getAllDays() {
  return readJSON(KEY_DAYS, {})
}

export function getDay(dateISO) {
  const days = getAllDays()
  return days[dateISO] || null
}

export function saveDay(dateISO, data) {
  const days = getAllDays()
  const existing = days[dateISO]
  const now = new Date().toISOString()
  const record = {
    ...data,
    date: dateISO,
    dayNumber: dayNumberForDate(dateISO),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    editHistory: existing ? [...(existing.editHistory || []), { editedAt: now }] : [],
  }
  days[dateISO] = record
  writeJSON(KEY_DAYS, days)
  return record
}

export function getSortedDays() {
  return Object.values(getAllDays()).sort((a, b) => a.date.localeCompare(b.date))
}

export function getAdultObservations() {
  return readJSON(KEY_ADULT, {})
}

export function saveAdultObservation(dayNumber, data) {
  const obs = getAdultObservations()
  const now = new Date().toISOString()
  obs[dayNumber] = { ...data, dayNumber, savedAt: now }
  writeJSON(KEY_ADULT, obs)
  return obs[dayNumber]
}

export function getSortedAdultObservations() {
  return Object.values(getAdultObservations()).sort((a, b) => a.dayNumber - b.dayNumber)
}

export function getTreatmentInfo() {
  return readJSON(KEY_TREATMENT, {
    sertralina: '50 mg, una vez al día',
    risperidona: '0,25 mg, una vez al día',
    horario: 'Almuerzo',
  })
}

export function saveTreatmentInfo(info) {
  writeJSON(KEY_TREATMENT, info)
}

export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    startDate: getStartDate(),
    treatment: getTreatmentInfo(),
    days: getAllDays(),
    adultObservations: getAdultObservations(),
  }
}
