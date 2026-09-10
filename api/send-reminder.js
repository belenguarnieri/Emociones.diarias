import webpush from 'web-push'

export default async function handler(req, res) {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTION, CRON_SECRET } = process.env

  if (CRON_SECRET && req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !PUSH_SUBSCRIPTION) {
    res.status(500).json({ error: 'Faltan variables de entorno (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY o PUSH_SUBSCRIPTION)' })
    return
  }

  webpush.setVapidDetails('mailto:no-reply@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  let subscription
  try {
    subscription = JSON.parse(PUSH_SUBSCRIPTION)
  } catch {
    res.status(500).json({ error: 'PUSH_SUBSCRIPTION no es un JSON válido' })
    return
  }

  const payload = JSON.stringify({
    title: 'Mi Registro Diario',
    body: 'No te olvides de completar tu registro de hoy 🌈',
  })

  try {
    await webpush.sendNotification(subscription, payload)
    res.status(200).json({ sent: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
