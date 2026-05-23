import { useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'

interface PosterProps {
  position: [number, number, number]
  title: string
  onClick: () => void
}

export default function Poster({ position, title, onClick }: PosterProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const randomRotX = Math.random() * 0.05

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (e.nativeEvent.target) {
      (e.nativeEvent.target as HTMLElement).style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (e.nativeEvent.target) {
      (e.nativeEvent.target as HTMLElement).style.cursor = 'default'
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        rotation={[randomRotX, 0, 0]}
        position={[0, 0, -0.05]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[0.8, 1.0]} />
        <meshStandardMaterial color="#f5f5f0" side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[randomRotX, 0, 0]} position={[0, 0, -0.05]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.8, 1.0)]} />
        <lineBasicMaterial color="#000000" />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        rotation={[randomRotX, 0, 0]}
        fontSize={0.08}
        maxWidth={0.7}
        color="#000000"
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  )
}
