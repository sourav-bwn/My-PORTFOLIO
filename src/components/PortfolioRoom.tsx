import * as THREE from 'three'
import { Text } from '@react-three/drei'
import Poster from './Poster'

interface PortfolioRoomProps {
  onPosterClick: (projectId: string) => void
}

export default function PortfolioRoom({ onPosterClick }: PortfolioRoomProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 8, 0]} intensity={0.7} />
      <pointLight position={[-4, 3, -4]} intensity={0.4} color="#ffeedd" />
      <pointLight position={[4, 3, -4]} intensity={0.4} color="#ffeedd" />

      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#c4b59a" />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#b8a88a" />
      </mesh>
      <mesh position={[0, 2, 6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#c4b59a" />
      </mesh>
      <mesh position={[8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#c4b59a" />
      </mesh>
      <mesh position={[-8, 2, 0]}>
        <boxGeometry args={[0.2, 4, 12]} />
        <meshStandardMaterial color="#c4b59a" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#d4c5a9" />
      </mesh>

      <mesh position={[0, -4.5, -5.9]}>
        <boxGeometry args={[16, 0.2, 0.1]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      <mesh position={[-6, 1.55, -5.5]}>
        <boxGeometry args={[0.06, 2.5, 0.06]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[6, 1.55, -5.5]}>
        <boxGeometry args={[0.06, 2.5, 0.06]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 2.8, -5.48]}>
        <boxGeometry args={[12, 0.03, 0.03]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      <Poster position={[-3, 1.6, -5.35]} title="Weather App" onClick={() => onPosterClick('1')} />
      <Poster position={[0, 1.6, -5.35]} title="Task Manager" onClick={() => onPosterClick('2')} />
      <Poster position={[3, 1.6, -5.35]} title="Synth Wave" onClick={() => onPosterClick('3')} />

      <Text position={[0, 3.5, -5]} fontSize={0.25} color="#444" textAlign="center" anchorX="center" anchorY="middle">
        projects
      </Text>
    </>
  )
}
