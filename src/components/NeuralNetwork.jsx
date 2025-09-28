import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const NeuralNetwork = ({ position = [0, 0, 0], scale = 1, useFrame }) => {
  const networkRef = useRef()
  const nodesRef = useRef()
  const connectionsRef = useRef()
  
  // Generate neural network structure
  const networkData = useMemo(() => {
    const nodes = []
    const connections = []
    const layers = [6, 8, 10, 8, 4] // Network architecture
    
    let nodeId = 0
    const layerNodes = []
    
    // Create nodes for each layer
    layers.forEach((nodeCount, layerIndex) => {
      const layer = []
      for (let i = 0; i < nodeCount; i++) {
        const node = {
          id: nodeId++,
          position: [
            (layerIndex - 2) * 2, // X position based on layer
            (i - nodeCount / 2) * 0.8, // Y position within layer
            (Math.random() - 0.5) * 2 // Random Z for 3D effect
          ],
          layer: layerIndex,
          activation: Math.random(),
          connections: []
        }
        nodes.push(node)
        layer.push(node)
      }
      layerNodes.push(layer)
    })
    
    // Create connections between adjacent layers
    for (let layerIndex = 0; layerIndex < layerNodes.length - 1; layerIndex++) {
      const currentLayer = layerNodes[layerIndex]
      const nextLayer = layerNodes[layerIndex + 1]
      
      currentLayer.forEach(fromNode => {
        nextLayer.forEach(toNode => {
          // Random connection probability for more organic look
          if (Math.random() > 0.3) {
            const connection = {
              from: fromNode.position,
              to: toNode.position,
              weight: (Math.random() - 0.5) * 2,
              active: Math.random() > 0.5
            }
            connections.push(connection)
            fromNode.connections.push(connection)
          }
        })
      })
    }
    
    return { nodes, connections }
  }, [])
  
  // Node material
  const nodeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        activation: { value: 0.5 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        uniform float activation;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          // Pulsing based on activation
          vec3 pos = position * (1.0 + activation * sin(time * 5.0) * 0.3);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float activation;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv - 0.5;
          float radius = length(uv);
          
          // Sphere gradient
          float sphere = 1.0 - smoothstep(0.3, 0.5, radius);
          
          // Activation-based color
          vec3 lowColor = vec3(0.1, 0.1, 0.3); // Dark blue
          vec3 highColor = vec3(0.0, 1.0, 1.0); // Cyan
          vec3 color = mix(lowColor, highColor, activation);
          
          // Pulsing effect
          float pulse = sin(time * 8.0 + activation * 10.0) * 0.3 + 0.7;
          color *= pulse;
          
          // Core glow
          float glow = 1.0 - smoothstep(0.0, 0.3, radius);
          color += glow * vec3(1.0, 1.0, 1.0) * activation * 0.5;
          
          gl_FragColor = vec4(color, sphere * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
  }, [])
  
  // Connection line material
  const connectionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        weight: { value: 1.0 },
        active: { value: 1.0 }
      },
      vertexShader: `
        attribute float position_index;
        varying float vPositionIndex;
        varying vec3 vPosition;
        uniform float time;
        uniform float weight;
        
        void main() {
          vPositionIndex = position_index;
          vPosition = position;
          
          // Add slight wave motion to connections
          vec3 pos = position;
          pos.y += sin(time * 3.0 + position.x * 2.0) * 0.05 * abs(weight);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float weight;
        uniform float active;
        varying float vPositionIndex;
        varying vec3 vPosition;
        
        void main() {
          // Signal traveling along connection
          float signal = sin(time * 5.0 - vPositionIndex * 10.0) * 0.5 + 0.5;
          
          // Weight-based color intensity
          float intensity = abs(weight) * active;
          
          // Color based on weight (positive = green, negative = red)
          vec3 positiveColor = vec3(0.0, 1.0, 0.5);
          vec3 negativeColor = vec3(1.0, 0.2, 0.0);
          vec3 color = weight > 0.0 ? positiveColor : negativeColor;
          
          // Apply signal and intensity
          color *= intensity * (0.5 + signal * 0.8);
          
          // Fade at edges
          float fade = smoothstep(0.0, 0.1, vPositionIndex) * smoothstep(1.0, 0.9, vPositionIndex);
          
          gl_FragColor = vec4(color, fade * intensity * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
  }, [])
  
  if (useFrame) {
    useFrame((state) => {
      const time = state.clock.elapsedTime
      
      // Update node materials
      if (nodesRef.current) {
        nodesRef.current.children.forEach((node, i) => {
          const nodeData = networkData.nodes[i]
          if (nodeData && node.material) {
            // Update activation based on time and position
            const newActivation = 0.3 + Math.sin(time * 2 + nodeData.position[0] * 2 + nodeData.position[1]) * 0.4 + 0.3
            node.material.uniforms.time.value = time
            node.material.uniforms.activation.value = newActivation
            nodeData.activation = newActivation
          }
        })
      }
      
      // Update connection materials
      if (connectionsRef.current) {
        connectionsRef.current.children.forEach((connection, i) => {
          const connData = networkData.connections[i]
          if (connData && connection.material) {
            connection.material.uniforms.time.value = time
            connection.material.uniforms.weight.value = connData.weight
            connection.material.uniforms.active.value = connData.active ? 1.0 : 0.3
          }
        })
      }
      
      // Gentle network rotation
      if (networkRef.current) {
        networkRef.current.rotation.y = time * 0.1
        networkRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      }
    })
  }
  
  // Create connection geometry
  const createConnectionGeometry = (from, to) => {
    const geometry = new THREE.BufferGeometry()
    const points = []
    const indices = []
    
    // Create curved path between nodes
    const numSegments = 20
    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments
      const point = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(...from),
        new THREE.Vector3(...to),
        t
      )
      
      // Add curve
      const curve = Math.sin(t * Math.PI) * 0.2
      point.y += curve
      
      points.push(point.x, point.y, point.z)
      indices.push(t)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('position_index', new THREE.Float32BufferAttribute(indices, 1))
    
    return geometry
  }

  return (
    <group ref={networkRef} position={position} scale={scale}>
      {/* Neural nodes */}
      <group ref={nodesRef}>
        {networkData.nodes.map((node, i) => (
          <mesh key={i} position={node.position} material={nodeMaterial.clone()}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
        ))}
      </group>
      
      {/* Neural connections */}
      <group ref={connectionsRef}>
        {networkData.connections.map((connection, i) => (
          <line key={i} geometry={createConnectionGeometry(connection.from, connection.to)}>
            <primitive object={connectionMaterial.clone()} attach="material" />
          </line>
        ))}
      </group>
    </group>
  )
}

export default NeuralNetwork