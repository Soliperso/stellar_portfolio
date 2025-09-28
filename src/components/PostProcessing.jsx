import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const CustomShaderMaterial = ({ useFrame }) => {
  const materialRef = useRef()
  
  // Custom vertex shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  // Custom fragment shader with time-based effects
  const fragmentShader = `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create ripple effect
      float ripple = sin(length(vUv - 0.5) * 10.0 - time * 3.0) * 0.5 + 0.5;
      
      // Create color gradient
      vec3 color = mix(color1, color2, ripple);
      
      // Add pulsing alpha
      float alpha = 0.3 + sin(time * 2.0) * 0.2;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color1: { value: new THREE.Color('#0ea5e9') },
    color2: { value: new THREE.Color('#8b5cf6') }
  }), [])
  
  if (useFrame) {
    useFrame((state) => {
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.elapsedTime
      }
    })
  }

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
    />
  )
}

const HolographicPlane = ({ useFrame }) => {
  return (
    <mesh position={[0, 0, -8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[15, 10]} />
      <CustomShaderMaterial useFrame={useFrame} />
    </mesh>
  )
}

export default HolographicPlane