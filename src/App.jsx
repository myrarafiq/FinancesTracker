import { useMemo, useState } from 'react'
import {
  SAMPLE_EXPENSES,
  PRESETS,
  analyzeExpenses,
  formatMoney,
  formatMoneyExact,
} from './analyze'
import './App.css'

function DonutChart({ slices, total }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <svg className="donut" viewBox="0 0 180 180" role="img" aria-label="Spending by category">
      <g transform="rotate(-90 90 90)">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1e9dd" strokeWidth="22" />
        {slices.map((slice) => {
          const length = (slice.total / total) * circumference
          const circle = (
            <circle
              key={slice.id}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="22"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += length
          return circle
        })}
      </g>
      <circle cx="90" cy="90" r="48" fill="#fffdf8" />
      <text
        x="90"
        y="86"
        textAnchor="middle"
        fill="#1c1612"
        fontSize="16"
        fontFamily="Fraunces, Georgia, serif"
      >
        {formatMoney(total)}
      </text>
      <text
        x="90"
        y="104"
        textAnchor="middle"
        fill="#6d6258"
        fontSize="9"
        fontFamily="Outfit, sans-serif"
      >
        total spent
      </text>
    </svg>
  )
}

export default function App() {
  const [input, setInput] = useState(SAMPLE_EXPENSES)
  const [activePreset, setActivePreset] = useState('default')
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('landing')
  const [analysis, setAnalysis] = useState(null)
  const [editing, setEditing] = useState(false)
  const [cutCategory, setCutCategory] = useState('')
  const [cutPercent, setCutPercent] = useState(20)

  const selectedCategory = useMemo(() => {
    if (!analysis) return null
    return analysis.ranked.find((c) => c.id === cutCategory) || analysis.ranked[0]
  }, [analysis, cutCategory])

  const savings = selectedCategory
    ? selectedCategory.total * (cutPercent / 100)
    : 0

  function runAnalysis(text) {
    const result = analyzeExpenses(text)
    if (!result) {
      setError('We need at least one valid expense to judge you.')
      setPhase('landing')
      return
    }
    setError('')
    setAnalysis(result)
    setCutCategory(result.ranked[0].id)
    setCutPercent(20)
    setEditing(false)
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAnalyze() {
    setPhase('judging')
    window.setTimeout(() => runAnalysis(input), 700)
  }

  function handleReset() {
    setInput(SAMPLE_EXPENSES)
    setActivePreset('default')
    setAnalysis(null)
    setError('')
    setEditing(false)
    setPhase('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (phase === 'judging') {
    return (
      <div className="judging">
        <div>
          <p className="eyebrow">Hold on</p>
          <h2 className="dots">Judging your decisions</h2>
          <p className="whisper">Crunching receipts, sipping tea, raising one eyebrow.</p>
        </div>
      </div>
    )
  }

  if (phase !== 'results' || !analysis) {
    return (
      <main className="app">
        <section className="landing">
          <div className="landing-card">
            <p className="eyebrow">Personal finance, but make it chaotic</p>
            <h1 className="title">Where Did My Money Go?! 💸</h1>
            <p className="subtitle">
              Enter your recent expenses and let us judge your financial decisions.
            </p>
            {error && <p className="error">{error}</p>}
            <textarea
              className="textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setActivePreset('')
              }}
              aria-label="Expense list"
              placeholder={'$8 coffee\n$14 lunch\n$6 subway'}
            />
            <p className="format-hint">One expense per line — amount plus a short description.</p>
            <div className="presets">
              {[
                ['default', 'Sample week'],
                ['caffeine', 'Coffee-fueled'],
                ['responsible', 'Adulting'],
                ['menace', 'Financial menace'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`chip ${activePreset === key ? 'active' : ''}`}
                  onClick={() => {
                    setInput(PRESETS[key])
                    setActivePreset(key)
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="cta-row">
              <button className="btn btn-primary" onClick={handleAnalyze} type="button">
                Analyze My Spending →
              </button>
              <p className="whisper">Don’t worry, we’re not judging. Probably.</p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const { ranked, total, personalityScores } = analysis
  const maxCategory = ranked[0].total

  return (
    <main className="app">
      <section className="results wrap">
        <div className="topbar">
          <div>
            <p className="eyebrow">The verdict is in</p>
            <h1>Where Did My Money Go?! 💸</h1>
          </div>
          <div className="cta-row">
            <button className="btn btn-ghost" type="button" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Hide editor' : 'Edit expenses'}
            </button>
            <button className="btn btn-primary" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {editing && (
          <div className="edit-box">
            <textarea
              className="textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Edit expenses"
            />
            <div className="cta-row" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" type="button" onClick={handleAnalyze}>
                Re-analyze →
              </button>
            </div>
          </div>
        )}

        <div className="stats">
          <article className="stat">
            <div className="label">Total Spent</div>
            <div className="value">{formatMoney(analysis.total)}</div>
          </article>
          <article className="stat">
            <div className="label">Number of Purchases</div>
            <div className="value">{analysis.count}</div>
          </article>
          <article className="stat">
            <div className="label">Average Purchase</div>
            <div className="value">{formatMoneyExact(analysis.average)}</div>
          </article>
          <article className="stat">
            <div className="label">Biggest Expense</div>
            <div className="value">{formatMoney(analysis.biggest.amount)}</div>
            <div className="hint">
              {analysis.biggest.category.emoji} {analysis.biggest.description}
            </div>
          </article>
        </div>

        <section className="card" style={{ marginBottom: 14 }}>
          <h2>Spending Breakdown</h2>
          <div className="charts">
            <div className="donut-wrap">
              <DonutChart slices={ranked} total={total} />
              <div className="legend">
                {ranked.map((slice) => (
                  <div className="legend-item" key={slice.id}>
                    <span className="swatch" style={{ background: slice.color }} />
                    <span>
                      {slice.emoji} {slice.label}
                    </span>
                    <strong>{formatMoney(slice.total)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="bars">
              {ranked.map((slice) => (
                <div className="bar-row" key={slice.id}>
                  <div className="bar-meta">
                    <span>
                      {slice.emoji} {slice.label}
                    </span>
                    <span>{formatMoney(slice.total)}</span>
                  </div>
                  <div className="track">
                    <div
                      className="fill"
                      style={{
                        width: `${(slice.total / maxCategory) * 100}%`,
                        background: slice.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid-2">
          <section className="card">
            <h2>Your Financial Personality</h2>
            <div className="personality-grid">
              {[
                ['responsible', '🟢 Responsible', '#2f7a56'],
                ['treat', '🟡 Treat Yourself', '#d08912'],
                ['questionable', '🔴 Financially Questionable', '#b4233a'],
              ].map(([key, label, color]) => (
                <div className="p-row" key={key}>
                  <div className="p-label">{label}</div>
                  <div className="p-track">
                    <div
                      className="p-fill"
                      style={{ width: `${personalityScores[key]}%`, background: color }}
                    />
                  </div>
                  <strong>{personalityScores[key]}%</strong>
                </div>
              ))}
            </div>
            <div className="identity">
              <h3>{analysis.personality.name}</h3>
              <p className="whisper">{analysis.personality.blurb}</p>
            </div>
          </section>

          <section className="card">
            <h2>Your Financial Score</h2>
            <div className="score-hero">
              <div className="score-number">
                {analysis.score}
                <span> / 100</span>
              </div>
              <p className="whisper">{analysis.scoreBlurb}</p>
            </div>
          </section>
        </div>

        <section className="card" style={{ marginBottom: 14 }}>
          <h2>Your Financial Roast 🔥</h2>
          <p className="roast">{analysis.roast}</p>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <h2>Things We Noticed 👀</h2>
          <div className="insights">
            {analysis.insights.map((insight) => (
              <div className="insight" key={insight}>
                {insight}
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginBottom: 14 }}>
          <h2>Every Questionable Decision</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th className="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                {analysis.expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>
                      <span className="cat-pill">
                        {expense.category.emoji} {expense.category.label}
                      </span>
                    </td>
                    <td className="amount">{formatMoneyExact(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2>What If You Cut Back?</h2>
          <div className="whatif-controls">
            <label>
              Category
              <select
                value={selectedCategory?.id || ''}
                onChange={(e) => setCutCategory(e.target.value)}
              >
                {ranked.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reduce by {cutPercent}%
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={cutPercent}
                onChange={(e) => setCutPercent(Number(e.target.value))}
              />
            </label>
          </div>
          {selectedCategory && (
            <>
              <p className="whisper" style={{ marginBottom: 14 }}>
                What if I reduced {selectedCategory.label} by {cutPercent}%?
              </p>
              <div className="whatif-stats">
                <div className="mini">
                  <span>Current spending</span>
                  <strong>{formatMoneyExact(selectedCategory.total)}</strong>
                </div>
                <div className="mini">
                  <span>Potential savings</span>
                  <strong>{formatMoneyExact(savings)}</strong>
                </div>
                <div className="mini">
                  <span>New spending</span>
                  <strong>{formatMoneyExact(selectedCategory.total - savings)}</strong>
                </div>
              </div>
              <div className="save-banner">You could save {formatMoneyExact(savings)}</div>
            </>
          )}
        </section>
      </section>
    </main>
  )
}
