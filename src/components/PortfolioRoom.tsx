import * as THREE from 'three'
import Poster from './Poster'

interface PortfolioRoomProps {
  onPosterClick: (projectId: string) => void
}

export default function PortfolioRoom({ onPosterClick }: PortfolioRoomProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <pointLight position={[-4, 3, -3]} intensity={0.5} color="#ffeedd" />
      <pointLight position={[4, 3, -3]} intensity={0.5} color="#ffeedd" />
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[16, 0.2, 12]} />
        <meshStandardMaterial color="#d4c5a9" />
      </mesh>
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[16, 4, 0.2]} />
        <meshStandardMaterial color="#c4b59a" />
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
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[0, 2.8, -5.5]}>
        <boxGeometry args={[12, 0.02, 0.02]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[-6, 1.55, -5.5]}>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[6, 1.55, -5.5]}>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <Poster
        position={[-3, 1.6, -5.4]}
        title="Weather App"
        onClick={() => onPosterClick('1')}
      />
      <Poster
        position={[0, 1.6, -5.4]}
        title="Task Manager"
        onClick={() => onPosterClick('2')}
      />
      <Poster
        position={[3, 1.6, -5.4]}
        title="Synth Wave"
        onClick={() => onPosterClick('3')}
      />
    </>
  )
}
