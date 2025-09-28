import { useRef, useState } from 'react'

const InteractiveOrb = ({ position, color, useFrame, Float }) => {
  const orbRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  if (useFrame) {
    useFrame((state, delta) => {
      if (orbRef.current) {
        // Base rotation
        orbRef.current.rotation.x += delta * 0.5
        orbRef.current.rotation.y += delta * 0.3
        
        // Interactive scaling
        const targetScale = hovered ? 1.3 : clicked ? 0.8 : 1
        orbRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.1)
        
        // Pulsing effect
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
        orbRef.current.material.emissiveIntensity = hovered ? 0.3 * pulse : 0.1 * pulse
      }
    })
  }

  if (!Float) {
    return (
      <mesh
        ref={orbRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    )
  }

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh
        ref={orbRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

export default InteractiveOrb