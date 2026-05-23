import { useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'

interface DoorProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  label: string
  onClick: () => void
  isInteractable?: boolean
}

export default function Door({ position, rotation = [0, 0, 0], label, onClick, isInteractable = true }: DoorProps) {
  const groupRef = useRef<THREE.Group>(null)

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (isInteractable) onClick()
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (isInteractable && e.nativeEvent.target) {
      (e.nativeEvent.target as HTMLElement).style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (isInteractable && e.nativeEvent.target) {
      (e.nativeEvent.target as HTMLElement).style.cursor = 'default'
    }
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation as unknown as THREE.Euler}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.2, 2.4, 0.1]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
      <mesh>
        <edgesGeometry args={[new THREE.BoxGeometry(1.2, 2.4, 0.1)]} />
        <lineBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.55, -0.4, 0.06]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#b8860b" />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="#000000">
        {label}
      </Text>
    </group>
  )
}
