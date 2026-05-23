'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [fadeVisible, setFadeVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pointerLocked, setPointerLocked] = useState(false);

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
    setFadeVisible(true);
    setTimeout(() => {
      setCurrentRoom(room);
      setTimeout(() => setFadeVisible(false), 200);
    }, 500);
  }, []);

  const handlePosterClick = useCallback((projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      if (document.pointerLockElement) document.exitPointerLock();
      setPointerLocked(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useEffect(() => {
    const handleLockChange = () => {
      setPointerLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  return (
    <>
      {!isLoaded && <LoadingScreen progress={loadingProgress} onComplete={handleLoadingComplete} />}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#e8e0d0',
          opacity: fadeVisible ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 55,
        }}
      />

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        onClick={() => {
          const canvas = document.querySelector('canvas');
          if (canvas && !document.pointerLockElement) canvas.requestPointerLock();
        }}
      >
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

      {isLoaded && !pointerLocked && !selectedProject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 45,
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.15)',
          }}
          onClick={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) canvas.requestPointerLock();
          }}
        >
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 32,
              color: '#fff',
              background: '#000',
              padding: '16px 48px',
              border: '3px solid #fff',
              userSelect: 'none',
            }}
          >
            Click to Explore
          </div>
        </div>
      )}

      <PaperOverlay />
      <Crosshair />

      {pointerLocked && (
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
          WASD to walk · H to return home
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}
