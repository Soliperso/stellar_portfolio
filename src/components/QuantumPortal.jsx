import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const QuantumPortal = ({ position = [0, 0, -5], scale = 1, useFrame }) => {
  const portalRef = useRef()
  const ringsRef = useRef()
  const particlesRef = useRef()
  
  // Create energy rings
  const energyRings = useMemo(() => {
    const rings = []
    for (let i = 0; i < 8; i++) {
      rings.push({
        radius: 0.5 + i * 0.3,
        speed: 0.5 + i * 0.2,
        offset: (i * Math.PI) / 4,
        thickness: 0.02 + i * 0.01
      })
    }
    return rings
  }, [])
  
  // Portal shader material
  const portalMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function for portal distortion
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Smooth noise
        float smoothNoise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // Portal distortion effect
        vec2 portalDistortion(vec2 uv, float time) {
          float angle = atan(uv.y, uv.x);
          float radius = length(uv);
          
          // Spiral distortion
          angle += time * 2.0 + radius * 10.0;
          
          // Radial waves
          radius += sin(angle * 5.0 + time * 3.0) * 0.1;
          radius += sin(radius * 20.0 + time * 2.0) * 0.05;
          
          return vec2(cos(angle) * radius, sin(angle) * radius);
        }
        
        void main() {
          vec2 uv = vUv - 0.5;
          float radius = length(uv);
          
          // Portal boundary
          if (radius > 0.45) {
            discard;
          }
          
          // Apply portal distortion
          vec2 distortedUV = portalDistortion(uv, time);
          
          // Create swirling energy effect
          float swirl = sin(distortedUV.x * 15.0 + time * 4.0) * sin(distortedUV.y * 12.0 + time * 3.0);
          
          // Add noise for chaotic energy
          float noiseVal = smoothNoise(distortedUV * 8.0 + time * 2.0);
          
          // Color gradient from center to edge
          float centerGlow = 1.0 - smoothstep(0.0, 0.4, radius);
          
          // Quantum energy colors
          vec3 innerColor = vec3(0.0, 0.8, 1.0); // Cyan
          vec3 middleColor = vec3(0.5, 0.0, 1.0); // Purple  
          vec3 outerColor = vec3(1.0, 0.0, 0.8); // Pink
          
          vec3 color = mix(outerColor, middleColor, centerGlow);
          color = mix(color, innerColor, centerGlow * centerGlow);
          
          // Add energy fluctuations
          color *= 0.8 + swirl * 0.3 + noiseVal * 0.4;
          
          // Pulsing intensity
          float pulse = sin(time * 5.0) * 0.2 + 0.8;
          color *= pulse;
          
          // Alpha based on distance from center
          float alpha = (1.0 - smoothstep(0.0, 0.45, radius)) * 0.9;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
  }, [])
  
  // Energy ring material
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0.0, 0.8, 1.0) },
        opacity: { value: 0.6 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv - 0.5;
          float radius = length(uv);
          
          // Ring effect
          float ring = 1.0 - smoothstep(0.45, 0.5, radius);
          ring *= smoothstep(0.35, 0.4, radius);
          
          // Energy pulse
          float pulse = sin(time * 8.0) * 0.3 + 0.7;
          
          // Sparkling effect
          float sparkle = sin(atan(uv.y, uv.x) * 20.0 + time * 10.0) * 0.3 + 0.7;
          
          vec3 finalColor = color * ring * pulse * sparkle;
          float alpha = ring * opacity * pulse;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Update portal material
      if (portalMaterial) {
        portalMaterial.uniforms.time.value = time
      }
      
      // Update ring material
      if (ringMaterial) {
        ringMaterial.uniforms.time.value = time
      }
      
      // Animate portal rotation
      if (portalRef.current) {
        portalRef.current.rotation.z = time * 0.5
      }
      
      // Animate energy rings
      if (ringsRef.current) {
        ringsRef.current.children.forEach((ring, i) => {
          const ringData = energyRings[i]
          if (ringData) {
            ring.rotation.z = time * ringData.speed + ringData.offset
            ring.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.1)
          }
        })
      }
      
      // Animate portal scale for breathing effect
      if (portalRef.current) {
        const breathe = 1 + Math.sin(time * 2) * 0.05
        portalRef.current.scale.setScalar(scale * breathe)
      }
    })
  }

  return (
    <group position={position}>
      {/* Main portal */}
      <mesh ref={portalRef} material={portalMaterial}>
        <circleGeometry args={[1, 64]} />
      </mesh>
      
      {/* Energy rings */}
      <group ref={ringsRef}>
        {energyRings.map((ringData, i) => (
          <mesh key={i} material={ringMaterial}>
            <ringGeometry args={[ringData.radius - ringData.thickness, ringData.radius + ringData.thickness, 64]} />
          </mesh>
        ))}
      </group>
      
      {/* Portal frame */}
      <mesh>
        <torusGeometry args={[1.1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export default QuantumPortal