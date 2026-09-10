// Definición de todas las preguntas del registro diario.
// Todo el contenido vive acá para que el formulario se arme solo
// y sea fácil de ajustar sin tocar los componentes.

export const ANIMO = {
  id: 'animo',
  title: 'Estado de ánimo',
  emoji: '🌈',
  hue: 'magenta',
  questions: [
    { id: 'q1', text: '¿Cómo estuvo tu ánimo general hoy?', minLabel: 'muy mal', maxLabel: 'muy bien' },
    { id: 'q2', text: '¿Cuánta tristeza sentiste hoy?', minLabel: 'nada', maxLabel: 'tristeza muy intensa' },
    { id: 'q3', text: '¿Cuánta ansiedad o preocupación sentiste?', minLabel: 'nada', maxLabel: 'muchísima' },
    { id: 'q4', text: '¿Cuánta irritabilidad o enojo sentiste?', minLabel: 'nada', maxLabel: 'muchísimo' },
    { id: 'q5', text: '¿Cuántas ganas o interés tuviste de hacer cosas que normalmente disfrutás?', minLabel: 'ninguna', maxLabel: 'muchísimas' },
    { id: 'q6', text: '¿Cómo estuvo tu energía?', minLabel: 'sin energía', maxLabel: 'muchísima energía' },
  ],
}

export const ACTIVACION = {
  id: 'activacion',
  title: 'Activación',
  emoji: '⚡',
  hue: 'orange',
  intro: 'Algunos cambios pueden aparecer durante las primeras semanas del tratamiento, por eso preguntamos esto todos los días.',
  questions: [
    { id: 'q7', text: '¿Qué tan inquieta o acelerada te sentiste hoy?', minLabel: 'nada', maxLabel: 'extremadamente inquieta' },
    { id: 'q8', text: '¿Sentiste que te costaba quedarte quieta, o que necesitabas estar moviéndote?', minLabel: 'nada', maxLabel: 'muchísimo' },
    { id: 'q9', text: '¿Qué tan impulsiva te sentiste hoy?', help: 'Por ejemplo: hacer o decir cosas sin pensarlas, como normalmente lo harías.', minLabel: 'nada', maxLabel: 'muchísimo' },
    { id: 'q10', text: '¿Sentiste tus pensamientos más rápidos de lo habitual, o que tu cabeza "no paraba"?', minLabel: 'nada', maxLabel: 'muchísimo' },
  ],
}

export const SUENO = {
  id: 'sueno',
  title: 'Sueño',
  emoji: '🌙',
  hue: 'violet',
  questions: [
    { id: 'q12', text: '¿Qué tan bien dormiste anoche?', minLabel: 'muy mal', maxLabel: 'excelente' },
    { id: 'q13', text: '¿Cuánto sueño o cansancio tuviste durante el día?', minLabel: 'nada', maxLabel: 'sueño extremo' },
    { id: 'q14', text: '¿Te costó dormir, o te despertaste más veces de lo habitual?', minLabel: 'nada', maxLabel: 'muchísimo' },
  ],
}

export const FISICO_META = { id: 'fisico', title: 'Síntomas físicos', emoji: '🩹', hue: 'aqua' }
export const SEGURIDAD_META = { id: 'seguridad', title: 'Seguridad', emoji: '🛡️', hue: null }
export const MEDICACION_META = { id: 'medicacion', title: 'Medicación', emoji: '💊', hue: 'blue' }

export const SINTOMAS_FISICOS = [
  'Náuseas',
  'Dolor de cabeza',
  'Dolor o molestias abdominales',
  'Diarrea',
  'Mareos',
  'Sudoración fuera de lo habitual',
  'Temblor',
  'Rigidez muscular',
  'Inquietud física o necesidad de moverse',
  'Palpitaciones',
  'Sensación de debilidad',
]

export const APETITO = {
  id: 'apetito',
  title: 'Apetito',
  emoji: '🍎',
  hue: 'green',
  questions: [
    { id: 'q15', text: '¿Cómo estuvo tu apetito hoy?', type: 'appetite', labels: { 1: 'muchísimo menos que lo habitual', 5: 'igual que siempre', 10: 'muchísimo más que lo habitual' } },
    { id: 'q16', text: '¿Notaste cambios importantes en cuánto comiste?', type: 'choice', options: ['Mucho menos', 'Algo menos', 'Igual que siempre', 'Algo más', 'Mucho más'] },
  ],
}

export const FUNCIONAMIENTO = {
  id: 'funcionamiento',
  title: 'Cómo fue el día',
  emoji: '☀️',
  hue: 'yellow',
  questions: [
    { id: 'q17', text: '¿Qué tan difícil fue hacer tus actividades normales hoy?', help: 'Por ejemplo: estudiar, ir al colegio, hablar con otras personas, salir, ocuparte de tus cosas.', minLabel: 'nada difícil', maxLabel: 'extremadamente difícil' },
    { id: 'q18', text: '¿Cuánto sentiste ganas de aislarte o evitar a otras personas?', minLabel: 'nada', maxLabel: 'muchísimo' },
    { id: 'q19', text: 'En general, ¿cómo sentís que fue tu día?', minLabel: 'pésimo', maxLabel: 'excelente', extraNote: 'Si querés, contá brevemente qué fue lo mejor o lo peor del día.' },
  ],
}

export const SAFETY_QUESTIONS = [
  {
    id: 'q20',
    text: 'Hoy, ¿tuviste pensamientos como "ojalá no estuviera", "quisiera desaparecer" o "preferiría no despertarme"?',
    options: ['No', 'Sí, alguna vez', 'Sí, varias veces'],
    alertValues: [],
  },
  {
    id: 'q21',
    text: 'Hoy, ¿pensaste en lastimarte o hacerte daño?',
    options: ['No', 'Sí, pero sin intención de hacerlo', 'Sí, y sentí que podría hacerlo'],
    alertValues: ['Sí, y sentí que podría hacerlo'],
  },
  {
    id: 'q22',
    text: '¿Llegaste a pensar concretamente cómo podrías lastimarte o hacerte daño?',
    options: ['No', 'Sí'],
    alertValues: ['Sí'],
  },
  {
    id: 'q23',
    text: '¿Sentís que estás segura en este momento?',
    options: ['Sí', 'No estoy segura', 'No'],
    alertValues: ['No estoy segura', 'No'],
  },
]

export const CRISIS_MESSAGE =
  'Esta respuesta merece atención ahora. Mostrásela a un adulto de confianza que esté con vos y comuníquense con tu profesional o con un servicio de urgencias. No hace falta esperar al próximo control.'

export const MEDICAMENTOS = ['Sertralina', 'Risperidona']
export const MEDICAMENTO_OPCIONES = ['Sí', 'No', 'No recuerdo']

export const ADULTO_ESCALAS = [
  'Somnolencia',
  'Irritabilidad',
  'Inquietud o agitación',
  'Aislamiento',
  'Comunicación e interacción',
  'Energía',
  'Cambios de apetito',
]

export const TRATAMIENTO = {
  sertralina: '50 mg, una vez al día',
  risperidona: '0,25 mg, una vez al día',
  horario: 'Almuerzo',
  duracionDias: 20,
}
