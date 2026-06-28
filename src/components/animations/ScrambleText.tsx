import { useState, useRef, useCallback } from 'react'

const SCHARS = '!<>-_\\/[]{}—=+*^?#@$%abcdefghijklmnopqrstuvwxyz0123456789'

export function scrambleWord(
  target: string,
  setWord: (w: string) => void,
  rafRef: React.MutableRefObject<number>,
  speed = 1.6,
) {
  cancelAnimationFrame(rafRef.current)
  let iter = 0
  const chars = [...target]
  function tick() {
    iter += speed
    const out = chars.map((ch, i) => {
      if (ch === ' ') return ' '
      if (i < Math.floor(iter)) return chars[i]
      return SCHARS[Math.floor(Math.random() * SCHARS.length)]
    }).join('')
    setWord(out)
    if (iter < chars.length) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      setWord(target)
    }
  }
  rafRef.current = requestAnimationFrame(tick)
}

export default function ScrambleText({
  text,
  style,
  className,
}: {
  text: string
  style?: React.CSSProperties
  className?: string
}) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef(0)

  const onEnter = useCallback(() => scrambleWord(text, setDisplay, rafRef), [text])
  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setDisplay(text)
  }, [text])

  return (
    <span style={{ cursor: 'default', ...style }} className={className}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {display}
    </span>
  )
}
