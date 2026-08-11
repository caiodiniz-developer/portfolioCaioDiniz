import { useEffect, useRef } from 'react'
import { useCursorStore } from '@/store/useCursorStore'

/**
 * Custom cursor with:
 * - Inner dot: snaps to exact mouse position
 * - Outer ring: spring-physics follower (velocity + damping)
 * - Magnetic snap: pulls the outer ring toward buttons/links within 70px
 */
export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { state, label } = useCursorStore()

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches
    if (isTouchDevice) return

    document.body.classList.add('cursor-hidden')

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let outerX = mouseX
    let outerY = mouseY
    let velX   = 0
    let velY   = 0
    let rafId: number

    // Spring physics constants — tuned for a snappy, premium feel
    const SPRING  = 0.085
    const DAMPING = 0.72

    // Magnetic attraction radius in px
    const MAGNETIC_RADIUS    = 72
    const MAGNETIC_PULL      = 0.38  // 0 = no pull, 1 = fully snaps to center

    // Updated on every mousemove — cached so animate() doesn't query the DOM
    let magneticDx = 0
    let magneticDy = 0
    let magneticStrength = 0

    function findMagneticTarget(mx: number, my: number) {
      magneticStrength = 0
      const candidates = document.querySelectorAll<HTMLElement>(
        'button, a, [data-magnetic]',
      )
      let closest = MAGNETIC_RADIUS

      candidates.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const cx   = rect.left + rect.width  / 2
        const cy   = rect.top  + rect.height / 2
        const dx   = mx - cx
        const dy   = my - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < closest) {
          closest          = dist
          const t          = 1 - dist / MAGNETIC_RADIUS   // 0 at edge, 1 at center
          magneticStrength = t * MAGNETIC_PULL
          magneticDx       = dx
          magneticDy       = dy
        }
      })
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY

      // Inner dot: instant
      if (innerRef.current) {
        innerRef.current.style.left = `${mouseX}px`
        innerRef.current.style.top  = `${mouseY}px`
      }

      findMagneticTarget(mouseX, mouseY)
    }

    function onMouseDown() {
      if (innerRef.current) innerRef.current.classList.add('clicking')
    }

    function onMouseUp() {
      if (innerRef.current) innerRef.current.classList.remove('clicking')
    }

    function animate() {
      // Target position: mouse minus magnetic pull offset
      const targetX = mouseX - magneticDx * magneticStrength
      const targetY = mouseY - magneticDy * magneticStrength

      // Spring integration
      velX  += (targetX - outerX) * SPRING
      velY  += (targetY - outerY) * SPRING
      velX  *= DAMPING
      velY  *= DAMPING
      outerX += velX
      outerY += velY

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

  const isTouchDevice =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
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
