import { useEffect } from 'react'
import { ALL_CODES } from '../statusCodes'

interface Props {
  code: number
  onBack: () => void
  onSelectCode: (code: number) => void
}

function accentForCode(code: number): string {
  if (code < 200) return 'var(--blue)'
  if (code < 300) return 'var(--green)'
  if (code < 400) return 'var(--yellow)'
  if (code < 500) return '#f0883e'
  return 'var(--red)'
}

export default function CodeDetailScreen({ code, onBack, onSelectCode }: Props) {
  const idx = ALL_CODES.findIndex(c => c.code === code)
  const sc = ALL_CODES[idx]
  const prev = ALL_CODES[idx - 1] ?? null
  const next = ALL_CODES[idx + 1] ?? null
  const accent = accentForCode(code)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
      if (e.key === 'ArrowLeft' && prev) onSelectCode(prev.code)
      if (e.key === 'ArrowRight' && next) onSelectCode(next.code)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onBack, onSelectCode, prev, next])

  if (!sc) return null

  return (
    <div className="cd-screen">
      <div className="cd-header">
        <button className="back-btn" onClick={onBack}>← All codes</button>
        <div className="cd-nav-btns">
          {prev
            ? <button className="cd-nav-btn" onClick={() => onSelectCode(prev.code)}>← {prev.code}</button>
            : <span />
          }
          {next
            ? <button className="cd-nav-btn" onClick={() => onSelectCode(next.code)}>{next.code} →</button>
            : <span />
          }
        </div>
      </div>

      <div className="cd-card">
        <div className="cd-code-badge" style={{ color: accent, borderColor: accent }}>
          {sc.code}
        </div>
        <h1 className="cd-title">{sc.title}</h1>

        <div className="cd-divider" style={{ background: accent }} />

        <div className="cd-section">
          <div className="cd-section-label">What it means</div>
          <p className="cd-section-text">{sc.summary}</p>
        </div>

        <div className="cd-section">
          <div className="cd-section-label">When you'd see it</div>
          <p className="cd-section-text">{sc.example}</p>
        </div>

        <div className="cd-section">
          <div className="cd-section-label">What it's used for</div>
          <p className="cd-section-text">{sc.usedFor}</p>
        </div>
      </div>

      <div className="cd-footer-nav">
        {prev ? (
          <button className="cd-footer-btn" onClick={() => onSelectCode(prev.code)}>
            ← {prev.code} {prev.title}
          </button>
        ) : <span />}
        {next ? (
          <button className="cd-footer-btn" onClick={() => onSelectCode(next.code)}>
            {next.code} {next.title} →
          </button>
        ) : <span />}
      </div>
    </div>
  )
}
