import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const HolographicShape = ({ position, scale = 1, useFrame, Float, shape = 'icosahedron' }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Custom holographic shader
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0, 0) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Add some vertex displacement for liquid effect
          vec3 pos = position;
          pos += normal * sin(time * 2.0 + position.x * 5.0) * 0.05;
          pos += normal * sin(time * 1.5 + position.y * 3.0) * 0.03;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float opacity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Holographic interference patterns
        float interference(vec2 uv, float time) {
          float wave1 = sin(uv.x * 20.0 + time * 3.0);
          float wave2 = sin(uv.y * 15.0 + time * 2.0);
          float wave3 = sin((uv.x + uv.y) * 10.0 + time * 4.0);
          return (wave1 + wave2 + wave3) / 3.0;
        }
        
        // Rainbow holographic effect
        vec3 rainbow(float t) {
          t = fract(t);
          float r = abs(t * 6.0 - 3.0) - 1.0;
          float g = 2.0 - abs(t * 6.0 - 2.0);
          float b = 2.0 - abs(t * 6.0 - 4.0);
          return clamp(vec3(r, g, b), 0.0, 1.0);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create holographic interference
          float pattern = interference(uv, time);
          
          // Add fresnel effect
          vec3 viewDir = normalize(vPosition);
          float fresnel = 1.0 - max(0.0, dot(vNormal, -viewDir));
          fresnel = pow(fresnel, 2.0);
          
          // Rainbow holographic color
          float colorShift = time * 0.1 + vPosition.x * 0.1 + vPosition.y * 0.1 + pattern * 0.3;
          vec3 holographicColor = rainbow(colorShift);
          
          // Add iridescent shimmer
          float shimmer = sin(time * 5.0 + vPosition.x * 10.0 + vPosition.y * 8.0) * 0.5 + 0.5;
          holographicColor += shimmer * 0.3;
          
          // Combine with fresnel for edge glow
          vec3 finalColor = holographicColor * (0.3 + fresnel * 1.5);
          
          // Add some transparency based on angle
          float alpha = opacity * (0.4 + fresnel * 0.8);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    return material
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      if (meshRef.current && shaderMaterial) {
        // Update shader uniforms
        shaderMaterial.uniforms.time.value = state.clock.elapsedTime
        
        // Complex rotation with holographic wobble
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.4
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.6
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.3
        
        // Breathing scale effect
        const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1
        meshRef.current.scale.setScalar(scale * breathe)
      }
    })
  }

  const geometries = {
    icosahedron: <icosahedronGeometry args={[1, 2]} />,
    octahedron: <octahedronGeometry args={[1, 1]} />,
    dodecahedron: <dodecahedronGeometry args={[1, 1]} />,
    tetrahedron: <tetrahedronGeometry args={[1, 1]} />,
    torus: <torusGeometry args={[1, 0.4, 16, 100]} />,
    torusKnot: <torusKnotGeometry args={[1, 0.3, 100, 16]} />
  }

  if (!Float) {
    return (
      <mesh ref={meshRef} position={position} material={shaderMaterial}>
        {geometries[shape] || geometries.icosahedron}
      </mesh>
    )
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} material={shaderMaterial}>
        {geometries[shape] || geometries.icosahedron}
      </mesh>
    </Float>
  )
}

export default HolographicShape