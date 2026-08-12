import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.76, 0, 0.24, 1]

const CODE_L = [
  'import React, { useState } from "react"',
  'export default function App() {',
  '  return <RouterProvider router={router} />',
  '}',
  'type Stack = "React" | "TypeScript" | "Node.js"',
  'interface Project { id: number; title: string }',
  'const caio: Dev = { name: "Caio Diniz" }',
  'git commit -m "feat: portfolio v2026"',
  'npm run build && vercel deploy --prod',
  'const E = [0.16, 1, 0.3, 1]',
  'pnpm install && pnpm dev',
  'npx tsc --noEmit  // 0 errors ✓',
]

const CODE_R = [
  'import { motion } from "framer-motion"',
  'const animate = { type: "spring", stiffness: 220 }',
  'tailwind.config.js successfully configured',
  'supabase db push && vercel deploy',
  'framer-motion v11.x loaded',
  'git push origin main',
  'npm install framer-motion gsap lenis',
  'const portfolio = new Portfolio()',
  'type Dev = { name: string; city: string }',
  'git commit -m "cinematic ui ✨"',
  'vite build  // dist/ ready',
  'lighthouse score: 100/100/100/100',
]

function CodeColumn({ lines, align }: { lines: string[]; align: 'left' | 'right' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        animate={{ y: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      >
        {[...lines, ...lines].map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: '"JetBrains Mono","Courier New",monospace',
              fontSize: '0.48rem',
              lineHeight: '2.6',
              whiteSpace: 'nowrap',
              color: 'rgba(255,255,255,0.038)',
              padding: align === 'left' ? '0 1rem 0 1.5rem' : '0 1.5rem 0 1rem',
              textAlign: align,
            }}
          >
            {line}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'hold' | 'exit'>('hold')

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setPhase('exit')
      setTimeout(() => {
        document.documentElement.style.overflow = ''
        onDone()
      }, 950)
    }, 2400)
    return () => { clearTimeout(t); document.documentElement.style.overflow = '' }
  }, [onDone])

  const spring = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1.15 }
  const isExit = phase === 'exit'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', background: '#0d0d0d', overflow: 'hidden' }}
        animate={{ x: isExit ? '-100%' : '0%' }}
        transition={spring}
      >
        <CodeColumn lines={CODE_L} align="left" />

        {/* Name: spans full viewport, panel clips right half */}
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '200%', transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.h1
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem,7.2vw,8rem)', letterSpacing: '-0.065em', color: '#fff', margin: 0, lineHeight: 1, userSelect: 'none', display: 'block' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.18 }}
            >
              CAIO DINIZ
            </motion.h1>
          </div>
          <motion.p
            style={{ fontFamily: 'monospace', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.2)', margin: '0.85rem 0 0', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
          >
            Full Stack Developer · Campinas, SP
          </motion.p>
        </div>

        {/* Top-left label */}
        <motion.span
          style={{ position: 'absolute', top: '2rem', left: '2rem', fontFamily: 'monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)' }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          PORTFOLIO
        </motion.span>

        {/* Bottom-left */}
        <motion.div
          style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          <motion.span
            style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '0.4rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
            LOADING
          </span>
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        style={{ position: 'absolute', top: 0, left: '50%', right: 0, bottom: 0, background: '#0d0d0d', overflow: 'hidden' }}
        animate={{ x: isExit ? '100%' : '0%' }}
        transition={spring}
      >
        <CodeColumn lines={CODE_R} align="right" />

        {/* Name: spans full viewport (right: 0, width: 200%), panel clips left half */}
        <div style={{ position: 'absolute', top: '50%', right: 0, width: '200%', transform: 'translateY(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.h1
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem,7.2vw,8rem)', letterSpacing: '-0.065em', color: '#fff', margin: 0, lineHeight: 1, userSelect: 'none', display: 'block' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: E, delay: 0.18 }}
            >
              CAIO DINIZ
            </motion.h1>
          </div>
          <motion.p
            style={{ fontFamily: 'monospace', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.2)', margin: '0.85rem 0 0', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
          >
            Full Stack Developer · Campinas, SP
          </motion.p>
        </div>

        {/* Top-right label */}
        <motion.span
          style={{ position: 'absolute', top: '2rem', right: '2rem', fontFamily: 'monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)', textAlign: 'right' }}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          2026
        </motion.span>

        {/* Bottom-right */}
        <motion.span
          style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontFamily: 'monospace', fontSize: '0.4rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)', textAlign: 'right' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          REACT · TYPESCRIPT · NODE.JS
        </motion.span>
      </motion.div>

      {/* ── Seam line ── */}
      <motion.div
        style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,255,255,0.06)', transform: 'translateX(-0.5px)', pointerEvents: 'none' }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 0.7, ease: E, delay: 0.12 }}
      />

      {/* ── Progress bar (spans both panels) ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)', zIndex: 10, pointerEvents: 'none' }}>
        <motion.div
          style={{ height: '100%', background: 'rgba(255,255,255,0.16)', transformOrigin: 'center' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.2, ease: [0.25, 0, 0.45, 1], delay: 0.2 }}
        />
      </div>
    </div>
  )
}
