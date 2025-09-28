import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const LiquidMetal = ({ position = [-3, 1, -1], scale = 1, useFrame }) => {
  const liquidRef = useRef()
  const sphereRef = useRef()
  
  // Liquid metal shader material
  const liquidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0, 0) },
        morphIntensity: { value: 0.3 },
        metalness: { value: 0.9 },
        roughness: { value: 0.1 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform float morphIntensity;
        
        // 3D noise function
        float noise3D(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        // Smooth 3D noise
        float smoothNoise3D(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          
          // Sample 8 corners of cube
          float n000 = noise3D(i);
          float n100 = noise3D(i + vec3(1.0, 0.0, 0.0));
          float n010 = noise3D(i + vec3(0.0, 1.0, 0.0));
          float n110 = noise3D(i + vec3(1.0, 1.0, 0.0));
          float n001 = noise3D(i + vec3(0.0, 0.0, 1.0));
          float n101 = noise3D(i + vec3(1.0, 0.0, 1.0));
          float n011 = noise3D(i + vec3(0.0, 1.0, 1.0));
          float n111 = noise3D(i + vec3(1.0, 1.0, 1.0));
          
          // Smooth interpolation
          vec3 u = f * f * (3.0 - 2.0 * f);
          
          float nx00 = mix(n000, n100, u.x);
          float nx10 = mix(n010, n110, u.x);
          float nx01 = mix(n001, n101, u.x);
          float nx11 = mix(n011, n111, u.x);
          
          float nxy0 = mix(nx00, nx10, u.y);
          float nxy1 = mix(nx01, nx11, u.y);
          
          return mix(nxy0, nxy1, u.z);
        }
        
        // Fractal noise (multiple octaves)
        float fractalNoise(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 4; i++) {
            value += amplitude * smoothNoise3D(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Multiple morphing layers
          float noise1 = fractalNoise(pos * 2.0 + time * 0.5);
          float noise2 = fractalNoise(pos * 3.0 + time * 0.8 + vec3(10.0));
          float noise3 = fractalNoise(pos * 1.5 + time * 0.3 + vec3(20.0));
          
          // Liquid metal deformation
          vec3 deformation = normal * morphIntensity * (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3);
          
          // Add surface tension waves
          float wave1 = sin(time * 3.0 + pos.x * 8.0) * sin(time * 2.5 + pos.y * 6.0) * 0.05;
          float wave2 = sin(time * 4.0 + pos.z * 10.0) * sin(time * 3.5 + pos.x * 7.0) * 0.03;
          deformation += normal * (wave1 + wave2) * morphIntensity;
          
          // Pulsing effect
          float pulse = sin(time * 2.0) * 0.1 + 1.0;
          pos *= pulse;
          
          // Apply all deformations
          pos += deformation;
          
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          
          // Recalculate normal for lighting
          vec3 tangent1 = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
          vec3 tangent2 = normalize(cross(normal, tangent1));
          
          vec3 nearby1 = position + tangent1 * 0.01;
          vec3 nearby2 = position + tangent2 * 0.01;
          
          float noise1_nearby1 = fractalNoise(nearby1 * 2.0 + time * 0.5);
          float noise1_nearby2 = fractalNoise(nearby2 * 2.0 + time * 0.5);
          
          vec3 deformedNearby1 = nearby1 + normalize(nearby1) * morphIntensity * noise1_nearby1;
          vec3 deformedNearby2 = nearby2 + normalize(nearby2) * morphIntensity * noise1_nearby2;
          
          vec3 newTangent1 = normalize(deformedNearby1 - pos);
          vec3 newTangent2 = normalize(deformedNearby2 - pos);
          vNormal = normalize(cross(newTangent1, newTangent2));
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float metalness;
        uniform float roughness;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        // Environment mapping simulation
        vec3 environmentColor(vec3 reflectDir) {
          // Simulate a colorful environment
          float u = atan(reflectDir.z, reflectDir.x) / (2.0 * 3.14159) + 0.5;
          float v = acos(reflectDir.y) / 3.14159;
          
          // Create a gradient environment
          vec3 skyColor = vec3(0.5, 0.8, 1.0);
          vec3 horizonColor = vec3(1.0, 0.6, 0.3);
          vec3 groundColor = vec3(0.2, 0.3, 0.1);
          
          vec3 color = mix(groundColor, horizonColor, smoothstep(0.4, 0.6, v));
          color = mix(color, skyColor, smoothstep(0.6, 0.8, v));
          
          // Add some dynamic color shifts
          color += sin(time * 2.0 + u * 10.0) * 0.2 * vec3(1.0, 0.5, 0.3);
          
          return color;
        }
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          
          // Fresnel effect
          float fresnel = 1.0 - max(0.0, dot(normal, viewDir));
          fresnel = pow(fresnel, 2.0);
          
          // Reflection direction
          vec3 reflectDir = reflect(-viewDir, normal);
          
          // Get environment reflection
          vec3 envColor = environmentColor(reflectDir);
          
          // Base metallic color
          vec3 baseColor = vec3(0.8, 0.9, 1.0); // Chrome-like base
          
          // Liquid metal color shifts
          float colorShift = sin(time * 1.5 + vWorldPosition.x * 2.0 + vWorldPosition.y * 1.5) * 0.5 + 0.5;
          vec3 liquidColor1 = vec3(0.9, 0.9, 1.0); // Silver
          vec3 liquidColor2 = vec3(0.7, 0.8, 1.0); // Blue tint
          vec3 liquidColor3 = vec3(1.0, 0.8, 0.7); // Warm tint
          
          vec3 dynamicColor = mix(liquidColor1, liquidColor2, smoothstep(0.3, 0.7, colorShift));
          dynamicColor = mix(dynamicColor, liquidColor3, smoothstep(0.7, 1.0, colorShift));
          
          // Combine base color with dynamic shifts
          baseColor = mix(baseColor, dynamicColor, 0.3);
          
          // Surface ripples for liquid effect
          float ripple = sin(time * 5.0 + vWorldPosition.x * 10.0 + vWorldPosition.y * 8.0) * 0.1 + 0.9;
          
          // Mix reflection with base color based on metalness
          vec3 finalColor = mix(baseColor, envColor, metalness * fresnel);
          
          // Apply surface ripples
          finalColor *= ripple;
          
          // Add some iridescence
          float iridescence = sin(fresnel * 10.0 + time * 3.0) * 0.2 + 0.8;
          finalColor *= iridescence;
          
          // Enhance highlights
          float highlight = pow(max(0.0, dot(reflectDir, normalize(vec3(1.0, 1.0, 1.0)))), 32.0);
          finalColor += highlight * vec3(1.0, 1.0, 1.0) * 0.5;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    })
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Update shader uniforms
      if (liquidMaterial) {
        liquidMaterial.uniforms.time.value = time
        
        // Dynamic morphing intensity
        liquidMaterial.uniforms.morphIntensity.value = 0.2 + Math.sin(time * 1.5) * 0.1
      }
      
      // Floating and rotation animation
      if (liquidRef.current) {
        liquidRef.current.rotation.x = Math.sin(time * 0.7) * 0.2
        liquidRef.current.rotation.y = time * 0.3
        liquidRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
        
        // Gentle floating motion
        liquidRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.1
      }
    })
  }

  return (
    <group ref={liquidRef} position={position} scale={scale}>
      {/* Main liquid metal sphere */}
      <mesh ref={sphereRef} material={liquidMaterial}>
        <icosahedronGeometry args={[1, 4]} />
      </mesh>
      
      {/* Liquid droplets around main sphere */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.5 + Math.sin(i) * 0.3
        const dropPosition = [
          Math.cos(angle) * radius,
          Math.sin(i * 2) * 0.5,
          Math.sin(angle) * radius
        ]
        
        return (
          <mesh key={i} position={dropPosition} material={liquidMaterial}>
            <sphereGeometry args={[0.05 + Math.sin(i) * 0.02, 8, 8]} />
          </mesh>
        )
      })}
      
      {/* Liquid base puddle */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={liquidMaterial}>
        <ringGeometry args={[0.5, 1.2, 32]} />
      </mesh>
    </group>
  )
}

export default LiquidMetal