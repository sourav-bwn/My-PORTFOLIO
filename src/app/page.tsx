'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import PaperOverlay from '@/components/PaperOverlay';
import Crosshair from '@/components/Crosshair';
import ProjectModal from '@/components/ProjectModal';
import { projects, Project } from '@/data/projects';

type RoomName = 'hub' | 'portfolio' | 'gallery' | 'studio' | 'contact';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function Home() {
  const [show3d, setShow3d] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomName>('hub');
  const [fadeVisible, setFadeVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEnter = useCallback(() => {
    setShow3d(true);
    setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.requestPointerLock();
    }, 500);
  }, []);

  const handleRoomChange = useCallback((room: RoomName) => {
    setFadeVisible(true);
    setTimeout(() => { setCurrentRoom(room); setTimeout(() => setFadeVisible(false), 200); }, 500);
  }, []);

  const handlePosterClick = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      if (document.pointerLockElement) document.exitPointerLock();
    }
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e0d0' }}>
      {!show3d && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f5f0e8',
        }}>
          <div style={{
            width: 2, height: '70%', background: '#222',
            animation: 'crackAnim 1.5s ease-out forwards',
            transformOrigin: 'top',
          }} />
          <div style={{
            fontFamily: "'Caveat','Comic Sans MS',cursive",
            fontSize: 28, color: '#444', marginTop: 16, marginBottom: 48,
          }}>
            loading sketch...
          </div>
          <div
            style={{
              fontFamily: "'Caveat', cursive", fontSize: 24,
              color: '#fff', background: '#000',
              padding: '12px 40px', cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={handleEnter}
          >
            Click to Enter
          </div>
          <style>{`@keyframes crackAnim{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>
        </div>
      )}

      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ fov: 70, near: 0.1, far: 100, position: [0, 1.6, 0] }}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => gl.setClearColor('#e8e0d0')}
        >
          <Scene
            currentRoom={currentRoom}
            onRoomChange={handleRoomChange}
            onPosterClick={handlePosterClick}
          />
        </Canvas>
      </div>

      {show3d && (
        <>
          <PaperOverlay />
          <Crosshair />
          <div style={{
            position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 45, fontFamily: "'Caveat', cursive", fontSize: 15,
            color: '#666', pointerEvents: 'none', textAlign: 'center',
            background: 'rgba(255,255,255,0.5)', padding: '4px 14px',
          }}>
            Click scene · WASD walk · H hub · Esc free mouse
          </div>
        </>
      )}

      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        opacity: fadeVisible ? 1 : 0, transition: 'opacity 0.6s ease',
        background: '#e8e0d0', zIndex: 55,
      }} />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
