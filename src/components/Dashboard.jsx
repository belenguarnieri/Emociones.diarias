import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getSortedDays } from '../data/storage'

function val(entry, qid) {
  const v = entry?.form?.answers?.[qid]?.value
  return typeof v === 'number' ? v : null
}

function hoursToNumber(str) {
  if (!str) return null
  const h = str.match(/(\d+)\s*h/i)
  const m = str.match(/(\d+)\s*m/i)
  const hours = h ? Number(h[1]) : Number(str) || null
  const mins = m ? Number(m[1]) : 0
  if (hours === null) return null
  return Math.round((hours + mins / 60) * 10) / 10
}

function buildSeries(days) {
  return days.map((d) => ({
    label: `D${d.dayNumber}`,
    animo: val(d, 'q1'),
    tristeza: val(d, 'q2'),
    ansiedad: val(d, 'q3'),
    irritabilidad: val(d, 'q4'),
    inquietud: val(d, 'q7'),
    impulsividad: val(d, 'q9'),
    calidadSueno: val(d, 'q12'),
    horasDormidas: hoursToNumber(d?.form?.hoursSlept),
    somnolencia: val(d, 'q13'),
    energia: val(d, 'q6'),
    interes: val(d, 'q5'),
    funcionamiento: val(d, 'q17'),
    apetito: typeof d?.form?.appetite?.q15?.value === 'number' ? d.form.appetite.q15.value : null,
  }))
}

function ChartBlock({ title, emoji, hue, data, lines }) {
  return (
    <div className={`chart-block chart-block--${hue}`}>
      <h3><span className="chart-block__emoji">{emoji}</span>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(46,42,74,0.1)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} connectNulls dot={{ r: 3 }} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function average(nums) {
  const valid = nums.filter((n) => typeof n === 'number')
  if (!valid.length) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}

export default function Dashboard() {
  const days = getSortedDays()
  const series = buildSeries(days)

  if (!days.length) {
    return <p className="empty-state">Todavía no hay ningún día registrado.</p>
  }

  const first = series[0]
  const lastThree = series.slice(-3)

  const comparisons = [
    { key: 'animo', label: 'Ánimo' },
    { key: 'ansiedad', label: 'Ansiedad' },
    { key: 'tristeza', label: 'Tristeza' },
  ]

  return (
    <div className="dashboard">
      <h2>📈 Evolución — {TREAT_LABEL(days)}</h2>

      <ChartBlock
        title="Ánimo, tristeza y ansiedad"
        emoji="🌈"
        hue="magenta"
        data={series}
        lines={[
          { key: 'animo', name: 'Ánimo', color: '#B23572' },
          { key: 'tristeza', name: 'Tristeza', color: '#6B46A8' },
          { key: 'ansiedad', name: 'Ansiedad', color: '#E8615A' },
        ]}
      />
      <ChartBlock
        title="Irritabilidad, inquietud e impulsividad"
        emoji="⚡"
        hue="orange"
        data={series}
        lines={[
          { key: 'irritabilidad', name: 'Irritabilidad', color: '#E8615A' },
          { key: 'inquietud', name: 'Inquietud', color: '#B5651D' },
          { key: 'impulsividad', name: 'Impulsividad', color: '#6B46A8' },
        ]}
      />
      <ChartBlock
        title="Sueño"
        emoji="🌙"
        hue="violet"
        data={series}
        lines={[
          { key: 'calidadSueno', name: 'Calidad del sueño', color: '#6B46A8' },
          { key: 'horasDormidas', name: 'Horas dormidas', color: '#1D8A82' },
          { key: 'somnolencia', name: 'Somnolencia diurna', color: '#B5651D' },
        ]}
      />
      <ChartBlock
        title="Energía, interés y funcionamiento cotidiano"
        emoji="☀️"
        hue="yellow"
        data={series}
        lines={[
          { key: 'energia', name: 'Energía', color: '#A8830B' },
          { key: 'interes', name: 'Interés / disfrute', color: '#B23572' },
          { key: 'funcionamiento', name: 'Dificultad funcional', color: '#E8615A' },
        ]}
      />
      <ChartBlock
        title="Apetito"
        emoji="🍎"
        hue="green"
        data={series}
        lines={[{ key: 'apetito', name: 'Apetito', color: '#3F8F3A' }]}
      />

      {days.length >= 7 && (
        <div className="comparison">
          <h3>📊 Comparación con el inicio</h3>
          <p className="section-intro">
            Solo se muestran los números. No se sacan conclusiones automáticas.
          </p>
          {comparisons.map((c) => (
            <div key={c.key} className="comparison__row">
              <span>{c.label}</span>
              <span>
                Día 1: {first[c.key] ?? '—'} · Últimos 3 días promedio: {average(lastThree.map((d) => d[c.key])) ?? '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="table-wrap">
        <h3>Tabla de registros</h3>
        <table className="days-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Fecha</th>
              <th>Ánimo</th>
              <th>Ansiedad</th>
              <th>Tristeza</th>
              <th>Sueño</th>
              <th>Energía</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{d.dayNumber}</td>
                <td>{d.date}</td>
                <td>{val(d, 'q1') ?? '—'}</td>
                <td>{val(d, 'q3') ?? '—'}</td>
                <td>{val(d, 'q2') ?? '—'}</td>
                <td>{val(d, 'q12') ?? '—'}</td>
                <td>{val(d, 'q6') ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TREAT_LABEL(days) {
  return `${days.length} día${days.length === 1 ? '' : 's'} registrados`
}
