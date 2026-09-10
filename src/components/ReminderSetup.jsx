import { useEffect, useState } from 'react'
import { pushSupported, subscribeToPush, getExistingSubscription } from '../data/push'

export default function ReminderSetup({ onClose }) {
  const [status, setStatus] = useState('checking')
  const [subscriptionText, setSubscriptionText] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!pushSupported()) {
      setStatus('unsupported')
      return
    }
    getExistingSubscription().then((sub) => {
      if (sub) {
        setSubscriptionText(JSON.stringify(sub))
        setStatus('active')
      } else {
        setStatus('inactive')
      }
    })
  }, [])

  async function activate() {
    setError('')
    setStatus('requesting')
    try {
      const sub = await subscribeToPush()
      setSubscriptionText(JSON.stringify(sub))
      setStatus('active')
    } catch (e) {
      setError(e.message)
      setStatus('inactive')
    }
  }

  function copy() {
    navigator.clipboard.writeText(subscriptionText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="reminder-overlay">
      <div className="reminder-card">
        <p className="reminder-card__title">🔔 Recordatorio diario</p>

        {status === 'unsupported' && (
          <p>Este navegador no soporta notificaciones. En iPhone, primero agregá la app a la pantalla de inicio y abrila desde ahí.</p>
        )}

        {status === 'checking' && <p>Revisando…</p>}

        {(status === 'inactive' || status === 'requesting') && (
          <>
            <p>Activá esto una sola vez desde el celular donde se va a usar la app, para que llegue un aviso todos los días a la hora que configuren.</p>
            <button type="button" className="btn-primary btn-save" onClick={activate} disabled={status === 'requesting'}>
              {status === 'requesting' ? 'Activando…' : 'Activar recordatorio'}
            </button>
            {error && <p className="reminder-card__error">{error}</p>}
          </>
        )}

        {status === 'active' && (
          <>
            <p>Recordatorio activado en este celular. Copiá este código y pegalo una sola vez como variable de entorno <code>PUSH_SUBSCRIPTION</code> en Vercel (está el paso a paso en el README).</p>
            <textarea readOnly rows={4} value={subscriptionText} className="reminder-card__code" />
            <button type="button" className="btn-primary btn-save" onClick={copy}>
              {copied ? 'Copiado' : 'Copiar código'}
            </button>
          </>
        )}

        <button type="button" className="reminder-card__close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
