import { type MeshPhysicalMaterialProps } from '@react-three/fiber'
import { forwardRef } from 'react'
import { MeshPhysicalMaterial } from 'three'

interface GlassMaterialProps extends MeshPhysicalMaterialProps {
  color?: string
  tint?: number
}

const GlassMaterial = forwardRef<MeshPhysicalMaterial, GlassMaterialProps>(
  ({ color = '#9333ea', tint = 0.05, ...props }, ref) => {
    return (
      <meshPhysicalMaterial
        ref={ref}
        color={color}
        transmission={0.9}
        roughness={0.05}
        metalness={0}
        ior={1.5}
        thickness={1.5}
        envMapIntensity={1.5}
        transparent
        opacity={0.9}
        {...props}
      />
    )
  }
)

GlassMaterial.displayName = 'GlassMaterial'

export default GlassMaterial
