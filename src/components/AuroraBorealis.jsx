import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const AuroraBorealis = ({ position = [0, 0, -8], scale = 1, useFrame }) => {
  const auroraRef = useRef()
  const curtainsRef = useRef()
  
  // Generate aurora curtain data
  const auroraData = useMemo(() => {
    const curtains = []
    
    for (let i = 0; i < 6; i++) {
      curtains.push({
        position: [(i - 2.5) * 2, 0, Math.random() * 2 - 1],
        width: 1.5 + Math.random() * 1,
        height: 3 + Math.random() * 2,
        segments: 32,
        waveSpeed: 0.5 + Math.random() * 0.5,
        waveAmplitude: 0.3 + Math.random() * 0.3,
        colorShift: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.3
      })
    }
    
    return { curtains }
  }, [])
  
  // Aurora shader material
  const auroraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        waveSpeed: { value: 1.0 },
        waveAmplitude: { value: 0.3 },
        colorShift: { value: 0.0 },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform float waveSpeed;
        uniform float waveAmplitude;
        
        // Noise function for organic movement
        float noise(vec3 pos) {
          return fract(sin(dot(pos, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        // Smooth noise
        float smoothNoise(vec3 pos) {
          vec3 i = floor(pos);
          vec3 f = fract(pos);
          
          // Sample noise at 8 corners of cube
          float n000 = noise(i);
          float n100 = noise(i + vec3(1.0, 0.0, 0.0));
          float n010 = noise(i + vec3(0.0, 1.0, 0.0));
          float n110 = noise(i + vec3(1.0, 1.0, 0.0));
          float n001 = noise(i + vec3(0.0, 0.0, 1.0));
          float n101 = noise(i + vec3(1.0, 0.0, 1.0));
          float n011 = noise(i + vec3(0.0, 1.0, 1.0));
          float n111 = noise(i + vec3(1.0, 1.0, 1.0));
          
          // Interpolate
          vec3 u = f * f * (3.0 - 2.0 * f);
          
          float nx00 = mix(n000, n100, u.x);
          float nx10 = mix(n010, n110, u.x);
          float nx01 = mix(n001, n101, u.x);
          float nx11 = mix(n011, n111, u.x);
          
          float nxy0 = mix(nx00, nx10, u.y);
          float nxy1 = mix(nx01, nx11, u.y);
          
          return mix(nxy0, nxy1, u.z);
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          
          // Multiple wave layers for organic aurora movement
          float wave1 = sin(time * waveSpeed + pos.y * 2.0) * waveAmplitude;
          float wave2 = sin(time * waveSpeed * 1.3 + pos.y * 1.5 + 1.0) * waveAmplitude * 0.7;
          float wave3 = sin(time * waveSpeed * 0.8 + pos.y * 3.0 + 2.0) * waveAmplitude * 0.5;
          
          // Add noise for organic distortion
          float noiseDisplacement = smoothNoise(vec3(pos.x * 2.0, pos.y + time * 0.5, time * 0.3)) * 0.2;
          
          // Apply all movements
          pos.x += wave1 + wave2 + wave3 + noiseDisplacement;
          pos.z += sin(time * waveSpeed * 0.6 + pos.y * 1.2) * waveAmplitude * 0.3;
          
          // Gentle vertical undulation
          pos.y += sin(time * waveSpeed * 0.4 + pos.x * 0.5) * 0.1;
          
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float colorShift;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Aurora color palette
        vec3 auroraColor(float t, float intensity) {
          // Green base with purple and blue variations
          vec3 green = vec3(0.0, 1.0, 0.3);
          vec3 purple = vec3(0.8, 0.2, 1.0);
          vec3 blue = vec3(0.2, 0.8, 1.0);
          vec3 pink = vec3(1.0, 0.3, 0.8);
          
          // Create flowing color transitions
          float colorCycle = sin(t * 2.0 + colorShift) * 0.5 + 0.5;
          
          vec3 color1 = mix(green, purple, smoothstep(0.0, 0.3, colorCycle));
          vec3 color2 = mix(purple, blue, smoothstep(0.3, 0.7, colorCycle));
          vec3 color3 = mix(blue, pink, smoothstep(0.7, 1.0, colorCycle));
          
          vec3 finalColor = color1;
          if (colorCycle > 0.3) finalColor = color2;
          if (colorCycle > 0.7) finalColor = color3;
          
          return finalColor * intensity;
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Vertical gradient (stronger at top)
          float heightGradient = smoothstep(0.0, 0.8, uv.y) * smoothstep(1.0, 0.6, uv.y);
          
          // Horizontal fading at edges
          float edgeFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
          
          // Dynamic intensity based on position and time
          float intensity = sin(time * 2.0 + vWorldPosition.x * 0.5 + vWorldPosition.y * 0.3) * 0.3 + 0.7;
          intensity *= sin(time * 1.5 + vWorldPosition.y * 2.0) * 0.2 + 0.8;
          
          // Aurora ribbons effect
          float ribbons = sin(vWorldPosition.y * 8.0 + time * 3.0) * 0.5 + 0.5;
          ribbons += sin(vWorldPosition.y * 12.0 + time * 2.0 + 1.0) * 0.3;
          ribbons = smoothstep(0.3, 1.2, ribbons);
          
          // Color time parameter
          float colorTime = time * 0.5 + vWorldPosition.x * 0.1 + vWorldPosition.y * 0.05;
          
          // Get aurora color
          vec3 color = auroraColor(colorTime, intensity);
          
          // Apply all effects
          float finalAlpha = heightGradient * edgeFade * ribbons * opacity * intensity;
          
          // Add subtle sparkle effect
          float sparkle = sin(time * 10.0 + vWorldPosition.x * 20.0 + vWorldPosition.y * 15.0) * 0.1 + 0.9;
          color *= sparkle;
          
          gl_FragColor = vec4(color, finalAlpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Update each curtain
      if (curtainsRef.current) {
        curtainsRef.current.children.forEach((curtain, i) => {
          const curtainData = auroraData.curtains[i]
          if (curtainData && curtain.material) {
            curtain.material.uniforms.time.value = time
            curtain.material.uniforms.waveSpeed.value = curtainData.waveSpeed
            curtain.material.uniforms.waveAmplitude.value = curtainData.waveAmplitude
            curtain.material.uniforms.colorShift.value = curtainData.colorShift
            curtain.material.uniforms.opacity.value = curtainData.opacity
          }
        })
      }
      
      // Gentle group movement
      if (auroraRef.current) {
        auroraRef.current.rotation.y = Math.sin(time * 0.1) * 0.1
        auroraRef.current.position.y = Math.sin(time * 0.3) * 0.2
      }
    })
  }
  
  // Create aurora curtain geometry
  const createCurtainGeometry = (width, height, segments) => {
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments)
    
    // Add some initial curvature to make it more curtain-like
    const vertices = geometry.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      
      // Add gentle curve
      vertices[i + 2] = Math.sin(x * 2) * 0.1 + Math.sin(y * 1.5) * 0.05
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    
    return geometry
  }

  return (
    <group ref={auroraRef} position={position} scale={scale}>
      {/* Aurora curtains */}
      <group ref={curtainsRef}>
        {auroraData.curtains.map((curtain, i) => (
          <mesh
            key={i}
            position={curtain.position}
            geometry={createCurtainGeometry(curtain.width, curtain.height, curtain.segments)}
            material={auroraMaterial.clone()}
          />
        ))}
      </group>
      
      {/* Atmospheric glow at base */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 8, 32]} />
        <meshBasicMaterial
          color="#004d4d"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default AuroraBorealis