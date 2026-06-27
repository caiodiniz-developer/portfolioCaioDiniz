import { useEffect, useRef } from 'react'
import { useCursorStore } from '@/store/useCursorStore'
import { lerp } from '@/lib/utils'

export default function CustomCursor() {
  const outerRef  = useRef<HTMLDivElement>(null)
  const innerRef  = useRef<HTMLDivElement>(null)
  const { state, label } = useCursorStore()

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    document.body.classList.add('cursor-hidden')

    let mouseX  = window.innerWidth  / 2
    let mouseY  = window.innerHeight / 2
    let outerX  = mouseX
    let outerY  = mouseY
    let rafId: number
    let isDown  = false

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY

      if (innerRef.current) {
        innerRef.current.style.left = `${mouseX}px`
        innerRef.current.style.top  = `${mouseY}px`
      }
    }

    function onMouseDown() {
      isDown = true
      if (innerRef.current) innerRef.current.classList.add('clicking')
    }

    function onMouseUp() {
      isDown = false
      if (innerRef.current) innerRef.current.classList.remove('clicking')
    }

    function animate() {
      outerX = lerp(outerX, mouseX, 0.1)
      outerY = lerp(outerY, mouseY, 0.1)

      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`
        outerRef.current.style.top  = `${outerY}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',   onMouseUp)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('cursor-hidden')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  if (isTouchDevice) return null

  return (
    <>
      <div
        ref={outerRef}
        className={`custom-cursor-outer state-${state}`}
        style={{ willChange: 'left, top' }}
      >
        {label && <span className="custom-cursor-text">{label}</span>}
      </div>
      <div
        ref={innerRef}
        className="custom-cursor-inner"
        style={{ willChange: 'left, top' }}
      />
    </>
  )
}
