import * as THREE from 'three'
import { Text } from '@react-three/drei'
import Door from './Door'

interface HubRoomProps {
  onDoorClick: (roomName: string) => void
}

function Wall({ position, args, color }: { position: [number, number, number]; args: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh>
        <edgesGeometry args={[new THREE.BoxGeometry(args[0], args[1], args[2])]} />
        <lineBasicMaterial color="#000" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default function HubRoom({ onDoorClick }: HubRoomProps) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      <Wall position={[0, -0.1, 0]} args={[20, 0.2, 20]} color="#d4c5a9" />
      <Wall position={[0, 4, 0]} args={[20, 0.2, 20]} color="#e8e0d0" />
      <Wall position={[0, 2, -10]} args={[20, 4, 0.2]} color="#e8e0d0" />
      <Wall position={[0, 2, 10]} args={[20, 4, 0.2]} color="#e8e0d0" />
      <Wall position={[10, 2, 0]} args={[0.2, 4, 20]} color="#e8e0d0" />
      <Wall position={[-10, 2, 0]} args={[0.2, 4, 20]} color="#e8e0d0" />

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#c4b59a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(6, 6)]} />
        <lineBasicMaterial color="#000" transparent opacity={0.2} />
      </mesh>

      <Text position={[0, 3.2, 0]} fontSize={0.5} color="#666" textAlign="center" anchorX="center" anchorY="middle">
        sketch portfolio
      </Text>
      <Text position={[0, 2.7, 0]} fontSize={0.15} color="#999" textAlign="center" anchorX="center" anchorY="middle">
        choose a door to explore
      </Text>

      <Door
        position={[0, 0, -9.5]}
        label="Portfolio"
        onClick={() => onDoorClick('portfolio')}
      />
      <Door
        position={[9.5, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        label=" The Gallery"
        onClick={() => onDoorClick('gallery')}
      />
      <Door
        position={[0, 0, 9.5]}
        rotation={[0, Math.PI, 0]}
        label="The Studio"
        onClick={() => onDoorClick('studio')}
      />
      <Door
        position={[-9.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        label="Contact"
        onClick={() => onDoorClick('contact')}
      />
    </>
  )
}
