import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const FloatingText = ({ position = [0, 2, -3], scale = 1, useFrame, text = "PORTFOLIO" }) => {
  const textRef = useRef()
  const particlesRef = useRef()
  
  // Generate text particle data
  const textData = useMemo(() => {
    const particles = []
    const words = text.split(' ')
    
    words.forEach((word, wordIndex) => {
      const letters = word.split('')
      
      letters.forEach((letter, letterIndex) => {
        // Create multiple particles per letter for formation effect
        for (let p = 0; p < 12; p++) {
          const baseX = (wordIndex * 3) + (letterIndex * 0.4) - (word.length * 0.2)
          const baseY = 0
          const baseZ = 0
          
          const particle = {
            letter: letter,
            targetPosition: [
              baseX + (Math.random() - 0.5) * 0.2,
              baseY + (Math.random() - 0.5) * 0.2,
              baseZ + (Math.random() - 0.5) * 0.1
            ],
            currentPosition: [
              baseX + (Math.random() - 0.5) * 4,
              baseY + (Math.random() - 0.5) * 4,
              baseZ + (Math.random() - 0.5) * 4
            ],
            velocity: [0, 0, 0],
            formationDelay: wordIndex * 0.5 + letterIndex * 0.1 + p * 0.02,
            dissolveDelay: 8 + wordIndex * 0.3 + letterIndex * 0.05,
            size: 0.02 + Math.random() * 0.01,
            life: 0,
            phase: Math.random() * Math.PI * 2,
            wordIndex: wordIndex,
            letterIndex: letterIndex
          }
          particles.push(particle)
        }
      })
    })
    
    return { particles, words }
  }, [text])
  
  // Text particle material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        formation: { value: 0.0 },
        dissolution: { value: 0.0 },
        opacity: { value: 1.0 }
      },
      vertexShader: `
        attribute float size;
        attribute float life;
        attribute float phase;
        attribute vec3 targetPos;
        attribute vec3 velocity;
        varying float vLife;
        varying float vPhase;
        uniform float time;
        uniform float formation;
        uniform float dissolution;
        
        void main() {
          vLife = life;
          vPhase = phase;
          
          vec3 pos = position;
          
          // Formation animation - particles converge to target positions
          float formationProgress = clamp(formation, 0.0, 1.0);
          pos = mix(pos, targetPos, formationProgress);
          
          // Dissolution animation - particles scatter
          float dissolutionProgress = clamp(dissolution, 0.0, 1.0);
          vec3 scatterPos = pos + velocity * dissolutionProgress * 3.0;
          pos = mix(pos, scatterPos, dissolutionProgress);
          
          // Add floating motion when formed
          if (formationProgress > 0.8 && dissolutionProgress < 0.2) {
            pos.y += sin(time * 2.0 + phase) * 0.05;
            pos.x += sin(time * 1.5 + phase + 1.0) * 0.02;
            pos.z += sin(time * 1.8 + phase + 2.0) * 0.03;
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / length(mvPosition.xyz));
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float formation;
        uniform float dissolution;
        uniform float opacity;
        varying float vLife;
        varying float vPhase;
        
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float radius = length(uv);
          
          // Circular particle shape
          if (radius > 0.5) discard;
          
          // Core and glow
          float core = 1.0 - smoothstep(0.0, 0.3, radius);
          float glow = 1.0 - smoothstep(0.0, 0.5, radius);
          
          // Formation/dissolution effects
          float formationAlpha = smoothstep(0.0, 0.3, formation) * smoothstep(1.0, 0.7, dissolution);
          
          // Sparkling effect
          float sparkle = sin(time * 8.0 + vPhase) * 0.3 + 0.7;
          
          // Color based on life and formation
          vec3 formingColor = vec3(0.3, 0.8, 1.0); // Blue while forming
          vec3 formedColor = vec3(1.0, 1.0, 1.0);  // White when formed
          vec3 dissolvingColor = vec3(1.0, 0.5, 0.0); // Orange while dissolving
          
          vec3 color = formingColor;
          if (formation > 0.8 && dissolution < 0.2) {
            color = formedColor;
          } else if (dissolution > 0.2) {
            color = dissolvingColor;
          }
          
          // Apply effects
          color *= (core * 0.8 + glow * 0.4) * sparkle;
          float alpha = formationAlpha * opacity * (core * 0.9 + glow * 0.3);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    })
  }, [])
  
  // Create particle geometry
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const sizes = []
    const lives = []
    const phases = []
    const targetPositions = []
    const velocities = []
    
    textData.particles.forEach(particle => {
      positions.push(...particle.currentPosition)
      targetPositions.push(...particle.targetPosition)
      sizes.push(particle.size)
      lives.push(particle.life)
      phases.push(particle.phase)
      velocities.push(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
    })
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('targetPos', new THREE.Float32BufferAttribute(targetPositions, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('life', new THREE.Float32BufferAttribute(lives, 1))
    geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
    
    return geometry
  }, [textData])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      if (particleMaterial) {
        particleMaterial.uniforms.time.value = time
        
        // Formation cycle: 0-3s formation, 3-8s display, 8-10s dissolution, then repeat
        const cycleTime = time % 12
        
        let formation = 0
        let dissolution = 0
        
        if (cycleTime < 3) {
          // Formation phase
          formation = cycleTime / 3
        } else if (cycleTime < 8) {
          // Display phase
          formation = 1
        } else if (cycleTime < 10) {
          // Dissolution phase
          formation = 1
          dissolution = (cycleTime - 8) / 2
        } else {
          // Reset phase
          formation = 0
          dissolution = 1
        }
        
        particleMaterial.uniforms.formation.value = formation
        particleMaterial.uniforms.dissolution.value = dissolution
      }
      
      // Gentle text group movement
      if (textRef.current) {
        textRef.current.rotation.y = Math.sin(time * 0.2) * 0.1
        textRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      }
    })
  }

  return (
    <group ref={textRef} position={position} scale={scale}>
      {/* Text particles */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      
      {/* Background glow effect */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[6, 2]} />
        <meshBasicMaterial
          color="#003366"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default FloatingText