import { useEffect, useRef, useState } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'

/* Scroll as the video's playhead. Progress is how far this stage has
   travelled through the viewport (0 as it enters at the bottom, 1 as it
   leaves at the top), mapped to a frame. Two details keep it smooth:
   the clip is encoded with every frame as a keyframe, and currentTime is
   only written when the target *frame* changes — scroll fires far more
   often than the clip has frames, and a redundant seek is wasted decoding. */

const FPS = 24
const SRC = '/lab/scrub.mp4'

export default function ScrollScrubLab() {
  const en = useLanguageStore(s => s.lang) === 'en'
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [frameLabel, setFrameLabel] = useState('000 / 000')

  useEffect(() => {
    const root = rootRef.current, video = videoRef.current
    if (!root || !video) return
    let lastFrame = -1
    let raf = 0

    const update = () => {
      raf = 0
      if (!video.duration) return
      const rect = root.getBoundingClientRect()
      const span = window.innerHeight + rect.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span))
      const total = Math.max(1, Math.floor(video.duration * FPS) - 1)
      const frame = Math.round(progress * total)
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      if (frame === lastFrame) return
      lastFrame = frame
      video.currentTime = frame / FPS
      setFrameLabel(`${String(frame).padStart(3, '0')} / ${String(total).padStart(3, '0')}`)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }

    video.addEventListener('loadedmetadata', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    schedule()
    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', schedule)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <video
        ref={videoRef}
        src={SRC}
        muted
        playsInline
        preload="auto"
        aria-label={en ? 'Clip scrubbed by page scroll' : 'Vídeo controlado pela rolagem da página'}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <span
        style={{
          position: 'absolute', top: 12, left: 12, padding: '0.3rem 0.6rem', borderRadius: 6,
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          fontFamily: '"JetBrains Mono","Fira Code",ui-monospace,monospace', fontSize: '0.62rem', letterSpacing: '0.06em',
        }}
      >
        {en ? 'frame' : 'quadro'} {frameLabel}
      </span>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.15)' }}>
        <div ref={barRef} style={{ height: '100%', background: '#fff', transformOrigin: 'left', transform: 'scaleX(0)' }} />
      </div>
    </div>
  )
}
