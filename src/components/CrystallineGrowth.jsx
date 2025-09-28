import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const CrystallineGrowth = ({ position = [2, -1, -2], scale = 1, useFrame }) => {
  const crystalRef = useRef()
  const shardsRef = useRef()
  
  // Generate crystal shard data
  const crystalData = useMemo(() => {
    const shards = []
    const centerPoint = new THREE.Vector3(0, 0, 0)
    
    // Create main crystal structure
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2
      const layer = Math.floor(i / 5)
      const height = layer * 0.5 + Math.random() * 0.3
      
      const shard = {
        position: [
          Math.cos(angle) * (0.5 + layer * 0.2),
          height,
          Math.sin(angle) * (0.5 + layer * 0.2)
        ],
        rotation: [
          Math.random() * Math.PI,
          angle + Math.random() * 0.5,
          Math.random() * Math.PI
        ],
        scale: 0.3 + Math.random() * 0.5 + layer * 0.1,
        growthDelay: i * 0.1,
        facets: Math.floor(3 + Math.random() * 5),
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.8, 0.6)
      }
      shards.push(shard)
    }
    
    return { shards }
  }, [])
  
  // Crystal shader material
  const crystalMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        growth: { value: 0.0 },
        color: { value: new THREE.Color(0.5, 0.8, 1.0) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        uniform float growth;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Growth effect - scale from bottom up
          vec3 pos = position;
          float growthFactor = smoothstep(-1.0, 1.0, pos.y + growth * 2.0 - 1.0);
          pos.y *= growthFactor;
          pos.x *= growthFactor;
          pos.z *= growthFactor;
          
          // Add subtle crystalline vibration
          pos += normal * sin(time * 10.0 + pos.y * 5.0) * 0.01;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float growth;
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Crystalline facet effect
        float facetPattern(vec3 pos) {
          vec3 facetPos = pos * 8.0;
          float facet1 = abs(sin(facetPos.x) * cos(facetPos.y));
          float facet2 = abs(sin(facetPos.y) * cos(facetPos.z));
          float facet3 = abs(sin(facetPos.z) * cos(facetPos.x));
          return (facet1 + facet2 + facet3) / 3.0;
        }
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vPosition);
          
          // Fresnel effect for crystal edges
          float fresnel = 1.0 - max(0.0, dot(normal, -viewDir));
          fresnel = pow(fresnel, 2.0);
          
          // Crystalline internal structure
          float facets = facetPattern(vPosition);
          
          // Color with internal refraction effect
          vec3 crystalColor = color;
          crystalColor += facets * 0.3;
          crystalColor += fresnel * vec3(1.0, 1.0, 1.0) * 0.5;
          
          // Growth pulse
          float pulse = sin(time * 4.0 + vPosition.y * 3.0) * 0.2 + 0.8;
          crystalColor *= pulse;
          
          // Internal light scattering
          float scatter = sin(time * 3.0 + facets * 10.0) * 0.3 + 0.7;
          crystalColor += scatter * 0.2;
          
          // Alpha with fresnel and growth
          float alpha = opacity * (0.6 + fresnel * 0.4) * growth;
          
          gl_FragColor = vec4(crystalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Animate crystal growth
      if (shardsRef.current) {
        shardsRef.current.children.forEach((shard, i) => {
          const shardData = crystalData.shards[i]
          if (shardData && shard.material) {
            // Calculate growth factor with delay
            const adjustedTime = Math.max(0, time - shardData.growthDelay)
            const growth = Math.min(1, adjustedTime * 0.5)
            
            // Update material uniforms
            shard.material.uniforms.time.value = time
            shard.material.uniforms.growth.value = growth
            shard.material.uniforms.color.value = shardData.color
            
            // Animate shard rotation
            shard.rotation.x = shardData.rotation[0] + time * 0.1
            shard.rotation.y = shardData.rotation[1] + time * 0.2
            shard.rotation.z = shardData.rotation[2] + time * 0.15
            
            // Scale based on growth
            const currentScale = shardData.scale * growth
            shard.scale.setScalar(currentScale)
            
            // Add floating motion
            shard.position.y = shardData.position[1] + Math.sin(time * 2 + i) * 0.1
          }
        })
      }
      
      // Main crystal group rotation
      if (crystalRef.current) {
        crystalRef.current.rotation.y = time * 0.2
        crystalRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      }
    })
  }
  
  // Generate crystal geometries
  const generateCrystalGeometry = (facets) => {
    const geometry = new THREE.ConeGeometry(0.5, 2, facets)
    
    // Modify vertices for more organic crystal shape
    const vertices = geometry.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]
      
      // Add irregularity to crystal faces
      const noise = (Math.sin(x * 10) + Math.cos(z * 10)) * 0.1
      vertices[i] += noise
      vertices[i + 2] += noise
      
      // Taper the crystal
      if (y > 0) {
        const taper = 1 - (y / 2) * 0.7
        vertices[i] *= taper
        vertices[i + 2] *= taper
      }
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    
    return geometry
  }

  return (
    <group ref={crystalRef} position={position} scale={scale}>
      {/* Crystal shards */}
      <group ref={shardsRef}>
        {crystalData.shards.map((shard, i) => (
          <mesh
            key={i}
            position={shard.position}
            rotation={shard.rotation}
            geometry={generateCrystalGeometry(shard.facets)}
            material={crystalMaterial.clone()}
          />
        ))}
      </group>
      
      {/* Base crystal platform */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 0.2, 8]} />
        <meshPhysicalMaterial
          color="#4a5568"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Energy emanating from base */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.1, 1.0, 0.5, 16]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

export default CrystallineGrowth