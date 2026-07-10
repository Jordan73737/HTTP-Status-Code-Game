# HTTP Status Code Quiz

A desktop quiz app for learning HTTP status codes. Built with Electron + React + TypeScript.

You see the status code title (e.g. "Not Found") and have to type the numeric code (e.g. `404`) before the timer runs out. There's a reference table on the right with all the codes — but the numbers are blurred until you guess them, so it's actually a quiz and not just a cheat sheet.

---

## Modes

**Common** — 22 of the most frequently used codes, 15 seconds per code. Good for a quick drill.

**Complete** — all 63 IANA-registered codes, 45 seconds per code. Much harder, great for when you actually want to know all of them.

Both timers are easy to tweak in `frontend/src/renderer/src/state.ts` under `TIME_PER_CODE` once we've done some proper UAT.

---

## Controls

| Key | Action |
|-----|--------|
| Type + auto-match | Submits when what you've typed equals the current code |
| `Enter` | Manual submit |
| `Space` | Skip to next code |
| `Tab` | Give up and see your results |
| `Esc` | Quit |

---

## Stack

- **Electron** — desktop window wrapper
- **Vite + React + TypeScript** — the actual UI
- No backend, no database — everything is static and in-memory per session

---

## Running it locally

You'll need Node.js installed. No Rust, no Python needed to run the quiz.

```bash
cd frontend
npm install
npm run dev
```

To build a Windows installer:

```bash
npm run package
```

---

## Project structure

```
frontend/
  src/
    main/         Electron main process
    preload/      Electron preload (IPC bridge)
    renderer/
      src/
        components/   StartScreen, GameScreen, ResultsScreen
        state.ts      Game logic (reducer)
        statusCodes.ts  All 63 HTTP codes
```

---

## Future ideas

- Web version (the React code is already portable, just needs a build target swap)
- Shuffle mode so codes don't always come in numeric order
- Score history / leaderboard
- Dark/light theme toggle
