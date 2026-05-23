import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  progress: number
  onComplete: () => void
}

export default function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setFadingOut(true)
        setTimeout(onComplete, 500)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  const crackHeight = Math.max(2, progress)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f0e8',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
        }}
      >
        <div
          style={{
            width: 2,
            height: `${crackHeight}%`,
            backgroundColor: '#222',
            transition: 'height 0.15s ease-out',
          }}
        />
        <svg width="20" height="10" style={{ marginTop: -1 }}>
          <path d="M0,0 L10,5 L20,0" stroke="#222" strokeWidth="1.5" fill="none" />
          <path d="M10,5 L12,10" stroke="#222" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "'Caveat', 'Comic Sans MS', cursive",
          fontSize: 36,
          color: '#222',
          marginTop: 8,
        }}
      >
        {Math.round(progress)}%
      </div>
      <div
        style={{
          fontFamily: "'Caveat', 'Comic Sans MS', cursive",
          fontSize: 16,
          color: '#888',
          marginTop: 8,
        }}
      >
        loading sketch...
      </div>
    </div>
  )
}
