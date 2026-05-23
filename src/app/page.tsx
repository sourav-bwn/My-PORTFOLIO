'use client';

import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import PaperOverlay from '@/components/PaperOverlay';
import Crosshair from '@/components/Crosshair';
import ProjectModal from '@/components/ProjectModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { projects, Project } from '@/data/projects';
import type { RoomName } from '@/components/Scene';

function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f5f0e8',
      animation: 'fadeOut 0.5s ease 2s forwards',
    }}>
      <div style={{
        width: 2, height: '70%',
        background: 'linear-gradient(to bottom, transparent 0%, #222 10%, #222 90%, transparent 100%)',
        animation: 'crackGrow 1.5s ease-out forwards',
        transformOrigin: 'top',
      }} />
      <div style={{
        fontFamily: "'Caveat','Comic Sans MS',cursive",
        fontSize: 36, color: '#222', marginTop: 16,
      }}>
        loading sketch...
      </div>
    </div>
  );
}

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomName>('hub');
  const [fadeVisible, setFadeVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pointerLocked, setPointerLocked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoadingDone(true), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleLockChange = () => setPointerLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
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
    }
  }, []);

  const requestLock = useCallback(() => {
    const el = document.querySelector('canvas');
    if (el && !document.pointerLockElement) el.requestPointerLock();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e0d0' }}>
      {!loadingDone && <LoadingScreen />}

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        onClick={requestLock}
      >
        <ErrorBoundary>
          <Canvas
            camera={{ fov: 70, near: 0.1, far: 100, position: [0, 1.6, 0] }}
            gl={{ antialias: true, alpha: false }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={["#e8e0d0"]} />
            <Scene
              currentRoom={currentRoom}
              onRoomChange={handleRoomChange}
              onPosterClick={handlePosterClick}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {loadingDone && !pointerLocked && !selectedProject && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 45, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={requestLock}
        >
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 32,
            color: '#fff', background: '#000',
            padding: '16px 48px', border: '3px solid #fff',
            userSelect: 'none',
          }}>
            Click to Explore
          </div>
        </div>
      )}

      <PaperOverlay />
      <Crosshair />

      {pointerLocked && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 45, fontFamily: "'Caveat', cursive", fontSize: 16,
          color: '#666', textAlign: 'center', pointerEvents: 'none',
          background: 'rgba(255,255,255,0.7)', padding: '4px 16px',
        }}>
          WASD to walk · H to return home
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <style>{`
        @keyframes crackGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
