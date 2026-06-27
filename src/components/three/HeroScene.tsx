import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { Group } from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useWindowSize } from '@/hooks/useWindowSize'
import { lerp } from '@/lib/utils'
import {
  GlassSphere,
  GlassCube,
  ChromeSphere,
  FloatingRing,
  IcosahedronShape,
} from './FloatingObjects'

function SceneObjects() {
  const groupRef = useRef<Group>(null)
  const mouse = useMousePosition()
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const currentRotX = useRef(0)
  const currentRotY = useRef(0)
  const { size } = useThree()
  const isMobile = size.width < 768

  useFrame(() => {
    if (!groupRef.current) return

    targetRotX.current = mouse.normalizedY * 0.08
    targetRotY.current = mouse.normalizedX * 0.12

    currentRotX.current = lerp(currentRotX.current, targetRotX.current, 0.05)
    currentRotY.current = lerp(currentRotY.current, targetRotY.current, 0.05)

    groupRef.current.rotation.x = currentRotX.current
    groupRef.current.rotation.y = currentRotY.current
  })

  if (isMobile) {
    return (
      <group ref={groupRef}>
        <GlassSphere position={[0, 0, 0]} scale={1.2} />
        <FloatingRing position={[0, 0, -1]} scale={0.8} />
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <GlassSphere position={[0.5, 0.2, 0]} scale={1.4} color="#9333ea" />
      <GlassCube position={[-2.2, 0.8, -1.5]} scale={0.6} />
      <ChromeSphere position={[2.5, -0.5, -2]} scale={0.5} />
      <FloatingRing position={[-1.8, -0.8, -0.5]} scale={0.9} />
      <IcosahedronShape position={[2.2, 1.2, -1]} scale={0.55} />
      <GlassSphere position={[-2.8, -0.2, -2.5]} scale={0.45} color="#a855f7" />
    </group>
  )
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={0.6}
        mipmapBlur
      />
    </EffectComposer>
  )
}

interface HeroSceneProps {
  className?: string
}

export default function HeroScene({ className }: HeroSceneProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#a855f7" />
          <pointLight position={[-3, 3, 2]} intensity={0.5} color="#9333ea" />
          <SceneObjects />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  )
}
