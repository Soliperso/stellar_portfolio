import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const DNAHelix = ({ useFrame, Float }) => {
  const groupRef = useRef()
  
  // Generate DNA helix structure
  const helixData = useMemo(() => {
    const points1 = []
    const points2 = []
    const connections = []
    const segments = 50
    
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 4
      const y = (i / segments) * 6 - 3
      
      // First strand
      const x1 = Math.cos(t) * 1.5
      const z1 = Math.sin(t) * 1.5
      points1.push([x1, y, z1])
      
      // Second strand (opposite)
      const x2 = Math.cos(t + Math.PI) * 1.5
      const z2 = Math.sin(t + Math.PI) * 1.5
      points2.push([x2, y, z2])
      
      // Connection points
      if (i % 3 === 0) {
        connections.push({ start: [x1, y, z1], end: [x2, y, z2] })
      }
    }
    
    return { points1, points2, connections }
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5
      }
    })
  }

  if (!Float) {
    return (
      <group ref={groupRef} position={[6, 0, -2]}>
        {/* First strand */}
        {helixData.points1.map((point, i) => (
          <mesh key={`strand1-${i}`} position={point}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhysicalMaterial 
              color="#00ff88" 
              emissive="#00ff88"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Second strand */}
        {helixData.points2.map((point, i) => (
          <mesh key={`strand2-${i}`} position={point}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhysicalMaterial 
              color="#ff0088" 
              emissive="#ff0088"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Connections */}
        {helixData.connections.map((connection, i) => {
          const start = new THREE.Vector3(...connection.start)
          const end = new THREE.Vector3(...connection.end)
          const center = start.clone().lerp(end, 0.5)
          const length = start.distanceTo(end)
          
          return (
            <mesh 
              key={`connection-${i}`} 
              position={center.toArray()}
              lookAt={end}
            >
              <cylinderGeometry args={[0.02, 0.02, length, 8]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                emissive="#ffffff"
                emissiveIntensity={0.1}
                transparent
                opacity={0.6}
              />
            </mesh>
          )
        })}
      </group>
    )
  }

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[6, 0, -2]}>
        {/* First strand */}
        {helixData.points1.map((point, i) => (
          <mesh key={`strand1-${i}`} position={point}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhysicalMaterial 
              color="#00ff88" 
              emissive="#00ff88"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Second strand */}
        {helixData.points2.map((point, i) => (
          <mesh key={`strand2-${i}`} position={point}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshPhysicalMaterial 
              color="#ff0088" 
              emissive="#ff0088"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Connections */}
        {helixData.connections.map((connection, i) => {
          const start = new THREE.Vector3(...connection.start)
          const end = new THREE.Vector3(...connection.end)
          const center = start.clone().lerp(end, 0.5)
          const length = start.distanceTo(end)
          
          return (
            <mesh 
              key={`connection-${i}`} 
              position={center.toArray()}
              lookAt={end}
            >
              <cylinderGeometry args={[0.02, 0.02, length, 8]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                emissive="#ffffff"
                emissiveIntensity={0.1}
                transparent
                opacity={0.6}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

export default DNAHelix