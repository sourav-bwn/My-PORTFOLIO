'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeEngine, RoomName } from '@/lib/ThreeEngine';
import { projects, Project } from '@/data/projects';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== 'ready') return;
    if (engineRef.current) return;

    const engine = new ThreeEngine(canvas);
    engineRef.current = engine;

    engine.setCallbacks({
      onDoorClick: (room: RoomName) => {
        setFadeOut(true);
        setTimeout(() => {
          engine.teleportTo(room);
          setFadeOut(false);
          setFadeIn(true);
          setTimeout(() => setFadeIn(false), 400);
        }, 500);
      },
      onPosterClick: (id: string) => {
        const project = projects.find(p => p.id === id);
        if (project) {
          setSelectedProject(project);
          if (document.pointerLockElement) document.exitPointerLock();
        }
      },
    });

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [phase]);

  const handleCanvasClick = useCallback(() => {
    if (engineRef.current && !engineRef.current.isLocked) {
      const canvas = canvasRef.current;
      if (canvas) canvas.requestPointerLock();
    }
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e8e0d0' }}>
      {phase === 'loading' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f5f0e8',
        }}>
          <div style={{
            width: 2, height: '70%', background: '#222',
            animation: 'crackGrow 1.5s ease-out forwards',
            transformOrigin: 'top',
          }} />
          <div style={{
            fontFamily: "'Caveat','Comic Sans MS',cursive",
            fontSize: 28, color: '#444', marginTop: 16, marginBottom: 40,
          }}>
            loading sketch...
          </div>
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 22,
            color: '#fff', background: '#000',
            padding: '12px 36px', cursor: 'pointer', userSelect: 'none',
          }} onClick={() => setPhase('ready')}>
            Click to Enter
          </div>
          <style>{`@keyframes crackGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        onClick={handleCanvasClick}
      />

      <div className="paper-overlay" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
        opacity: 0.06,
        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px),
                     repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)`,
      }} />

      {phase === 'ready' && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 45, fontFamily: "'Caveat', cursive", fontSize: 15,
          color: '#666', pointerEvents: 'none', textAlign: 'center',
          background: 'rgba(255,255,255,0.5)', padding: '4px 14px',
          transition: 'opacity 0.5s', opacity: selectedProject ? 0 : 1,
        }}>
          Click scene · WASD walk · H hub · Esc free mouse
        </div>
      )}

      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 55,
        background: '#e8e0d0', opacity: fadeOut ? 1 : (fadeIn ? 0 : 0),
        transition: 'opacity 0.5s ease',
      }} />

      {selectedProject && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          fontFamily: "'Caveat', cursive",
        }} onClick={() => setSelectedProject(null)}>
          <div style={{
            background: '#fafaf9', maxWidth: 500, width: '90%',
            maxHeight: '80vh', overflowY: 'auto', padding: 32,
            position: 'relative', cursor: 'default',
            clipPath: 'polygon(0% 0%, 96% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)}
              style={{ position: 'absolute', top: 8, right: 14, background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#000', fontFamily: "'Caveat', cursive" }}>
              ✕
            </button>
            <h2 style={{ fontSize: 30, margin: '0 0 16px', color: '#000', borderBottom: '2px solid #000', paddingBottom: 8, fontWeight: 700 }}>
              {selectedProject.title}
            </h2>
            <p style={{ fontSize: 18, color: '#333', lineHeight: 1.5, marginBottom: 24 }}>
              {selectedProject.description}
            </p>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#000' }}>
              Tech Stack
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {selectedProject.techStack.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', border: '1px solid #000', fontSize: 14, color: '#000' }}>
                  {t}
                </span>
              ))}
            </div>
            <a href={selectedProject.projectUrl || '#'} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '8px 24px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: 18 }}>
              Open Project →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
