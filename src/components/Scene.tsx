import { useRef, useState, useCallback, useEffect } from 'react';
import { Vector3 } from 'three';
import FPSController from './FPSController';
import HubRoom from './HubRoom';
import PortfolioRoom from './PortfolioRoom';
import GalleryRoom from './GalleryRoom';
import StudioRoom from './StudioRoom';
import ContactRoom from './ContactRoom';

export type RoomName = 'hub' | 'portfolio' | 'gallery' | 'studio' | 'contact';

interface SceneProps {
  currentRoom: RoomName;
  onRoomChange: (room: RoomName) => void;
  onPosterClick: (projectId: string) => void;
}

const roomBounds: Record<RoomName, { min: [number, number, number]; max: [number, number, number] }[]> = {
  hub: [
    { min: [-10, 0, -10], max: [-9.5, 4, 10] },
    { min: [9.5, 0, -10], max: [10, 4, 10] },
    { min: [-10, 0, -10], max: [10, 4, -9.5] },
    { min: [-10, 0, 9.5], max: [10, 4, 10] },
  ],
  portfolio: [
    { min: [-8, 0, -6], max: [-7.8, 4, 6] },
    { min: [7.8, 0, -6], max: [8, 4, 6] },
    { min: [-8, 0, -6], max: [8, 4, -5.8] },
    { min: [-8, 0, 5.8], max: [8, 4, 6] },
  ],
  gallery: [
    { min: [-8, 0, -6], max: [-7.8, 4, 6] },
    { min: [7.8, 0, -6], max: [8, 4, 6] },
    { min: [-8, 0, -6], max: [8, 4, -5.8] },
    { min: [-8, 0, 5.8], max: [8, 4, 6] },
  ],
  studio: [
    { min: [-8, 0, -6], max: [-7.8, 4, 6] },
    { min: [7.8, 0, -6], max: [8, 4, 6] },
    { min: [-8, 0, -6], max: [8, 4, -5.8] },
    { min: [-8, 0, 5.8], max: [8, 4, 6] },
  ],
  contact: [
    { min: [-8, 0, -6], max: [-7.8, 4, 6] },
    { min: [7.8, 0, -6], max: [8, 4, 6] },
    { min: [-8, 0, -6], max: [8, 4, -5.8] },
    { min: [-8, 0, 5.8], max: [8, 4, 6] },
  ],
};

const roomSpawns: Record<RoomName, [number, number, number]> = {
  hub: [0, 1.6, 0],
  portfolio: [0, 1.6, 2],
  gallery: [0, 1.6, 2],
  studio: [0, 1.6, 2],
  contact: [0, 1.6, 2],
};

export default function Scene({ currentRoom, onRoomChange, onPosterClick }: SceneProps) {
  const controllerRef = useRef<{ position: Vector3 }>(null);
  const [isLocked, setIsLocked] = useState(false);
  const prevRoom = useRef(currentRoom);

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  useEffect(() => {
    if (prevRoom.current !== currentRoom && controllerRef.current) {
      const spawn = roomSpawns[currentRoom];
      controllerRef.current.position.set(spawn[0], spawn[1], spawn[2]);
    }
    prevRoom.current = currentRoom;
  }, [currentRoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocked) {
        document.exitPointerLock();
      }
      if (e.key === 'h' && currentRoom !== 'hub') {
        onRoomChange('hub');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, currentRoom, onRoomChange]);

  const handleDoorClick = useCallback(
    (roomName: string) => {
      if (roomName === 'portfolio' || roomName === 'gallery' || roomName === 'studio' || roomName === 'contact') {
        onRoomChange(roomName as RoomName);
      }
    },
    [onRoomChange]
  );

  return (
    <>
      <FPSController ref={controllerRef} bounds={roomBounds[currentRoom]} />
      {currentRoom === 'hub' && <HubRoom onDoorClick={handleDoorClick} />}
      {currentRoom === 'portfolio' && <PortfolioRoom onPosterClick={onPosterClick} />}
      {currentRoom === 'gallery' && <GalleryRoom />}
      {currentRoom === 'studio' && <StudioRoom />}
      {currentRoom === 'contact' && <ContactRoom />}
    </>
  );
}
