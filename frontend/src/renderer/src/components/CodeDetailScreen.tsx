import { useEffect } from 'react'
import { CODE_SET_LABELS } from '../statusCodes'
import type { CodeSet, StatusCode } from '../statusCodes'

interface Props {
  code: number
  codeSet: CodeSet
  codes: StatusCode[]
  onBack: () => void
  onSelectCode: (code: number) => void
}

function accentForCode(code: number): string {
  if (code < 200) return 'var(--blue)'
  if (code < 300) return 'var(--green)'
  if (code < 400) return 'var(--yellow)'
  if (code < 500) return '#f0883e'
  if (code < 600) return 'var(--red)'
  if (code < 700) return '#f778ba'
  if (code < 800) return '#bc8cff'
  if (code < 900) return '#d2a8ff'
  return '#db61a2'
}

export default function CodeDetailScreen({ code, codeSet, codes, onBack, onSelectCode }: Props) {
  const idx = codes.findIndex(c => c.code === code)
  const sc = codes[idx]
  const prev = codes[idx - 1] ?? null
  const next = codes[idx + 1] ?? null
  const accent = accentForCode(code)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
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
        <button className="back-btn" onClick={onBack}>← {CODE_SET_LABELS[codeSet]}</button>
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
