# Mi Registro Diario

Registro diario de 20 días para acompañar el inicio de un tratamiento, pensado para
completarse desde el celular en 2 a 4 minutos por día. No diagnostica, no interpreta
resultados y no sugiere cambios de medicación: solo organiza la información para
llevarla al próximo control con el psiquiatra.

**Toda la información queda guardada únicamente en el celular donde se usa** (en el
almacenamiento local del navegador). Nada se envía a ningún servidor. Eso también
significa que si se borra el navegador o se cambia de celular sin exportar los datos,
el registro se pierde — conviene generar el informe en PDF cada tanto como respaldo.

## Qué incluye

- **Hoy**: el cuestionario diario de la adolescente, organizado en secciones plegables
  (ánimo, activación, sueño, síntomas físicos, apetito, funcionamiento, seguridad,
  medicación), con progreso "Día X de 20".
- **Evolución**: gráficos separados por tema y una tabla con todos los días.
- **Adulto**: un espacio aparte para las observaciones del adulto responsable (peso,
  cambios observados, texto libre), sugerido para los días 1, 7, 14 y 20.
- **Informe**: un informe imprimible/exportable a PDF con la estructura pensada para el
  psiquiatra, incluyendo la sección de seguridad destacada sin promediar ni ocultar.

La sección de seguridad se pregunta todos los días. Si aparece una respuesta que
requiere atención, se muestra de inmediato un mensaje pidiendo hablar con un adulto de
confianza y contactar al profesional o a un servicio de urgencias — la aplicación nunca
calcula un puntaje de riesgo ni reemplaza a ese contacto.

## Cómo correrlo en tu computadora

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Cómo subirlo a GitHub

Desde esta carpeta:

```bash
git init
git add .
git commit -m "Primera versión del registro diario"
```

Después creá un repositorio nuevo y **vacío** en GitHub (sin README, sin .gitignore) y
conectalo:

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## Cómo instalarlo como app en el celular (sin App Store)

La app está armada como PWA (Progressive Web App): una vez publicada en una URL con
HTTPS, el celular la puede "instalar" como si fuera una app normal, con ícono propio y
funcionando sin conexión.

1. Entrá a [vercel.com](https://vercel.com) (o [netlify.com](https://netlify.com)) y
   creá una cuenta gratuita con tu usuario de GitHub.
2. Elegí "Import Project" / "Add new site" y seleccioná el repositorio que acabás de
   subir. No hace falta tocar ninguna configuración: Vercel/Netlify detectan que es un
   proyecto Vite automáticamente (comando de build: `npm run build`, carpeta de salida:
   `dist`).
3. Al terminar el deploy te van a dar una URL (algo como
   `tu-proyecto.vercel.app`). Abrila desde el celular de tu hija.
4. En el celular:
   - **Android (Chrome)**: menú (⋮) → "Instalar app" o "Agregar a pantalla de inicio".
   - **iPhone (Safari)**: botón de compartir (□↑) → "Agregar a pantalla de inicio".

Con eso queda un ícono en la pantalla principal que abre la app en pantalla completa,
igual que cualquier otra app instalada.

## Ajustar el tratamiento registrado

Los datos del tratamiento (dosis, horario) están en `src/data/schema.js`, en el objeto
`TRATAMIENTO`, y se muestran en el informe. Si el psiquiatra cambia algo, alcanza con
editar ese archivo y volver a hacer `git push` — Vercel/Netlify actualizan la app sola.

## Recordatorio diario (notificación push)

La app puede mandar una notificación al celular todos los días, sin usar WhatsApp:
funciona con el sistema de notificaciones del propio celular, es gratis, y se configura
una sola vez. Usa el Cron Job gratuito de Vercel (permite disparar algo una vez por día)
más notificaciones push del navegador.

**1. Generar las claves (una sola vez, en tu computadora):**

```bash
npx web-push generate-vapid-keys
```

Va a mostrar una clave pública y una privada. Guardalas, las vas a necesitar en el
paso 3.

**2. Subir el código a GitHub** siguiendo los pasos de más arriba, si todavía no lo
hiciste.

**3. En Vercel, agregar las variables de entorno** (Project Settings → Environment
Variables):

| Variable | Valor |
|---|---|
| `VITE_VAPID_PUBLIC_KEY` | la clave pública del paso 1 |
| `VAPID_PUBLIC_KEY` | la misma clave pública, de nuevo |
| `VAPID_PRIVATE_KEY` | la clave privada del paso 1 |
| `PUSH_SUBSCRIPTION` | se completa en el paso 5 |
| `CRON_SECRET` | opcional: cualquier texto random, para que nadie más pueda disparar el aviso |

Después de guardarlas, hacé un redeploy del proyecto para que tomen efecto.

**4. Instalar la app en el celular** donde se va a usar (ver la sección de arriba),
abrirla, tocar la campanita 🔔 en el encabezado y tocar "Activar recordatorio". El
celular va a pedir permiso para mandar notificaciones — hay que aceptarlo.

Nota para iPhone: las notificaciones push solo funcionan si la app está agregada a la
pantalla de inicio y se abre desde ahí (no desde Safari directamente).

**5. Copiar el código que aparece** después de activarlo, y pegarlo como valor de la
variable `PUSH_SUBSCRIPTION` en Vercel (paso 3). Guardar y hacer otro redeploy.

**6. Listo.** El cron job de Vercel (configurado en `vercel.json`) va a llamar todos los
días a las 19:00 (hora de Argentina) a una función que manda la notificación. Para
cambiar el horario, editá el valor `"schedule"` en `vercel.json` — está en formato cron
y en hora UTC (Argentina es UTC-3, así que restale 3 horas a la hora que quieras).

Como es un solo celular el que recibe el aviso, no hace falta ninguna base de datos:
la suscripción vive en esa única variable de entorno. Si en algún momento cambian de
celular, hay que repetir los pasos 4 y 5 con el celular nuevo.
