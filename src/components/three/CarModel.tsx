import { useRef, useEffect, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MathUtils } from 'three'
import * as THREE from 'three'
import { interpModel, interpCam } from './carKeyframes'

/* ─── Error boundary ─── */
interface EBState { error: boolean }
class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { error: false }
  }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    return this.state.error ? this.props.fallback : this.props.children
  }
}

/* ─── Procedural car fallback ─── */
function ProceduralCar() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.38, 1.05]} />
        <meshStandardMaterial color="#141414" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0.1, 0.62, 0]} castShadow>
        <boxGeometry args={[1.25, 0.38, 0.92]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.12} />
      </mesh>
      {/* Front hood */}
      <mesh position={[0.88, 0.28, 0]} castShadow>
        <boxGeometry args={[0.65, 0.12, 1.05]} />
        <meshStandardMaterial color="#181818" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Rear deck */}
      <mesh position={[-0.88, 0.3, 0]} castShadow>
        <boxGeometry args={[0.65, 0.08, 1.05]} />
        <meshStandardMaterial color="#181818" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels */}
      {([ [-0.85, -0.1,  0.56], [0.85, -0.1,  0.56],
          [-0.85, -0.1, -0.56], [0.85, -0.1, -0.56] ] as [number,number,number][]).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.22, 28]} />
            <meshStandardMaterial color="#080808" metalness={0.2} roughness={0.85} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.24, 12]} />
            <meshStandardMaterial color="#555555" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      {([ [1.2, 0.22,  0.3], [1.2, 0.22, -0.3] ] as [number,number,number][]).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.05, 0.12, 0.22]} />
          <meshStandardMaterial color="#ffffff" emissive="#aad4ff" emissiveIntensity={0.6} metalness={0} roughness={0} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── GLTF car ─── */
function GLTFCar() {
  const { scene } = useGLTF('/carro3d.glb')
  const cloned = useMemo(() => {
    const s = scene.clone(true)
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        if ((mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
          mat.envMapIntensity = 1.8
          mat.needsUpdate = true
          mesh.material = mat
        }
      }
    })
    return s
  }, [scene])

  return <primitive object={cloned} />
}

/* ─── Main animated car group ─── */
interface CarModelProps {
  scrollProgress: React.MutableRefObject<number>
  mousePos: React.MutableRefObject<{ x: number; y: number }>
  lastScrollTime: React.MutableRefObject<number>
}

export default function CarModel({ scrollProgress, mousePos, lastScrollTime }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  /* init camera */
  useEffect(() => {
    camera.position.set(4, 1.5, 6)
    camera.lookAt(0, 0.2, 0)
  }, [camera])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const progress = scrollProgress.current
    const mTarget  = interpModel(progress)
    const cTarget  = interpCam(progress)

    /* idle float (kicks in when user stops scrolling) */
    const elapsed     = clock.elapsedTime
    const idleSec     = (Date.now() - lastScrollTime.current) / 1000
    const isIdle      = idleSec > 1.2
    const idleFloat   = isIdle ? Math.sin(elapsed * 0.75) * 0.045 : 0
    const idlePitch   = isIdle ? Math.sin(elapsed * 0.5) * 0.012 : 0
    const idleRoll    = isIdle ? Math.sin(elapsed * 0.4 + 1) * 0.008 : 0

    /* mouse parallax */
    const mx = mousePos.current.x * 0.12
    const my = mousePos.current.y * 0.06

    const LERP = 0.055

    /* model */
    groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, mTarget.pos[0] + mx, LERP)
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, mTarget.pos[1] + idleFloat, LERP)
    groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, mTarget.pos[2], LERP)

    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, mTarget.rot[0] + my + idlePitch, LERP)
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, mTarget.rot[1], LERP)
    groupRef.current.rotation.z = MathUtils.lerp(groupRef.current.rotation.z, mTarget.rot[2] + idleRoll, LERP)

    const targetScale = mTarget.scale
    groupRef.current.scale.setScalar(
      MathUtils.lerp(groupRef.current.scale.x, targetScale, LERP * 0.8)
    )

    /* camera */
    const CAM_LERP = 0.04
    camera.position.x = MathUtils.lerp(camera.position.x, cTarget.pos[0], CAM_LERP)
    camera.position.y = MathUtils.lerp(camera.position.y, cTarget.pos[1], CAM_LERP)
    camera.position.z = MathUtils.lerp(camera.position.z, cTarget.pos[2], CAM_LERP)
    camera.lookAt(cTarget.target[0], cTarget.target[1], cTarget.target[2])
  })

  return (
    <group ref={groupRef} scale={1}>
      <ModelBoundary fallback={<ProceduralCar />}>
        <GLTFCar />
      </ModelBoundary>
    </group>
  )
}

useGLTF.preload('/carro3d.glb')
