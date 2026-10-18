import { useReducer, useEffect, useRef, useState } from 'react'
import { reducer, initialState } from './state'
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


  // Auto-submit as soon as the typed number matches the current code.
  // Also called manually via Enter key.
  const handleCheck = (overrideValue?: string) => {
    const raw = overrideValue ?? inputValue
    const val = parseInt(raw.trim(), 10)
    if (isNaN(val)) return
    const currentCode = state.codes[state.currentIndex]?.code
    if (val === currentCode) {
      setInputValue('')
      dispatch({ type: 'CHECK', value: val })
    }
    // Wrong answer: nothing happens, input stays so user can correct it
  }

  const handleInputChange = (v: string) => {
    setInputValue(v)
    // Immediately check — all HTTP codes are 3 digits so this fires on the right keystroke
    const val = parseInt(v, 10)
    if (!isNaN(val)) {
      const currentCode = state.codes[state.currentIndex]?.code
      if (val === currentCode) {
        setInputValue('')
        dispatch({ type: 'CHECK', value: val })
      }
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

  const handleStart = (mode: 'common' | 'complete', timerEnabled: boolean, customSeconds?: number) => {
    dispatch({ type: 'START', mode, timerEnabled, customSeconds })
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
        onPlayAgain={() => { setInputValue(''); dispatch({ type: 'START', mode: state.mode }) }}
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
