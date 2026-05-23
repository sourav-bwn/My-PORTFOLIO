'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';

function TestBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cc3333" />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <TestBox />
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[5, 0.1, 5]} />
        <meshStandardMaterial color="#d4c5a9" />
      </mesh>
    </>
  );
}

export default function Home() {
  const [show3d, setShow3d] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e0d0' }}>
      {!show3d && (
        <div
          onClick={() => setShow3d(true)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#f5f0e8', cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✎</div>
          <div style={{ fontFamily: "'Caveat','Comic Sans MS',cursive", fontSize: 28, color: '#444', marginBottom: 24 }}>
            Sketch Portfolio
          </div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: '#fff', background: '#000', padding: '12px 36px', userSelect: 'none' }}>
            Click to Enter
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 1, 3] }} style={{ width: '100%', height: '100%', display: 'block' }}>
          <color attach="background" args={["#e8e0d0"]} />
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}
