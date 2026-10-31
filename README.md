# HTTP Status Code Quiz

A Windows desktop quiz for learning HTTP status codes. The app is built with Electron, React, and TypeScript and runs entirely locally.

## Download

Download the latest Windows installer from the [GitHub Releases page](https://github.com/Jordan73737/HTTP-Status-Code-Game/releases/latest/download/HTTP-Code-Game-Setup.exe). Run the installer to add HTTP Code Game to the Start Menu and create a desktop shortcut.

## How to play

Choose a code set, then answer each prompt before the round timer expires. In the regular quiz, the app shows a status title and you enter its numeric code. In Alternate mode, it shows the code and you enter its title.

Questions are shuffled at the start of each run. The game screen shows the current question, upcoming questions, and a code grid with progress. The **HTTP Codes Revision** screen contains the 63-code Official HTTP Codes set; select a code there to read its meaning, an example, and what it is used for.

## Code sets

| Start-screen choice | Codes | Default timer |
|---|---:|---:|
| Common HTTP Codes | 21 | 60 seconds |
| Official HTTP Codes | 63 | 180 seconds |
| Unofficial HTTP Codes | 33 | 180 seconds |
| All HTTP Codes | 98 | 300 seconds |

Timers are for the entire quiz run, not for each question. You can turn the timer off or set a custom duration when choosing a mode.

### Official HTTP Codes

The app's 63-entry official set, also available in the revision screen.

### Unofficial HTTP Codes

This set contains the vendor-, framework-, proxy-, and custom-specific entries supplied for the project. These codes do not all have one universal meaning; behavior can vary by implementation.

| Range/group | Codes and titles |
|---|---|
| 2xx | `218` This is fine |
| 4xx | `419` Page Expired; `420` Enhance Your Calm; `430` Request Header Fields Too Large; `440` Login Time-out; `444` No Response; `449` Retry With; `450` Blocked by Windows Parental Controls; `460` Client Closed Connection; `463` Too Many Forwarded IP Addresses; `494` Request Header Too Large; `495` SSL Certificate Error; `496` SSL Certificate Required; `497` HTTP Request Sent to HTTPS Port; `498` Invalid Token; `499` Client Closed Request |
| 5xx | `509` Bandwidth Limit Exceeded; `520` Web Server Returned an Unknown Error; `521` Web Server Is Down; `522` Connection Timed Out; `523` Origin Is Unreachable; `524` A Timeout Occurred; `525` SSL Handshake Failed; `526` Invalid SSL Certificate; `527` Railgun Error; `529` Site Is Overloaded; `530` Site Is Frozen; `561` Unauthorized; `598` Network Read Timeout Error; `599` Network Connect Timeout Error |
| Custom/framework examples | `701` Meh; `707` Hacker Detected; `999` Request Denied |

Alternate names are accepted for some entries, including `701` Error Text Found, `499` Required Token, and `999` LinkedIn Request Denial or LinkedIn Request Denial Anti-Scraping.

### All HTTP Codes

Combines the 63 official entries, the 33 entries above, and two additional custom examples: `600` Connection Error and `893` Load Balance Overflow. That makes 98 distinct codes in the current set.

**All HTTP Codes is a curated set, not an exhaustive catalog of every code used on the internet.** Custom and internal status codes have no central registry, and their meanings can depend on the system that defines them.

## Game options

### Hardcore

Hardcore allows one submitted attempt per code. You must press Enter to submit. A wrong answer marks that code red, locks it against retries, and advances to the next unresolved code.

### Hardcore timed

Enable Hardcore and leave the timer on. Hardcore timed defaults to 180 seconds, which you can customize. Hardcore can also be played with the timer disabled.

### Alternate

Alternate mode reverses the question: the app shows the code and you type its title.

- Exact title answers ignore capitalization, spaces, and punctuation.
- Small spelling errors are accepted when submitted with Enter: titles of up to 4 normalized characters allow no typo, titles of 5–9 allow one, and titles of 10 or more allow two.
- An exact answer auto-submits while typing in non-Hardcore mode. A near-match requires Enter. Hardcore answers always require Enter.
- The typo allowance only compares against the current code's title or accepted alternate names.

Hardcore and Alternate can be combined with any code set. Alternate mode's title matching also works for the Unofficial and All HTTP Codes sets.

## Controls

| Key | Action |
|---|---|
| Type a correct number/title | Submit an exact answer automatically in non-Hardcore mode |
| `Enter` | Check an answer; required for Hardcore and typo-tolerant answers |
| `Tab` | Skip the current code |
| `P` | Pause or resume a timed quiz |
| `Space` | Give up and view results |
| `Esc` | Return to the main menu |
| Click a code in the grid | Jump to that code |

In Alternate mode, plain `P` and `Space` are treated as answer text while the answer field is focused. Use `Ctrl+P` to pause/resume and `Ctrl+Space` to give up. While paused, the code grid can still be scrolled; clicking the pause card or using the pause shortcut resumes the quiz and focuses the answer field.

## Timing and results

- The game tracks elapsed time and time spent on each unresolved code.
- The game footer displays elapsed time and, when available, your time to beat.
- Results show your score, time taken, time to beat, and per-code times. Correct answers whose per-code time is at least 1.5× the average correct-answer time are highlighted in yellow (when there are at least two correct answers).
- A personal best is recorded only for a perfect run. Best times are stored locally and kept separately by code set, Hardcore/normal, Alternate/number-entry, and timed/untimed play. Custom timer durations share the same best-time category.

## Run locally

Install [Node.js](https://nodejs.org/) and npm. From the repository root, run:

```sh
cd frontend
npm install
npm run dev
```

Other useful commands, run from `frontend/`:

```sh
npm test
npx tsc --noEmit -p tsconfig.web.json
npm run build
```

Create a Windows installer with:

```sh
npm run package
```

The installer is written to `frontend/dist/HTTP-Code-Game-Setup.exe`.

## Releases

Pushing a version tag matching `v*` starts the Windows release workflow. The workflow builds the installer and attaches it to a GitHub Release. For example, from the repository root:

```sh
git tag v0.1.0
git push origin v0.1.0
```

Use a new version tag for each subsequent release.

## Project structure

```text
frontend/
  src/
    main/                    Electron main process
    preload/                 Restricted renderer bridge
    renderer/
      src/
        components/          Start, game, results, and code-reference screens
        state.ts             Quiz state, modes, and round rules
        statusCodes.ts       Official, unofficial, and custom code data
        timing.ts            Best-time and recall timing helpers
```

## Technology and data

- Electron desktop shell with context isolation enabled
- React and TypeScript renderer built with Vite
- Vitest unit tests
- No server, account, or remote database; best times are stored in browser local storage
- Code sets and their descriptions are bundled with the app

HTTP status-code meanings can differ between standards, products, and deployments. In particular, unofficial and custom codes in the app are examples, not guarantees of universal behavior. For example, `425 Too Early` is used to reject TLS 1.3 early data when replay could be a risk; the status itself does not make an operation idempotent.
