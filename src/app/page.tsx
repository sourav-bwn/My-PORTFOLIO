'use client';

import { useState, useCallback, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import { projects, Project } from '@/data/projects';

type RoomName = 'hub' | 'portfolio' | 'gallery' | 'studio' | 'contact';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e0d0', fontFamily: 'monospace', padding: 32 }}>
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ color: '#c00' }}>3D Error</h2>
            <p style={{ color: '#666', fontSize: 14 }}>{this.state.error}</p>
            <p style={{ color: '#999', fontSize: 12, marginTop: 16 }}>Try a browser with WebGL support (Chrome, Firefox, Edge).</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  const [show3d, setShow3d] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomName>('hub');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEnter = useCallback(() => setShow3d(true), []);

  const handleRoomChange = useCallback((room: RoomName) => {
    setCurrentRoom(room);
  }, []);

  const handlePosterClick = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) setSelectedProject(project);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e0d0' }}>
      {!show3d && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#f5f0e8', cursor: 'pointer',
          }}
          onClick={handleEnter}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✎</div>
          <div style={{
            fontFamily: "'Caveat','Comic Sans MS',cursive",
            fontSize: 28, color: '#444', marginBottom: 24,
          }}>
            Sketch Portfolio
          </div>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 22,
            color: '#fff', background: '#000',
            padding: '12px 36px', userSelect: 'none',
          }}>
            Click to Enter
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <ErrorBoundary>
          <Canvas
            camera={{ fov: 70, near: 0.1, far: 100, position: [0, 1.6, 0] }}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <color attach="background" args={["#e8e0d0"]} />
            <ambientLight intensity={0.5} />
            <Scene
              currentRoom={currentRoom}
              onRoomChange={handleRoomChange}
              onPosterClick={handlePosterClick}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {show3d && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 45, fontFamily: "'Caveat', cursive", fontSize: 15,
          color: '#666', pointerEvents: 'none', textAlign: 'center',
          background: 'rgba(255,255,255,0.5)', padding: '4px 14px',
        }}>
          Click canvas · WASD walk · H hub
        </div>
      )}

      {selectedProject && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
        }}>
          <div style={{
            background: '#fff', padding: 32, maxWidth: 500, width: '90%',
            position: 'relative', fontFamily: "'Caveat', cursive",
          }}>
            <button onClick={() => setSelectedProject(null)}
              style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              ✕
            </button>
            <h2 style={{ fontSize: 28, margin: '0 0 16px' }}>{selectedProject.title}</h2>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.5 }}>{selectedProject.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {selectedProject.techStack.map(t => (
                <span key={t} style={{ border: '1px solid #000', padding: '2px 10px', fontSize: 14 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
