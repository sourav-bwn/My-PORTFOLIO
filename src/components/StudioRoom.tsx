import * as THREE from 'three'
import { Text } from '@react-three/drei'

const bookColors = ['#444444', '#666666', '#888888', '#555555', '#777777']

export default function StudioRoom() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 2, 6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[-8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[0, 1.1, -0.2]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0.75, 0.3]}>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[1.2, 0.85, 0.5]}>
        <cylinderGeometry args={[0.08, 0.06, 0.15]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh position={[0, 1.5, -5.8]}>
        <boxGeometry args={[3, 2.5, 0.3]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        return (
          <mesh
            key={i}
            position={[-1.1 + col * 0.7, 0.6 + row * 1.0, -5.65]}
          >
            <boxGeometry args={[0.5, 0.7, 0.2]} />
            <meshStandardMaterial color={bookColors[i % bookColors.length]} />
          </mesh>
        )
      })}
      <Text
        position={[0, 3, -5]}
        fontSize={0.3}
        color="#000"
        anchorX="center"
        anchorY="middle"
      >
        The Studio
      </Text>
    </>
  )
}
