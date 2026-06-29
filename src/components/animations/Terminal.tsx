import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { SITE } from '@/lib/constants'

interface Line { type: 'input' | 'output' | 'error' | 'success' | 'dim'; text: string }

/* ── Snake constants ── */
const SK_COLS = 30
const SK_ROWS = 18
const SK_CELL = 16

const PROMPT = 'dev@portfolio:~$ '
const VERSION = '2.5.0'

/* ── Static content ── */
const HELP = `
Commands:
  joke            Random programming joke
  fortune         Dev wisdom quote
  coffee          Essential developer fuel
  matrix          Enter the Matrix
  hack            Initiate hack sequence
  vim             How to exit vim
  git log         Legendary commit history
  git status      The eternal truth
  git blame       Find the culprit
  npm install     Install everything
  fibonacci <n>   Print Fibonacci sequence
  hello           Hello, World!
  snake           Jogar Snake 🐍
  rubber          Rubber duck debugging
  stackoverflow   Open Stack Overflow
  tabs            The eternal debate
  42              The answer to everything
  sleep           Developer needs sleep
  debug           The debugging process
  ls              List site sections
  cd <page>       Navigate (home, about, projects, services, contact)
  repo            Open GitHub
  ping            Test connection
  date            Current time
  sudo <cmd>      Try it
  clear           Clear terminal
  exit            Close terminal
`.trim()

const JOKES = [
  `Why do programmers prefer dark mode?\n  Because light attracts bugs.`,
  `A SQL query walks into a bar, sees two tables and asks:\n  "Can I JOIN you?"`,
  `There are 10 types of people in the world:\n  those who understand binary, and those who don't.`,
  `Why do Java developers wear glasses?\n  Because they don't C#.`,
  `A programmer's wife says: "Go buy milk, and if they have eggs, get a dozen."\n  He comes back with 12 milks.`,
  `99 little bugs in the code...\n  99 little bugs.\n  Take one down, patch it around...\n  127 bugs in the code.`,
  `The best thing about a boolean:\n  even if you're wrong, you're only off by a bit.`,
  `How do you comfort a JavaScript developer?\n  You console them.`,
  `Why was the JS developer sad?\n  Because he didn't Node how to Express himself.`,
  `Debugging: removing the needles from a haystack.\n  Programming: building a haystack out of needles.`,
  `A QA engineer walks into a bar and orders:\n  0 beers. 1 beer. 999999 beers. -1 beer. null beers. asdfjkl beers.`,
  `What did the README say to the developer?\n  RTFM.`,
  `It's not a bug, it's an undocumented feature.`,
  `Have you tried turning it off and on again?`,
  `Why did the developer go broke?\n  Because he used up all his cache.`,
  `// TODO: write a better comment\n// FIXME: everything\n// HACK: this shouldn't work but it does`,
  `Q: How do you generate a random string?\n  A: Put a first-year CS student in front of vim and ask them to exit.`,
  `A byte walks into a bar, looking a bit off.\n  The bartender asks: "What's wrong?"\n  The byte replies: "I think I've lost a bit."`,
]

const FORTUNES = [
  `"Any fool can write code that a computer can understand.\n Good programmers write code that humans can understand."\n — Martin Fowler`,
  `"First, solve the problem. Then, write the code."\n — John Johnson`,
  `"Code is like humor. When you have to explain it, it's bad."\n — Cory House`,
  `"Make it work, make it right, make it fast."\n — Kent Beck`,
  `"The best code is no code at all."\n — Jeff Atwood`,
  `"Always code as if the guy maintaining your code\n will be a violent psychopath who knows where you live."\n — John Woods`,
  `"Programs must be written for people to read,\n and only incidentally for machines to execute."\n — Harold Abelson`,
  `"Premature optimization is the root of all evil."\n — Donald Knuth`,
  `"Weeks of coding can save you hours of planning."\n — Unknown`,
  `"It works on my machine."\n — Every developer, ever`,
  `"The most disastrous thing that you can ever learn is your first programming language."\n — Alan Kay`,
  `"When in doubt, use brute force."\n — Ken Thompson`,
  `"Talk is cheap. Show me the code."\n — Linus Torvalds`,
  `"Simplicity is prerequisite for reliability."\n — Dijkstra`,
]

const COFFEE = `
     ( (
      ) )
   ._______.
   |  ☕   |]
   \\       /
    \`-----'

   Brewing...
   Done. Productivity +200%. Let's ship.`.trim()

const MATRIX_FRAMES = [
  'Wake up, dev...',
  '01001000 01100101 01101100 01101100 01101111',
  '01010111 01101111 01110010 01101100 01100100',
  '10110100 01101111 11101110 11101110 11111111',
  '                                             ',
  '"The Matrix is everywhere. It is all around us."',
  '"You take the red pill... you stay in Wonderland."',
  '                                             ',
  '// You just fell down the rabbit hole.',
]

const HACK_FRAMES = [
  'Initializing sequence...',
  'Bypassing firewall...    [████░░░░░░] 40%',
  'Injecting payload...     [███████░░░] 70%',
  'Accessing mainframe...   [██████████] 100%',
  '',
  'ACCESS GRANTED.',
  '',
  'Just kidding. This is just a portfolio :)',
]

const GIT_LOG = `
commit a1b2c3d (HEAD -> main, origin/main)
Author: Developer <dev@localhost>
Date:   just now

    fix: finally fixed that one bug

commit d4e5f6a
Author: Developer <dev@localhost>
Date:   2 hours ago

    feat: it works now (don't ask how)

commit 789abcd
Author: Developer <dev@localhost>
Date:   yesterday

    fix: revert "fix: actually fixed it"

commit 456defg
Author: Developer <dev@localhost>
Date:   3 days ago

    fix: actually fixed it

commit 123ghij
Author: Developer <dev@localhost>
Date:   last week

    initial commit (everything is broken)`.trim()

const GIT_STATUS = `
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)

        modified:   src/components/MysteriousFile.tsx
        modified:   src/utils/thisWorkedYesterday.ts
        modified:   src/pages/WhyIsThisNotWorking.tsx

Untracked files:
        temp_fix_DELETE_THIS.js
        copy_of_index_FINAL_v3_ACTUAL_FINAL.tsx
        debug_REMOVE_BEFORE_PUSH.log

  "why did I change this"
   — git blame, probably`.trim()

const DEBUG_FLOW = `
Debugging flowchart:
  1. Does it work?
       Yes → don't touch it
       No  → continue

  2. Did it ever work?
       No  → you're on your own
       Yes → what changed?

  3. Did you try console.log()?
       No  → do that first
       Yes → add more console.logs

  4. Stack Overflow has the answer.
       (so does ChatGPT, but don't tell anyone)

  5. Walk away. Make coffee.
     The bug will reveal itself.`.trim()

const VIM = `
To exit vim:
  :q          quit (if no changes)
  :q!         quit without saving (PANIC MODE)
  :wq         save and quit
  :x          save and quit (shorter)
  ZZ          save and quit (for the elite)
  :qa!        quit ALL (nuclear option)

  Or just close the terminal.
  We don't judge.`.trim()

const RUBBER = `
Rubber Duck Debugging™:

  1. Get a rubber duck (or a stuffed animal, a plant, your cat...)
  2. Explain your code to it. Out loud. Every line.
  3. The duck will not answer.
  4. You will find the bug yourself.

  Works 9/10 times.
  The remaining 1/10: the duck was right all along.`.trim()

const SLEEP = `
Developer sleep schedule:
  22:00  "Just one more feature..."
  23:30  "One more bug to fix..."
  01:00  "Almost done..."
  02:45  "Wait, why does this work now?"
  03:00  git commit -m "idk but it works"
  03:01  git push
  03:02  *passes out on keyboard*
  09:00  git log --oneline
         "What did I do last night"`.trim()

const HELLO = `
Hello, World!

  Console.log("Hello, World!")  // JavaScript
  print("Hello, World!")        # Python
  System.out.println("...");    // Java (imports sold separately)
  printf("Hello, World!");      // C — the OG
  cout << "Hello, World!";      // C++
  echo "Hello, World!";         // PHP (don't judge)
  puts "Hello, World!"          # Ruby

Every journey starts with Hello, World.`.trim()

const TABS_SPACES = `
The eternal debate:

  TABS                    SPACES
  ────                    ──────
  One keystroke           Multiple keystrokes
  Configurable width      Consistent everywhere
  True alignment          "Alignment"
  Vim default             PEP 8 said so
  Character saves disk    Python 3 needs you

  Current score:
    Tabs:   ████████░░  (GitHub says: it depends)
    Spaces: ████████░░

  The correct answer: .editorconfig`.trim()

const PAGES: Record<string, string> = {
  home: '/', sobre: '/about', about: '/about',
  projects: '/projects', projetos: '/projects',
  contact: '/contact', contato: '/contact',
  services: '/services', servicos: '/services',
}

function fibonacci(n: number): string {
  if (n < 1 || n > 20) return 'Usage: fibonacci <n>  (1–20)'
  const seq: number[] = [0, 1]
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2])
  return seq.slice(0, n).join(', ')
}

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

/* ─────────────────────────────────── Component ─────────────────────────────────── */
export default function Terminal() {
  const [open,    setOpen]    = useState(false)
  const [input,   setInput]   = useState('')
  const [lines,   setLines]   = useState<Line[]>([
    { type: 'success', text: `Portfolio Terminal v${VERSION}` },
    { type: 'dim',     text: 'Type "help" to see available commands.' },
    { type: 'output',  text: '' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [snakeMode, setSnakeMode] = useState(false)
  const inputRef   = useRef<HTMLInputElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const snakeRef   = useRef<HTMLCanvasElement>(null)
  const navigate   = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape' && open)   { setOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  /* ── Snake game ── */
  useEffect(() => {
    if (!snakeMode) return
    const canvas = snakeRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    interface Pos { x: number; y: number }
    let snake: Pos[] = [{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }]
    let dir: Pos = { x: 1, y: 0 }, nextDir: Pos = { x: 1, y: 0 }
    let food: Pos = { x: 5, y: 5 }
    let score = 0, alive = true
    let tid: ReturnType<typeof setInterval>

    function place() {
      let p: Pos
      do { p = { x: Math.floor(Math.random() * SK_COLS), y: Math.floor(Math.random() * SK_ROWS) } }
      while (snake.some(s => s.x === p.x && s.y === p.y))
      food = p
    }

    function draw() {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, SK_COLS * SK_CELL, SK_ROWS * SK_CELL)
      ctx.strokeStyle = 'rgba(80,250,123,0.04)'; ctx.lineWidth = 0.5
      for (let x = 0; x <= SK_COLS; x++) { ctx.beginPath(); ctx.moveTo(x * SK_CELL, 0); ctx.lineTo(x * SK_CELL, SK_ROWS * SK_CELL); ctx.stroke() }
      for (let y = 0; y <= SK_ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * SK_CELL); ctx.lineTo(SK_COLS * SK_CELL, y * SK_CELL); ctx.stroke() }
      ctx.fillStyle = '#f87171'; ctx.shadowBlur = 10; ctx.shadowColor = '#f87171'
      ctx.fillRect(food.x * SK_CELL + 3, food.y * SK_CELL + 3, SK_CELL - 6, SK_CELL - 6)
      snake.forEach((s, i) => {
        const a = 1 - (i / snake.length) * 0.6
        ctx.fillStyle = `rgba(80,250,123,${a})`; ctx.shadowBlur = i === 0 ? 14 : 3; ctx.shadowColor = '#50fa7b'
        ctx.fillRect(s.x * SK_CELL + 1, s.y * SK_CELL + 1, SK_CELL - 2, SK_CELL - 2)
      })
      ctx.shadowBlur = 0; ctx.font = '11px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(80,250,123,0.55)'
      ctx.textAlign = 'left'; ctx.fillText(`SCORE ${score}`, 8, 16)
      ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.textAlign = 'right'
      ctx.fillText('Q = sair', SK_COLS * SK_CELL - 8, 16); ctx.textAlign = 'left'
      if (!alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, SK_COLS * SK_CELL, SK_ROWS * SK_CELL)
        ctx.font = 'bold 22px "JetBrains Mono",monospace'; ctx.fillStyle = '#f87171'; ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', SK_COLS * SK_CELL / 2, SK_ROWS * SK_CELL / 2 - 16)
        ctx.font = '12px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.fillText(`Score: ${score}`, SK_COLS * SK_CELL / 2, SK_ROWS * SK_CELL / 2 + 8)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillText('R = reiniciar · Q = sair', SK_COLS * SK_CELL / 2, SK_ROWS * SK_CELL / 2 + 30)
        ctx.textAlign = 'left'
      }
    }

    function restart() {
      clearInterval(tid); snake = [{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }]
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 }; score = 0; alive = true
      place(); draw(); tid = setInterval(tick, 115)
    }

    function tick() {
      if (!alive) return
      dir = nextDir
      const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
      if (h.x < 0 || h.x >= SK_COLS || h.y < 0 || h.y >= SK_ROWS || snake.some(s => s.x === h.x && s.y === h.y)) {
        alive = false; draw(); return
      }
      snake.unshift(h)
      if (h.x === food.x && h.y === food.y) { score++; place() } else snake.pop()
      draw()
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        clearInterval(tid)
        setLines(prev => [...prev, { type: 'output', text: `Snake encerrado · Score: ${score}` }])
        setSnakeMode(false)
        return
      }
      if (!alive && (e.key === 'r' || e.key === 'R')) { restart(); return }
      const m: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = m[e.key]
      if (nd && (nd.x + dir.x !== 0 || nd.y + dir.y !== 0)) { nextDir = nd; e.preventDefault() }
    }

    place(); draw(); tid = setInterval(tick, 115)
    window.addEventListener('keydown', onKey)
    return () => { clearInterval(tid); window.removeEventListener('keydown', onKey) }
  }, [snakeMode])

  const push = useCallback((l: Line | Line[]) =>
    setLines(prev => [...prev, ...(Array.isArray(l) ? l : [l])]), [])

  function typeLines(items: { text: string; type?: Line['type']; delay?: number }[]) {
    items.forEach(({ text, type = 'output', delay = 0 }) =>
      setTimeout(() => push({ type, text }), delay))
  }

  function run(cmd: string) {
    const raw = cmd.trim()
    if (!raw) return
    push({ type: 'input', text: PROMPT + raw })
    setHistory(h => [raw, ...h.slice(0, 49)])
    setHistIdx(-1)

    const parts = raw.toLowerCase().split(' ')
    const verb  = parts[0]
    const arg1  = parts[1] ?? ''
    const rest  = parts.slice(1).join(' ')

    /* git sub-commands */
    if (verb === 'git') {
      switch (arg1) {
        case 'log':    push({ type: 'output',  text: GIT_LOG });    break
        case 'status': push({ type: 'output',  text: GIT_STATUS }); break
        case 'blame':  push({ type: 'error',   text: 'git blame: it was you. It was always you.' }); break
        case 'push':   push({ type: 'success', text: 'Everything: pushed to production.\nFingers: crossed.' }); break
        case 'pull':   push({ type: 'success', text: 'Already up to date. (Sure it is.)' }); break
        case 'commit':
          typeLines([
            { text: '[main a1b2c3] ' + (rest.replace('-m', '').replace(/"/g, '').trim() || 'wip'), type: 'success' },
            { text: '1 file changed, ??? insertions(+), ??? deletions(-)', delay: 200 },
          ])
          break
        default:
          push({ type: 'error', text: `git: '${arg1}' is not a git command. Try: log, status, blame, push, pull` })
      }
      return
    }

    /* npm sub-commands */
    if (verb === 'npm') {
      if (arg1 === 'install' || arg1 === 'i') {
        typeLines([
          { text: 'npm warn deprecated existential-crisis@1.0.0',  type: 'error',   delay: 0   },
          { text: 'npm warn deprecated sanity@0.0.1',               type: 'error',   delay: 300 },
          { text: 'added 743 packages in 12s',                       type: 'success', delay: 900 },
          { text: '286 packages are looking for funding',            type: 'dim',     delay: 1000 },
          { text: '  run `npm fund` to find out more',               type: 'dim',     delay: 1050 },
          { text: '',                                                                  delay: 1100 },
          { text: 'found 0 vulnerabilities (this time)',             type: 'success', delay: 1150 },
        ])
      } else if (arg1 === 'run' && rest.includes('build')) {
        typeLines([
          { text: 'Building for production...', delay: 0 },
          { text: '✓ 2004 modules transformed.', type: 'success', delay: 800 },
          { text: '✓ built in 4.82s', type: 'success', delay: 1000 },
        ])
      } else {
        push({ type: 'error', text: `npm: unknown command "${arg1}". Try: install, run build` })
      }
      return
    }

    switch (verb) {
      case 'help':
        push({ type: 'output', text: HELP })
        break

      case 'joke':
        push({ type: 'success', text: rand(JOKES) })
        break

      case 'fortune':
        push({ type: 'output', text: rand(FORTUNES) })
        break

      case 'coffee':
        push({ type: 'success', text: COFFEE })
        break

      case 'matrix':
        typeLines(MATRIX_FRAMES.map((text, i) => ({
          text,
          type: (text.startsWith('"') ? 'success' : text.startsWith('//') ? 'dim' : 'output') as Line['type'],
          delay: i * 320,
        })))
        break

      case 'hack':
        typeLines(HACK_FRAMES.map((text, i) => ({
          text,
          type: (text.includes('ACCESS') ? 'success' : text.includes('kidding') ? 'dim' : 'output') as Line['type'],
          delay: i * 380,
        })))
        break

      case 'vim':
        push({ type: 'output', text: VIM })
        break

      case 'debug':
        push({ type: 'output', text: DEBUG_FLOW })
        break

      case 'rubber':
        push({ type: 'output', text: RUBBER })
        break

      case 'sleep':
        push({ type: 'output', text: SLEEP })
        break

      case 'hello': case 'hello,': case 'hi':
        push({ type: 'success', text: HELLO })
        break

      case 'tabs': case 'spaces':
        push({ type: 'output', text: TABS_SPACES })
        break

      case '42':
        push({ type: 'success', text: '42 — The answer to life, the universe and everything.\n(We asked the computer. It took 7.5 million years.)' })
        break

      case 'fibonacci': case 'fib': {
        const n = parseInt(arg1)
        push({ type: isNaN(n) ? 'error' : 'output', text: fibonacci(isNaN(n) ? 0 : n) })
        break
      }

      case 'stackoverflow': case 'so':
        push({ type: 'success', text: '→ Opening Stack Overflow...\n  (Saving your life since 2008)' })
        setTimeout(() => window.open('https://stackoverflow.com', '_blank'), 500)
        break

      case 'repo': case 'github': case 'gh':
        push({ type: 'success', text: `→ Opening ${SITE.github}` })
        setTimeout(() => window.open(SITE.github, '_blank'), 400)
        break

      case 'ls': case 'dir':
        push([
          { type: 'output', text: 'drwxr-xr-x  home/       projects/   services/' },
          { type: 'output', text: 'drwxr-xr-x  about/      contact/' },
        ])
        break

      case 'cd':
        if (!arg1) { push({ type: 'error', text: 'cd: missing argument' }); break }
        if (PAGES[arg1]) {
          push({ type: 'success', text: `→ Navigating to /${arg1}...` })
          setTimeout(() => { navigate(PAGES[arg1]); setOpen(false) }, 600)
        } else {
          push({ type: 'error', text: `cd: ${arg1}: not found. Options: home, about, projects, services, contact` })
        }
        break

      case 'date': case 'time':
        push({ type: 'output', text: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'full', timeStyle: 'medium' }) })
        break

      case 'ping':
        push([
          { type: 'output',  text: 'PING caiodiniz.dev' },
          { type: 'success', text: '64 bytes: time=0.42ms' },
          { type: 'success', text: '64 bytes: time=0.38ms' },
          { type: 'success', text: '64 bytes: time=0.40ms' },
          { type: 'output',  text: '--- min/avg/max = 0.38/0.40/0.42 ms ---' },
        ])
        break

      case 'sudo':
        if (!rest) { push({ type: 'error', text: 'sudo: permission denied.' }); break }
        if (rest.includes('rm -rf')) {
          typeLines([
            { text: 'Deleting everything...', type: 'error', delay: 0 },
            { text: 'Removing node_modules... (this actually does take forever)', type: 'error', delay: 700 },
            { text: 'Just kidding. Not running that.', type: 'success', delay: 1500 },
          ])
        } else {
          push({ type: 'error', text: `[sudo] password for dev: \nSorry, try again.\nSorry, try again.\n${rest}: command not found (not that it matters)` })
        }
        break

      case 'pwd':
        push({ type: 'output', text: '/caiodiniz.dev' })
        break

      case 'echo':
        push({ type: 'output', text: rest || '' })
        break

      case 'man':
        if (!rest) { push({ type: 'error', text: 'What manual page do you want?' }); break }
        push({ type: 'dim', text: `No manual entry for "${rest}".\nHave you tried Stack Overflow?` })
        break

      case 'open':
        if (!rest) { push({ type: 'error', text: 'open: missing URL' }); break }
        push({ type: 'success', text: `→ Opening ${rest}` })
        setTimeout(() => window.open(rest.startsWith('http') ? rest : `https://${rest}`, '_blank'), 400)
        break

      case 'clear': case 'cls':
        setLines([{ type: 'dim', text: '' }])
        break

      case 'exit': case 'quit': case 'q':
        push({ type: 'dim', text: 'Closing terminal...' })
        setTimeout(() => setOpen(false), 400)
        break

      case 'snake':
        push({ type: 'success', text: 'Iniciando Snake 🐍\n↑↓←→ ou WASD para mover · R reiniciar · Q sair' })
        setTimeout(() => setSnakeMode(true), 450)
        break

      /* funny wrong inputs */
      case ':q': case ':q!': case ':wq':
        push({ type: 'dim', text: "This isn't vim. But thanks for trying." })
        break

      case 'python': case 'python3':
        push({ type: 'output', text: `Python 3.12.0 (main)\nType "help" to get a joke instead.\n>>> ` })
        break

      case 'node':
        push({ type: 'output', text: `Welcome to Node.js v20.0.0.\nType ".exit" to exit the REPL.\n> ` })
        break

      default:
        push({ type: 'error', text: `command not found: ${raw}. Type "help" for the list.` })
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter')     { run(input); setInput(''); return }
    if (e.key === 'ArrowUp')   { e.preventDefault(); const i = Math.min(histIdx + 1, history.length - 1); setHistIdx(i); setInput(history[i] ?? '') }
    if (e.key === 'ArrowDown') { e.preventDefault(); const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? '' : history[i] ?? '') }
    if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = ['help','joke','fortune','coffee','matrix','hack','vim','git log','git status','git blame','npm install','fibonacci','hello','rubber','stackoverflow','tabs','42','sleep','debug','ls','cd','repo','ping','date','sudo','snake','clear','exit']
      const match = cmds.find(c => c.startsWith(input) && c !== input)
      if (match) setInput(match)
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      title="Open Terminal (Ctrl+`)"
      style={{
        position: 'fixed',
        bottom: 'clamp(12px,3vw,24px)',
        left:   'clamp(12px,3vw,24px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px 8px 12px',
        borderRadius: 999,
        background: 'rgba(8,8,10,0.92)',
        border: '1px solid rgba(80,250,123,0.35)',
        color: '#50fa7b',
        fontFamily: '"JetBrains Mono","Fira Code",monospace',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
        cursor: 'pointer',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 0 20px rgba(80,250,123,0.14), inset 0 0 20px rgba(80,250,123,0.04)',
        transition: 'all 0.25s',
        userSelect: 'none',
        animation: 'termBtnPulse 3s ease-in-out infinite',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(80,250,123,0.7)'
        el.style.boxShadow   = '0 0 28px rgba(80,250,123,0.28), inset 0 0 28px rgba(80,250,123,0.08)'
        el.style.color       = '#a5ffb8'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(80,250,123,0.35)'
        el.style.boxShadow   = '0 0 20px rgba(80,250,123,0.14), inset 0 0 20px rgba(80,250,123,0.04)'
        el.style.color       = '#50fa7b'
      }}
    >
      <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{'>'}_</span>
      <span style={{ opacity: 0.75 }}>terminal</span>
      <style>{`
        @keyframes termBtnPulse {
          0%,100% { box-shadow: 0 0 20px rgba(80,250,123,0.14), inset 0 0 20px rgba(80,250,123,0.04); }
          50%      { box-shadow: 0 0 30px rgba(80,250,123,0.22), inset 0 0 24px rgba(80,250,123,0.07); }
        }
      `}</style>
    </button>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '0 0 24px 24px', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)', pointerEvents: 'auto' }}
        onClick={() => setOpen(false)} />

      <div style={{ position: 'relative', zIndex: 1, width: 'min(620px, calc(100vw - 48px))', height: 'min(440px, 68vh)', background: 'rgba(8,8,10,0.97)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px', boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', fontFamily: '"JetBrains Mono","Fira Code","Courier New",monospace', fontSize: '0.78rem', overflow: 'hidden', pointerEvents: 'auto', animation: 'terminalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>

        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', display: 'inline-block', cursor: 'pointer' }} onClick={() => setOpen(false)} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>
            terminal — v{VERSION}
          </span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
            <X size={13} />
          </button>
        </div>

        {/* Snake mode */}
        {snakeMode && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#0a0a0a', padding: '12px' }}>
            <canvas ref={snakeRef} width={SK_COLS * SK_CELL} height={SK_ROWS * SK_CELL}
              style={{ border: '1px solid rgba(80,250,123,0.15)', borderRadius: 6, display: 'block', maxWidth: '100%', height: 'auto' }} />
            <p style={{ margin: 0, color: 'rgba(80,250,123,0.3)', fontSize: '0.6rem', letterSpacing: '0.06em', fontFamily: 'inherit' }}>
              WASD · SETAS  ·  R reiniciar  ·  Q sair
            </p>
          </div>
        )}

        {/* Output */}
        {!snakeMode && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 1 }} className="hide-scrollbar">
            {lines.map((l, i) => (
              <pre key={i} style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.65',
                color: l.type === 'input'   ? 'rgba(255,255,255,0.92)'
                     : l.type === 'error'   ? '#ff6b6b'
                     : l.type === 'success' ? '#50fa7b'
                     : l.type === 'dim'     ? 'rgba(255,255,255,0.2)'
                     : 'rgba(255,255,255,0.5)' }}>
                {l.text}
              </pre>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        {!snakeMode && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <span style={{ color: '#50fa7b', flexShrink: 0, userSelect: 'none' }}>{PROMPT}</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit', fontSize: 'inherit', caretColor: '#50fa7b' }}
              spellCheck={false} autoComplete="off" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes terminalIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
