'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PaperOverlay from '@/components/PaperOverlay';
import Crosshair from '@/components/Crosshair';
import ProjectModal from '@/components/ProjectModal';
import { projects, Project } from '@/data/projects';

type RoomName = 'hub' | 'portfolio' | 'gallery' | 'studio' | 'contact';

const SceneLazy = dynamic(() => import('@/components/Scene'), { ssr: false });

function LoadingScreen({ done }: { done: boolean }) {
  if (done) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f5f0e8',
    }}>
      <div style={{
        width: 2, height: '70%',
        background: '#222',
        animation: 'loadingCrack 1.5s ease-out forwards',
        transformOrigin: 'top',
      }} />
      <div style={{
        fontFamily: "'Caveat','Comic Sans MS',cursive",
        fontSize: 28, color: '#444', marginTop: 16,
      }}>
        loading sketch...
      </div>
      <style>{`@keyframes loadingCrack{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'welcome' | 'exploring'>('loading');
  const [currentRoom, setCurrentRoom] = useState<RoomName>('hub');
  const [fadeVisible, setFadeVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('welcome'), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleLock = () => {
      if (document.pointerLockElement) setPhase('exploring');
    };
    document.addEventListener('pointerlockchange', handleLock);
    return () => document.removeEventListener('pointerlockchange', handleLock);
  }, []);

  const handleClickExplore = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    } else {
      setPhase('exploring');
    }
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
      <LoadingScreen done={phase !== 'loading'} />

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        onClick={handleClickExplore}
      >
        <SceneLazy
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          onPosterClick={handlePosterClick}
        />
      </div>

      {phase === 'welcome' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.25)',
          }}
          onClick={handleClickExplore}
        >
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 48,
            color: '#fff', marginBottom: 8, textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            Sketch Portfolio
          </div>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 20,
            color: 'rgba(255,255,255,0.8)', marginBottom: 32,
          }}>
            a hand-drawn 3D experience
          </div>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 24,
            color: '#fff', background: '#000',
            padding: '12px 40px', border: '2px solid #fff',
            userSelect: 'none',
          }}>
            Click to Enter
          </div>
        </div>
      )}

      <PaperOverlay />
      <Crosshair />

      {phase === 'exploring' && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 45, fontFamily: "'Caveat', cursive", fontSize: 16,
          color: '#666', pointerEvents: 'none',
          background: 'rgba(255,255,255,0.6)', padding: '4px 16px',
        }}>
          WASD to walk · H for hub
        </div>
      )}

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
