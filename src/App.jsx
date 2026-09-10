import { useState } from 'react'
import DailyCheckin from './components/DailyCheckin'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import AdultObservations from './components/AdultObservations'
import Report from './components/Report'
import ReminderSetup from './components/ReminderSetup'
import { todayISO } from './data/storage'

const TABS = [
  { id: 'hoy', label: 'Hoy', icon: '🌈' },
  { id: 'calendario', label: 'Calendario', icon: '🗓️' },
  { id: 'evolucion', label: 'Evolución', icon: '📈' },
  { id: 'adulto', label: 'Adulto', icon: '👤' },
  { id: 'informe', label: 'Informe', icon: '📋' },
]

export default function App() {
  const [tab, setTab] = useState('hoy')
  const [dateISO] = useState(todayISO())
  const [showReminder, setShowReminder] = useState(false)

  return (
    <div className="app">
      <header className="app__header">
        <h1>Mi Registro Diario</h1>
        <button type="button" className="app__bell" onClick={() => setShowReminder(true)} aria-label="Configurar recordatorio">🔔</button>
      </header>

      {showReminder && <ReminderSetup onClose={() => setShowReminder(false)} />}

      <main className="app__main">
        {tab === 'hoy' && <DailyCheckin dateISO={dateISO} />}
        {tab === 'calendario' && <Calendar />}
        {tab === 'evolucion' && <Dashboard />}
        {tab === 'adulto' && <AdultObservations />}
        {tab === 'informe' && <Report />}
      </main>

      <nav className="app__nav no-print">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`app__nav-btn ${tab === t.id ? 'app__nav-btn--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="app__nav-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
