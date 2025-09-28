import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const EnergyField = ({ useFrame }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Create energy field geometry with dynamic vertices
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(3, 64, 32)
    return geo
  }, [])
  
  // Custom energy shader
  const vertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      vPosition = position;
      
      // Add wave distortion
      vec3 pos = position;
      pos += normal * sin(pos.x * 2.0 + time) * 0.1;
      pos += normal * sin(pos.y * 3.0 + time * 1.5) * 0.05;
      pos += normal * sin(pos.z * 1.5 + time * 0.8) * 0.15;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `
  
  const fragmentShader = `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Create energy patterns
      float pattern1 = sin(vPosition.x * 5.0 + time * 2.0) * 0.5 + 0.5;
      float pattern2 = sin(vPosition.y * 3.0 + time * 1.5) * 0.5 + 0.5;
      float pattern3 = sin(vPosition.z * 4.0 + time * 3.0) * 0.5 + 0.5;
      
      // Mix colors based on patterns
      vec3 color = mix(color1, color2, pattern1);
      color = mix(color, color3, pattern2 * pattern3);
      
      // Add rim lighting effect
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      
      // Pulsing alpha
      float alpha = 0.2 + fresnel * 0.5 + sin(time * 4.0) * 0.1;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color1: { value: new THREE.Color('#00ffff') },
    color2: { value: new THREE.Color('#ff00ff') },
    color3: { value: new THREE.Color('#ffff00') }
  }), [])
  
  if (useFrame) {
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
        
        // Update shader uniforms
        if (materialRef.current) {
          materialRef.current.uniforms.time.value = state.clock.elapsedTime
        }
      }
    })
  }

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default EnergyField