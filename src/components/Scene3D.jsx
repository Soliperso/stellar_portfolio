import { Suspense, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Lazy load Three.js components to avoid SSR issues
const LazyCanvas = ({ children, ...props }) => {
  const [Canvas, setCanvas] = useState(null)
  const [useFrame, setUseFrame] = useState(null)
  const [Float, setFloat] = useState(null)
  const [OrbitControls, setOrbitControls] = useState(null)

  useEffect(() => {
    const loadThree = async () => {
      try {
        const [fiberModule, dreiModule] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei')
        ])
        setCanvas(() => fiberModule.Canvas)
        setUseFrame(() => fiberModule.useFrame)
        setFloat(() => dreiModule.Float)
        setOrbitControls(() => dreiModule.OrbitControls)
      } catch (error) {
        console.warn('Three.js failed to load:', error)
      }
    }
    
    loadThree()
  }, [])

  if (!Canvas) {
    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return <Canvas {...props}>{children}</Canvas>
}



const Scene3DContent = ({ useFrame, Float, OrbitControls }) => {
  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#0ea5e9" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#14b8a6" />
      <pointLight position={[0, 15, 0]} intensity={0.6} color="#8b5cf6" />
      <spotLight position={[5, 5, 5]} intensity={1} angle={Math.PI / 6} penumbra={0.5} color="#f59e0b" />
      
      {/* Enhanced Orbit Controls */}
      {OrbitControls && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      )}
    </>
  )
}

const FallbackAnimation = () => {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      {/* Subtle floating particles only */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Gentle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-accent-50/20" />
    </div>
  )
}

const Scene3D = () => {
  const [Canvas, setCanvas] = useState(null)
  const [useFrame, setUseFrame] = useState(null)
  const [Float, setFloat] = useState(null)
  const [OrbitControls, setOrbitControls] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const loadThree = async () => {
      try {
        const [fiberModule, dreiModule] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei')
        ])
        setCanvas(() => fiberModule.Canvas)
        setUseFrame(() => fiberModule.useFrame)
        setFloat(() => dreiModule.Float)
        setOrbitControls(() => dreiModule.OrbitControls)
      } catch (error) {
        console.warn('Three.js failed to load, using fallback animation:', error)
        setLoadError(true)
      }
    }
    
    loadThree()
  }, [])

  if (loadError || !Canvas) {
    return <FallbackAnimation />
  }

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        onError={() => setLoadError(true)}
      >
        <Suspense fallback={null}>
          <Scene3DContent 
            useFrame={useFrame}
            Float={Float}
            OrbitControls={OrbitControls}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene3D