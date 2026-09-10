import { useState } from 'react'
import { getAllDays, getDay } from '../data/storage'
import { computeDaySummary, computeMonthSummary } from '../data/summary'

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Calendar() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [monthSummary, setMonthSummary] = useState(null)

  const allDays = getAllDays()
  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayISOStr = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  function changeMonth(delta) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    setViewMonth(m)
    setViewYear(y)
    setSelectedDate(null)
    setMonthSummary(null)
  }

  const selectedSummary = selectedDate ? computeDaySummary(getDay(selectedDate)) : null

  function handleMonthSummary() {
    const monthDays = Object.values(allDays).filter((d) => d.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`))
    setMonthSummary(computeMonthSummary(monthDays))
  }

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar">
      <h2>🗓️ Evolución del mes</h2>

      <div className="calendar__nav">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior">‹</button>
        <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente">›</button>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((w, i) => <span key={i}>{w}</span>)}
      </div>

      <div className="calendar__grid">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const iso = toISO(viewYear, viewMonth, d)
          const record = allDays[iso]
          const flagged = record && computeDaySummary(record).safetyFlagged
          const isToday = iso === todayISOStr
          const isSelected = iso === selectedDate
          return (
            <button
              key={i}
              type="button"
              className={`calendar__day ${record ? 'calendar__day--filled' : ''} ${flagged ? 'calendar__day--flagged' : ''} ${isToday ? 'calendar__day--today' : ''} ${isSelected ? 'calendar__day--selected' : ''}`}
              onClick={() => setSelectedDate(iso)}
            >
              {d}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="calendar__summary">
          {selectedSummary ? (
            <>
              <p className="calendar__summary-title">Resumen del día {selectedSummary.dayNumber}</p>
              <p>🌈 Ánimo: {selectedSummary.mood ?? '—'}/10</p>
              <p>⚡ Energía: {selectedSummary.energy ?? '—'}/10</p>
              <p>😴 Sueño: {selectedSummary.sleepQuality ?? '—'}/10{selectedSummary.hoursSlept ? ` · ${selectedSummary.hoursSlept}` : ''}</p>
              <p>🩹 Síntomas físicos: {selectedSummary.symptoms.length ? selectedSummary.symptoms.map((s) => `${s.name} (${s.intensity}/10)`).join(', ') : 'ninguno relevante'}</p>
              <p>💊 Medicación: {selectedSummary.medicationStatus}</p>
              <p className={selectedSummary.safetyFlagged ? 'calendar__safety-alert' : ''}>
                🛡️ Seguridad: {selectedSummary.safetyFlagged ? 'hubo una respuesta que requirió atención ese día' : 'sin alertas'}
              </p>
            </>
          ) : (
            <p>Ese día todavía no tiene registro.</p>
          )}
        </div>
      )}

      <button type="button" className="btn-primary btn-save" onClick={handleMonthSummary}>
        📊 Generar resumen del mes
      </button>

      {monthSummary && (
        <div className="calendar__month-summary">
          <p className="calendar__summary-title">Resumen de {monthSummary.totalDays} días registrados</p>
          <p>🌈 Ánimo promedio: {monthSummary.avgMood ?? '—'}/10</p>
          <p>😴 Sueño promedio: {monthSummary.avgSleepQuality ?? '—'}/10</p>
          <p>🩹 Días con síntomas físicos: {monthSummary.daysWithSymptoms}</p>
          <p className={monthSummary.flaggedDayNumbers.length ? 'calendar__safety-alert' : ''}>
            🛡️ Días con alerta de seguridad: {monthSummary.flaggedDayNumbers.length ? monthSummary.flaggedDayNumbers.join(', ') : 'ninguno'}
          </p>
          <p className="calendar__disclaimer">Estos son solo los datos cargados, sin interpretación clínica.</p>
        </div>
      )}

      {!Object.keys(allDays).length && <p className="empty-state">Todavía no hay ningún día registrado.</p>}
    </div>
  )
}
