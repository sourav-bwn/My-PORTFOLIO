import * as THREE from 'three'
import { Text } from '@react-three/drei'

export default function ContactRoom() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[0, 2, 6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[-8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <Text
        position={[0, 2.5, -5.5]}
        fontSize={0.4}
        color="#000"
        anchorX="center"
        anchorY="middle"
      >
        Contact
      </Text>
      {[
        { y: 1.8, label: 'email@example.com' },
        { y: 1.2, label: '@handle' },
        { y: 0.6, label: 'github.com/user' },
      ].map((card, i) => (
        <group key={i}>
          <mesh position={[0, card.y, -5.5]}>
            <planeGeometry args={[1.2, 0.4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <lineSegments position={[0, card.y, -5.5]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.4)]} />
            <lineBasicMaterial color="#000" />
          </lineSegments>
          <Text
            position={[0, card.y, -5.3]}
            fontSize={0.08}
            color="#000"
            anchorX="center"
            anchorY="middle"
          >
            {card.label}
          </Text>
        </group>
      ))}
      <mesh position={[0, 0.15, 2]}>
        <boxGeometry args={[1.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[-0.7, -0.05, 2]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[0.7, -0.05, 2]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
    </>
  )
}
