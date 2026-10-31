import { useEffect } from 'react'
import { CODE_SET_LABELS, CODE_SETS } from '../statusCodes'
import type { CodeSet } from '../statusCodes'

interface Props {
  codeSet: CodeSet
  onSelectSet: (codeSet: CodeSet) => void
  onSelectCode: (code: number) => void
  onBack: () => void
}

const GROUPS = [
  { label: '1xx — Informational', min: 100, max: 199, accent: 'var(--blue)' },
  { label: '2xx — Success',        min: 200, max: 299, accent: 'var(--green)' },
  { label: '3xx — Redirection',    min: 300, max: 399, accent: 'var(--yellow)' },
  { label: '4xx — Client Error',   min: 400, max: 499, accent: '#f0883e' },
  { label: '5xx — Server Error',   min: 500, max: 599, accent: 'var(--red)' },
  { label: '6xx — Custom / Unofficial', min: 600, max: 699, accent: '#f778ba' },
  { label: '7xx — Custom / Unofficial', min: 700, max: 799, accent: '#bc8cff' },
  { label: '8xx — Custom / Unofficial', min: 800, max: 899, accent: '#d2a8ff' },
  { label: '9xx — Custom / Unofficial', min: 900, max: 999, accent: '#db61a2' },
]

export default function CodesListScreen({ codeSet, onSelectSet, onSelectCode, onBack }: Props) {
  const codesForSet = CODE_SETS[codeSet]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onBack])

  return (
    <div className="cl-screen">
      <div className="cl-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="cl-title">{CODE_SET_LABELS[codeSet]}</h1>
        <div className="cl-tabs" aria-label="HTTP code collection">
          {(Object.keys(CODE_SET_LABELS) as CodeSet[]).map(set => (
            <button
              key={set}
              type="button"
              className={`cl-tab${codeSet === set ? ' cl-tab--active' : ''}`}
              aria-pressed={codeSet === set}
              onClick={() => onSelectSet(set)}
            >
              {CODE_SET_LABELS[set]}
            </button>
          ))}
        </div>
        <p className="cl-subtitle">Click any code to see details</p>
      </div>

      <div className="cl-body">
        {GROUPS.map(group => {
          const codes = codesForSet.filter(c => c.code >= group.min && c.code <= group.max)
          if (codes.length === 0) return null
          return (
            <div key={group.label} className="cl-group">
              <h2 className="cl-group-label" style={{ color: group.accent }}>
                {group.label}
              </h2>
              <div className="cl-cards">
                {codes.map(sc => (
                  <button
                    key={sc.code}
                    className="cl-card"
                    style={{ '--card-accent': group.accent } as React.CSSProperties}
                    onClick={() => onSelectCode(sc.code)}
                  >
                    <span className="cl-card-code">{sc.code}</span>
                    <span className="cl-card-title">{sc.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
