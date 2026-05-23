'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import LoadingScreen from '@/components/LoadingScreen';
import PaperOverlay from '@/components/PaperOverlay';
import Crosshair from '@/components/Crosshair';
import ProjectModal from '@/components/ProjectModal';
import { projects, Project } from '@/data/projects';
import type { RoomName } from '@/components/Scene';

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomName>('hub');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeVisible, setFadeVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const transitionRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + Math.random() * 15 + 2;
        return next >= 100 ? 100 : next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleRoomChange = useCallback((room: RoomName) => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setFadeVisible(true);
    setTimeout(() => {
      setCurrentRoom(room);
      setTimeout(() => {
        setFadeVisible(false);
        setTimeout(() => {
          transitionRef.current = false;
        }, 200);
      }, 100);
    }, 600);
  }, []);

  const handlePosterClick = useCallback((projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setControlsEnabled(false);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
    setControlsEnabled(true);
  }, []);

  return (
    <>
      {!isLoaded && (
        <LoadingScreen progress={loadingProgress} onComplete={handleLoadingComplete} />
      )}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          opacity: fadeVisible ? 1 : 0,
          pointerEvents: fadeVisible ? 'auto' : 'none',
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 55,
          background: '#fff',
        }}
      />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ fov: 70, near: 0.1, far: 100, position: [0, 1.6, 0] }}
          gl={{ antialias: true }}
          style={{ width: '100%', height: '100%' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#ffffff');
          }}
        >
          <Scene
            currentRoom={currentRoom}
            onRoomChange={handleRoomChange}
            onPosterClick={handlePosterClick}
          />
        </Canvas>
      </div>

      {!controlsEnabled && <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} />}

      <PaperOverlay />
      <Crosshair />

      {controlsEnabled && !isTransitioning && isLoaded && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 45,
            fontFamily: "'Caveat', cursive",
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.7)',
            padding: '4px 16px',
          }}
        >
          WASD to walk · Mouse to look · Click to lock pointer · H to return home
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}
