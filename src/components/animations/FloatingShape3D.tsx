import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SIZE = 156

const STEPS: { at: number; side: 'right' | 'left' }[] = [
  { at: 0.00, side: 'right' },
  { at: 0.14, side: 'left'  },
  { at: 0.30, side: 'right' },
  { at: 0.46, side: 'left'  },
  { at: 0.62, side: 'right' },
  { at: 0.78, side: 'left'  },
]

export default function FloatingShape3D() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 1100px), (hover: none)').matches) return
    if (!wrapRef.current || !canvasRef.current) return

    const wrap   = wrapRef.current
    const canvas = canvasRef.current

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(SIZE, SIZE)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100)
    camera.position.z = 3.6

    const geo = new THREE.IcosahedronGeometry(1, 1)

    const solidMat = new THREE.MeshPhongMaterial({
      color:     0x0a0a0a,
      emissive:  0x040404,
      specular:  0xffffff,
      shininess: 320,
    })
    const solid = new THREE.Mesh(geo, solidMat)

    const edgesGeo = new THREE.EdgesGeometry(geo)
    const edgesMat = new THREE.LineBasicMaterial({
      color:       0xffffff,
      transparent: true,
      opacity:     0.24,
    })
    const edges = new THREE.LineSegments(edgesGeo, edgesMat)

    scene.add(new THREE.AmbientLight(0xffffff, 0.12))
    const key = new THREE.PointLight(0xffffff, 6, 16)
    key.position.set(2.5, 2.5, 3)
    const fill = new THREE.PointLight(0x4466ff, 2.5, 10)
    fill.position.set(-2.5, -1.5, -2)
    scene.add(key, fill, solid, edges)

    /* ── Mouse parallax ── */
    let mX = 0, mY = 0, cX = 0, cY = 0
    function onMouse(e: MouseEvent) {
      mX = (e.clientX / window.innerWidth  - 0.5) * 2
      mY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    /* ── Render loop ── */
    let autoY = 0, raf: number
    function tick() {
      raf = requestAnimationFrame(tick)
      autoY += 0.0055
      cX += (-mY * 0.3 - cX) * 0.055
      cY += ( mX * 0.3 - cY) * 0.055
      solid.rotation.y = autoY + cY
      solid.rotation.x = cX
      edges.rotation.copy(solid.rotation)
      renderer.render(scene, camera)
    }
    tick()

    /* ── GSAP positioning ── */
    const rX = () => window.innerWidth - SIZE - 28
    const lX = () => 28

    gsap.set(wrap, { x: rX(), y: -SIZE / 2, opacity: 0 })
    gsap.to(wrap, { opacity: 1, duration: 1.4, delay: 2.4, ease: 'power2.out' })

    const floatTween = gsap.to(wrap, {
      y: -SIZE / 2 - 16,
      repeat: -1,
      yoyo: true,
      duration: 3.4,
      ease: 'sine.inOut',
    })

    /* ── Side switching on scroll ── */
    let activeSide: 'right' | 'left' = 'right'
    const scrollST = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate(self) {
        const p = self.progress
        let next: 'right' | 'left' = 'right'
        for (let i = STEPS.length - 1; i >= 0; i--) {
          if (p >= STEPS[i].at) { next = STEPS[i].side; break }
        }
        if (next !== activeSide) {
          activeSide = next
          gsap.to(wrap, { x: next === 'right' ? rX() : lX(), duration: 0.9, ease: 'power2.inOut' })
        }
      },
    })

    /* ── Light-section detection (white bg sections → dark shape) ──
       When the shape floats over a light-background section it switches
       from mix-blend-mode:screen (white edges on dark) to multiply
       (dark edges on white) so it remains visible. */
    function enterLight() {
      edgesMat.color.setHex(0x111111)
      edgesMat.opacity = 0.45
      solidMat.color.setHex(0x1a1a1a)
      solidMat.specular.setHex(0x000000)
      key.color.setHex(0x000000)
      wrap.style.mixBlendMode = 'multiply'
    }
    function leaveLight() {
      edgesMat.color.setHex(0xffffff)
      edgesMat.opacity = 0.24
      solidMat.color.setHex(0x0a0a0a)
      solidMat.specular.setHex(0xffffff)
      key.color.setHex(0xffffff)
      wrap.style.mixBlendMode = 'screen'
    }

    const lightEls = document.querySelectorAll('[data-bg="light"]')
    const lightSTs = Array.from(lightEls).map((el) =>
      ScrollTrigger.create({
        trigger:    el,
        /* Shape lives at 50vh — so activate when section covers that point */
        start:      'top 65%',
        end:        'bottom 35%',
        onEnter:     enterLight,
        onLeave:     leaveLight,
        onEnterBack: enterLight,
        onLeaveBack: leaveLight,
      })
    )

    /* ── Resize ── */
    function onResize() {
      gsap.set(wrap, { x: activeSide === 'right' ? rX() : lX() })
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      floatTween.kill()
      scrollST.kill()
      lightSTs.forEach((t) => t.kill())
      renderer.dispose()
      geo.dispose();     solidMat.dispose()
      edgesGeo.dispose(); edgesMat.dispose()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position:      'fixed',
        top:           '50vh',
        left:          0,
        width:         SIZE,
        height:        SIZE,
        zIndex:        15,
        pointerEvents: 'none',
        opacity:       0,
        mixBlendMode:  'screen',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: SIZE, height: SIZE }}
      />
    </div>
  )
}
