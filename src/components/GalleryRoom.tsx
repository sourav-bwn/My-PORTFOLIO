import * as THREE from 'three'
import { Text } from '@react-three/drei'

export default function GalleryRoom() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[-5, 5, -4]} intensity={0.8} color="#fff5e6" />
      <pointLight position={[5, 5, -4]} intensity={0.8} color="#fff5e6" />
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#f0ede6" />
      </mesh>
      <mesh position={[0, 2, 6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#f0ede6" />
      </mesh>
      <mesh position={[8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#f0ede6" />
      </mesh>
      <mesh position={[-8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#f0ede6" />
      </mesh>
      {[-3, 0, 3].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.5, -5.8]}>
            <boxGeometry args={[1.6, 2.0, 0.08]} />
            <meshStandardMaterial color="#3d2b1f" />
          </mesh>
          <mesh position={[x, 1.5, -5.76]}>
            <planeGeometry args={[1.4, 1.8]} />
            <meshStandardMaterial color="#f5f5f0" />
          </mesh>
          <Text
            position={[x, 0.3, -5.7]}
            fontSize={0.15}
            color="#000"
            anchorX="center"
            anchorY="middle"
          >
            {`Abstract #${i + 1}`}
          </Text>
        </group>
      ))}
    </>
  )
}
