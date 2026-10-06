import { useEffect, useRef, useState } from 'react'
import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders'
import { useLanguageStore } from '@/store/useLanguageStore'

/* The shader behind the site's pill buttons, on its own with the knobs
   exposed. One WebGL context for the whole stage: sliders call setUniforms /
   setSpeed on the live mount instead of rebuilding it. */

const SHAPES = [
  { value: 1, pt: 'Círculo', en: 'Circle' },
  { value: 2, pt: 'Flor', en: 'Daisy' },
  { value: 3, pt: 'Losango', en: 'Diamond' },
  { value: 4, pt: 'Metaballs', en: 'Metaballs' },
]

const DEFAULTS = { repetition: 4, softness: 0.5, distortion: 0.15, speed: 0.8, shape: 1 }

export default function LiquidMetalLab() {
  const en = useLanguageStore(s => s.lang) === 'en'
  const hostRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<ShaderMount | null>(null)
  const [v, setV] = useState(DEFAULTS)

  useEffect(() => {
    if (!hostRef.current) return
    const mount = new ShaderMount(hostRef.current, liquidMetalFragmentShader, {
      u_repetition: DEFAULTS.repetition, u_softness: DEFAULTS.softness,
      u_shiftRed: 0.3, u_shiftBlue: 0.3,
      u_distortion: DEFAULTS.distortion, u_contour: 0.4, u_angle: 45, u_scale: 0.7,
      u_shape: DEFAULTS.shape, u_offsetX: 0, u_offsetY: 0,
      // Sizing: the raw ShaderMount applies no defaults, and without an
      // origin the shape anchors to a corner. Contain-fit, centred.
      u_fit: 1, u_originX: 0.5, u_originY: 0.5, u_rotation: 0, u_worldWidth: 0, u_worldHeight: 0,
    }, undefined, DEFAULTS.speed)
    mountRef.current = mount
    return () => { mount.dispose(); mountRef.current = null }
  }, [])

  useEffect(() => {
    const m = mountRef.current
    if (!m) return
    m.setUniforms({ u_repetition: v.repetition, u_softness: v.softness, u_distortion: v.distortion, u_shape: v.shape })
    m.setSpeed(v.speed)
  }, [v])

  const slider = (key: 'repetition' | 'softness' | 'distortion' | 'speed', label: string, min: number, max: number, step: number) => (
    <label className="lm-ctl">
      <span>{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={v[key]}
        onChange={e => setV(s => ({ ...s, [key]: Number(e.target.value) }))}
      />
    </label>
  )

  return (
    <div className="lm-root">
      <div ref={hostRef} className="lm-canvas" />

      <div className="lm-panel">
        {slider('repetition', en ? 'Stripes' : 'Faixas', 1, 10, 0.5)}
        {slider('softness', en ? 'Softness' : 'Suavidade', 0, 1, 0.05)}
        {slider('distortion', en ? 'Distortion' : 'Distorção', 0, 1, 0.05)}
        {slider('speed', en ? 'Speed' : 'Velocidade', 0, 3, 0.1)}
        <div className="lm-shapes" role="group" aria-label={en ? 'Shape' : 'Forma'}>
          {SHAPES.map(s => (
            <button
              key={s.value}
              onClick={() => setV(x => ({ ...x, shape: s.value }))}
              aria-pressed={v.shape === s.value}
              className={v.shape === s.value ? 'is-on' : ''}
            >
              {en ? s.en : s.pt}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .lm-root { position: absolute; inset: 0; display: flex; flex-direction: column; }
        .lm-canvas { position: relative; flex: 1; min-height: 0; }
        .lm-canvas canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; }
        .lm-panel {
          display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 0.6rem 1.25rem;
          padding: 0.9rem 1.1rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(13,13,13,0.9);
        }
        @media (min-width: 640px) { .lm-panel { grid-template-columns: repeat(4, minmax(0,1fr)); } }
        .lm-ctl { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
        .lm-ctl span { font-size: 0.56rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
        .lm-ctl input { width: 100%; accent-color: #fff; cursor: pointer; }
        .lm-shapes { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .lm-shapes button {
          padding: 0.35rem 0.8rem; border-radius: 999px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.12); background: transparent;
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.55); transition: all 0.18s;
        }
        .lm-shapes button.is-on { background: #fff; color: #0d0d0d; border-color: #fff; }
      `}</style>
    </div>
  )
}
