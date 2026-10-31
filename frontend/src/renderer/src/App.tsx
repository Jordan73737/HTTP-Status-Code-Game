import { useReducer, useEffect, useRef, useState } from 'react'
import { reducer, initialState } from './state'
import { isTitleMatch } from './statusCodes'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import CodesListScreen from './components/CodesListScreen'
import CodeDetailScreen from './components/CodeDetailScreen'

type InfoView = { screen: 'list' } | { screen: 'detail'; code: number } | null

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [inputValue, setInputValue] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [infoView, setInfoView] = useState<InfoView>(null)

  // Manage timer: start when game begins and pause when requested.
  // Ticks run even without a countdown so we can report elapsed time at the end.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    if (state.screen === 'game' && !state.isPaused) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state.screen, state.isPaused])

  // Alternate mode compares typed text against the title; normal mode compares the typed number against the code.
  const isCorrectAnswer = (raw: string): boolean => {
    const currentCode = state.codes[state.currentIndex]
    if (!currentCode) return false
    if (state.alternate) return isTitleMatch(currentCode, raw)
    const val = parseInt(raw.trim(), 10)
    return !isNaN(val) && val === currentCode.code
  }

  const dispatchCorrect = (raw: string) => {
    const currentCode = state.codes[state.currentIndex]
    if (!currentCode) return
    if (state.alternate) {
      dispatch({ type: 'CHECK_TEXT', value: raw })
    } else {
      dispatch({ type: 'CHECK', value: currentCode.code })
    }
  }

  // Hardcore: nothing is registered until Enter is pressed — wrong there is a single failed attempt.
  // Normal/non-hardcore: also called manually via Enter, but typing already auto-submits correct answers (see handleInputChange).
  const handleCheck = (overrideValue?: string) => {
    const raw = overrideValue ?? inputValue
    if (raw.trim() === '') return
    if (isCorrectAnswer(raw)) {
      setInputValue('')
      dispatchCorrect(raw)
    } else if (state.hardcore) {
      setInputValue('')
      dispatch({ type: 'FAIL' })
    }
    // Non-hardcore wrong answer: nothing happens, input stays so the user can correct it.
  }

  const handleInputChange = (v: string) => {
    setInputValue(v)
    // Hardcore requires an explicit Enter press before an answer is registered — no live auto-check.
    if (state.hardcore) return
    if (isCorrectAnswer(v)) {
      setInputValue('')
      dispatchCorrect(v)
    }
  }

  const handleSkip = () => {
    dispatch({ type: 'SKIP' })
    setInputValue('')
  }

  const handleMenu = () => {
    setInputValue('')
    dispatch({ type: 'RESET' })
  }

  const handleStart = (
    mode: 'common' | 'complete',
    timerEnabled: boolean,
    customSeconds?: number,
    hardcore?: boolean,
    alternate?: boolean,
  ) => {
    dispatch({ type: 'START', mode, timerEnabled, customSeconds, hardcore, alternate })
  }

  const handlePauseToggle = () => {
    dispatch({ type: 'TOGGLE_PAUSE' })
  }

  if (state.screen === 'start') {
    if (infoView?.screen === 'list') {
      return (
        <CodesListScreen
          onSelectCode={code => setInfoView({ screen: 'detail', code })}
          onBack={() => setInfoView(null)}
        />
      )
    }
    if (infoView?.screen === 'detail') {
      return (
        <CodeDetailScreen
          code={infoView.code}
          onBack={() => setInfoView({ screen: 'list' })}
          onSelectCode={code => setInfoView({ screen: 'detail', code })}
        />
      )
    }
    return <StartScreen onStart={handleStart} onViewCodes={() => setInfoView({ screen: 'list' })} />
  }

  if (state.screen === 'results') {
    return (
      <ResultsScreen
        state={state}
        onPlayAgain={() => {
          setInputValue('')
          dispatch({
            type: 'START',
            mode: state.mode,
            hardcore: state.hardcore,
            alternate: state.alternate,
            timerEnabled: state.timerEnabled,
            customSeconds: state.timerEnabled ? state.timeLimit : undefined,
          })
        }}
        onMenu={handleMenu}
      />
    )
  }

  return (
    <GameScreen
      state={state}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onCheck={handleCheck}
      onSkip={handleSkip}
      onGiveUp={() => dispatch({ type: 'GIVE_UP' })}
      onJumpTo={code => dispatch({ type: 'JUMP_TO', code })}
      onTogglePause={handlePauseToggle}
      onMenu={handleMenu}
    />
  )
}
