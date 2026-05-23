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
        onComplete()
        setFadingOut(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)',
          width: 2,
          height: `${progress}%`,
          backgroundColor: '#000000',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          marginTop: 8,
          fontFamily: "'Caveat', cursive",
          fontSize: 32,
          color: '#000000',
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  )
}
