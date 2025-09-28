import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const SpiralGalaxy = ({ useFrame }) => {
  const pointsRef = useRef()
  const materialRef = useRef()
  
  // Generate spiral galaxy points
  const { geometry, colors } = useMemo(() => {
    const positions = []
    const colors = []
    const particleCount = 1000
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral parameters
      const radius = Math.random() * 8 + 2
      const angle = (i / particleCount) * Math.PI * 4 + Math.random() * 0.5
      const height = (Math.random() - 0.5) * 2
      
      // Position calculation
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = height + Math.sin(radius * 0.5) * 0.5
      
      positions.push(x, y, z)
      
      // Color based on distance from center
      const distanceFromCenter = Math.sqrt(x * x + z * z)
      const hue = (distanceFromCenter * 0.1 + i * 0.01) % 1
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      colors.push(color.r, color.g, color.b)
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    return { geometry: geo, colors }
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      if (pointsRef.current) {
        // Rotate the entire galaxy
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
        
        // Animate individual particles
        const positions = pointsRef.current.geometry.attributes.position.array
        const time = state.clock.elapsedTime
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i]
          const z = positions[i + 2]
          const radius = Math.sqrt(x * x + z * z)
          
          // Add subtle wobble
          positions[i + 1] += Math.sin(time * 2 + radius * 0.5) * 0.002
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
      
      // Animate material properties
      if (materialRef.current) {
        materialRef.current.size = 0.05 + Math.sin(state.clock.elapsedTime * 3) * 0.02
      }
    })
  }

  return (
    <points ref={pointsRef} geometry={geometry} position={[0, 0, -10]}>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default SpiralGalaxy