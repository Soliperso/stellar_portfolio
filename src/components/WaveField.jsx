import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const WaveField = ({ useFrame }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Create wave geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 50, 50)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      if (meshRef.current && meshRef.current.geometry) {
        const time = state.clock.elapsedTime
        const position = meshRef.current.geometry.attributes.position
        
        // Create wave effect
        for (let i = 0; i < position.count; i++) {
          const x = position.getX(i)
          const z = position.getZ(i)
          
          const waveX = Math.sin((x + time) * 0.5) * 0.3
          const waveZ = Math.sin((z + time * 0.7) * 0.8) * 0.2
          const waveXZ = Math.sin((x + z + time) * 0.3) * 0.4
          
          position.setY(i, waveX + waveZ + waveXZ)
        }
        
        position.needsUpdate = true
        meshRef.current.geometry.computeVertexNormals()
      }
      
      // Animate material
      if (materialRef.current) {
        const hue = (state.clock.elapsedTime * 20) % 360
        materialRef.current.color.setHSL(hue / 360, 0.6, 0.4)
        materialRef.current.emissive.setHSL(hue / 360, 0.8, 0.1)
      }
    })
  }

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} geometry={geometry}>
      <meshPhysicalMaterial
        ref={materialRef}
        color="#0ea5e9"
        emissive="#0ea5e9"
        emissiveIntensity={0.1}
        wireframe
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default WaveField