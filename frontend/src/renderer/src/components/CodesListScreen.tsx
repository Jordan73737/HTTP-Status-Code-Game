import { useEffect } from 'react'
import { ALL_CODES } from '../statusCodes'

interface Props {
  onSelectCode: (code: number) => void
  onBack: () => void
}

const GROUPS = [
  { label: '1xx — Informational', min: 100, max: 199, accent: 'var(--blue)' },
  { label: '2xx — Success',        min: 200, max: 299, accent: 'var(--green)' },
  { label: '3xx — Redirection',    min: 300, max: 399, accent: 'var(--yellow)' },
  { label: '4xx — Client Error',   min: 400, max: 499, accent: '#f0883e' },
  { label: '5xx — Server Error',   min: 500, max: 599, accent: 'var(--red)' },
]

export default function CodesListScreen({ onSelectCode, onBack }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onBack])

  return (
    <div className="cl-screen">
      <div className="cl-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="cl-title">HTTP Status Codes</h1>
        <p className="cl-subtitle">Click any code to see details</p>
      </div>

      <div className="cl-body">
        {GROUPS.map(group => {
          const codes = ALL_CODES.filter(c => c.code >= group.min && c.code <= group.max)
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
