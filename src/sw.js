import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  let data = { title: 'Mi Registro Diario', body: 'No te olvides de completar tu registro de hoy.' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch {
    // usa el mensaje por defecto si no vino como JSON
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'registro-diario-recordatorio',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsList) => {
      for (const client of clientsList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('./')
    })
  )
})

self.skipWaiting()
self.addEventListener('activate', () => self.clients.claim())
