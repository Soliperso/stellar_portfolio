import { useRef, useState, useEffect } from 'react'

const MouseTracker = ({ useFrame }) => {
  const groupRef = useRef()
  const [mousePosition, setMousePosition] = useState([0, 0])
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition([x * 5, y * 5])
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      if (groupRef.current) {
        // Smooth follow mouse position
        groupRef.current.position.x += (mousePosition[0] - groupRef.current.position.x) * 0.1
        groupRef.current.position.y += (mousePosition[1] - groupRef.current.position.y) * 0.1
        
        // Add subtle rotation based on movement
        groupRef.current.rotation.z = mousePosition[0] * 0.1
        groupRef.current.rotation.x = mousePosition[1] * 0.05
      }
    })
  }

  return (
    <group ref={groupRef}>
      {/* Central tracking orb */}
      <mesh position={[0, 0, 2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Trailing particles */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            -i * 0.3, 
            Math.sin(i * 0.5) * 0.2, 
            2 - i * 0.1
          ]}
        >
          <sphereGeometry args={[0.05 - i * 0.005, 8, 8]} />
          <meshBasicMaterial 
            color={`hsl(${200 + i * 20}, 70%, ${70 - i * 5}%)`}
            transparent 
            opacity={0.6 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

export default MouseTracker