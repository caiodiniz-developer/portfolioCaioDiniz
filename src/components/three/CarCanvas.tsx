import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import CarModel from './CarModel'
import CarLighting from './CarLighting'

interface CarCanvasProps {
  scrollProgress: React.MutableRefObject<number>
  mousePos:       React.MutableRefObject<{ x: number; y: number }>
  lastScrollTime: React.MutableRefObject<number>
}

export default function CarCanvas({ scrollProgress, mousePos, lastScrollTime }: CarCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 35, position: [4, 1.5, 6], near: 0.1, far: 120 }}
      gl={{
        antialias:           true,
        alpha:               true,
        powerPreference:     'high-performance',
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      shadows="soft"
      dpr={[1, 1.5]}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <CarLighting />
        <CarModel
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          lastScrollTime={lastScrollTime}
        />

        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            luminanceThreshold={0.82}
            luminanceSmoothing={0.4}
            intensity={0.28}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
