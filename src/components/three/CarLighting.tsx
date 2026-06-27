import { useRef } from 'react'
import { Environment, ContactShadows, SpotLight } from '@react-three/drei'
import * as THREE from 'three'

export default function CarLighting() {
  const spotRef = useRef<THREE.SpotLight>(null)

  return (
    <>
      {/* IBL — studio preset gives neutral, metallic reflections */}
      <Environment preset="studio" />

      {/* Ambient — very low, let IBL + directional do the work */}
      <ambientLight intensity={0.08} />

      {/* Key light */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
        color="#ffffff"
      />

      {/* Fill light — opposite side, cooler */}
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#bbd4ff" />

      {/* Rim / back light */}
      <directionalLight position={[0, 3, -8]} intensity={0.6} color="#ffffff" />

      {/* Subtle floor bounce */}
      <hemisphereLight args={['#111111', '#0d0d0d', 0.12]} />

      {/* Cinematic spotlight */}
      <SpotLight
        ref={spotRef}
        position={[0, 8, 2]}
        angle={0.35}
        penumbra={0.7}
        intensity={3}
        distance={20}
        attenuation={5}
        anglePower={4}
        color="#ffffff"
        castShadow={false}
      />

      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, -0.52, 0]}
        opacity={0.55}
        scale={20}
        blur={3.5}
        far={4}
        frames={1}
        color="#000000"
      />

      {/* Second softer shadow pass */}
      <ContactShadows
        position={[0, -0.52, 0]}
        opacity={0.2}
        scale={30}
        blur={8}
        far={10}
        frames={1}
        color="#000000"
      />
    </>
  )
}
