import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'
import { lerp } from '@/lib/utils'

interface FloatProps {
  children: React.ReactNode
  speed?: number
  amplitude?: number
  rotationSpeed?: number
  offset?: number
}

function FloatWrapper({ children, speed = 1, amplitude = 0.3, rotationSpeed = 0.3, offset = 0 }: FloatProps) {
  const ref = useRef<Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.y = Math.sin(t) * amplitude
    ref.current.rotation.y = t * rotationSpeed * 0.3
  })

  return <group ref={ref}>{children}</group>
}

export function GlassSphere({ position, scale = 1, color = '#9333ea' }: {
  position: [number, number, number]
  scale?: number
  color?: string
}) {
  return (
    <FloatWrapper speed={0.4} amplitude={0.2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.85}
          roughness={0.05}
          metalness={0}
          ior={1.5}
          thickness={2}
          envMapIntensity={2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </FloatWrapper>
  )
}

export function GlassCube({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <FloatWrapper speed={0.3} amplitude={0.25} rotationSpeed={0.5} offset={1.2}>
      <mesh position={position} scale={scale} rotation={[0.4, 0.5, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#a855f7"
          transmission={0.8}
          roughness={0.1}
          metalness={0.1}
          ior={1.4}
          thickness={1}
          envMapIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </FloatWrapper>
  )
}

export function ChromeSphere({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.2
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.15
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#888"
        metalness={1}
        roughness={0.05}
        envMapIntensity={3}
      />
    </mesh>
  )
}

export function FloatingRing({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.3
    ref.current.rotation.z = state.clock.elapsedTime * 0.2
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + 2) * 0.2
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.25, 32, 64]} />
      <meshPhysicalMaterial
        color="#9333ea"
        transmission={0.7}
        roughness={0.05}
        metalness={0.2}
        ior={1.6}
        thickness={0.5}
        envMapIntensity={2}
        transparent
        opacity={0.75}
        wireframe={false}
      />
    </mesh>
  )
}

export function IcosahedronShape({ position, scale = 1 }: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <FloatWrapper speed={0.35} amplitude={0.18} rotationSpeed={0.4} offset={2.5}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#c084fc"
          transmission={0.6}
          roughness={0.15}
          metalness={0.3}
          envMapIntensity={1.5}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </mesh>
    </FloatWrapper>
  )
}
