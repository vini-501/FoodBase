"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment, Float } from "@react-three/drei"
import * as THREE from "three"

function FoodItem({ position, rotation, scale, url, speed = 0.5 }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005 * speed
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.002 * speed
    }
  })

  const { scene } = useGLTF(url)

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive ref={ref} object={scene} position={position} rotation={rotation} scale={scale} />
    </Float>
  )
}

function SpicePowder({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()

  useEffect(() => {
    if (!mesh.current) return

    const tempObject = new THREE.Object3D()
    const colors = [
      new THREE.Color("#ffa500"), // Orange (turmeric)
      new THREE.Color("#ff4500"), // Red (chili)
      new THREE.Color("#ffff00"), // Yellow (curry)
      new THREE.Color("#8b4513"), // Brown (garam masala)
      new THREE.Color("#228b22"), // Green (coriander)
    ]

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2
      const y = (Math.random() - 0.5) * viewport.height * 2
      const z = (Math.random() - 0.5) * 10

      tempObject.position.set(x, y, z)
      tempObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      const scale = Math.random() * 0.1 + 0.05
      tempObject.scale.set(scale, scale, scale)
      tempObject.updateMatrix()

      mesh.current.setMatrixAt(i, tempObject.matrix)

      // Set random colors
      mesh.current.setColorAt(i, colors[Math.floor(Math.random() * colors.length)])
    }

    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [count, viewport])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.8} metalness={0.2} />
    </instancedMesh>
  )
}

function SouthIndianPlate() {
  const plateRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (plateRef.current) {
      plateRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={plateRef} position={[0, 0, -2]}>
      {/* Banana Leaf Plate */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#1a5e1a" roughness={0.8} />
      </mesh>

      {/* Rice */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#f5f5f5" roughness={1} />
      </mesh>

      {/* Sambar */}
      <mesh position={[-1.2, 0.1, 0.5]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      {/* Chutney 1 */}
      <mesh position={[1.2, 0.1, 0.5]}>
        <cylinderGeometry args={[0.3, 0.4, 0.15, 32]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>

      {/* Chutney 2 */}
      <mesh position={[0.7, 0.1, -0.7]}>
        <cylinderGeometry args={[0.3, 0.4, 0.15, 32]} />
        <meshStandardMaterial color="#FF6347" roughness={0.7} />
      </mesh>

      {/* Papadum */}
      <mesh position={[-0.7, 0.1, -0.7]} rotation={[Math.PI / 2 - 0.3, 0, Math.PI / 4]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#F5DEB3" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function FoodBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach="background" args={["#fff8e1"]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <SouthIndianPlate />
      <SpicePowder count={200} />

      {/* Floating food items */}
      <group position={[0, 0, 0]}>
        {/* Dosa */}
        <mesh position={[-3, 1, -2]} rotation={[-Math.PI / 3, 0, Math.PI / 4]} scale={[2, 0.1, 1.5]}>
          <cylinderGeometry args={[1, 1, 1, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#e6d2a8" side={THREE.DoubleSide} roughness={0.8} />
        </mesh>

        {/* Idli */}
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh position={[3, 1.5, -3]} rotation={[Math.PI / 6, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
          </mesh>
        </Float>

        {/* Vada */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[2.5, -1.5, -2]}>
            <torusGeometry args={[0.5, 0.25, 16, 32]} />
            <meshStandardMaterial color="#d4a76a" roughness={0.7} />
          </mesh>
        </Float>

        {/* Coconut */}
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[-2.5, -1.2, -1]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
        </Float>
      </group>

      <Environment preset="sunset" />

      {/* Disable controls for better performance on login page */}
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Canvas>
  )
}
