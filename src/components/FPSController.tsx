import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Vector3 } from 'three'

type Bound = {
  min: [number, number, number]
  max: [number, number, number]
}

const FPSController = forwardRef<{ position: Vector3 }, { bounds?: Bound[] }>(
  ({ bounds = [] }, ref) => {
    const { camera, gl } = useThree()
    const position = useRef(new Vector3(0, 1.6, 0))
    const velocity = useRef(new Vector3())
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false })
    const radius = 0.3

    useImperativeHandle(ref, () => ({ position: position.current }), [])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'KeyW': keys.current.w = true; break
          case 'KeyA': keys.current.a = true; break
          case 'KeyS': keys.current.s = true; break
          case 'KeyD': keys.current.d = true; break
          case 'ShiftLeft':
          case 'ShiftRight': keys.current.shift = true; break
        }
      }
      const handleKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'KeyW': keys.current.w = false; break
          case 'KeyA': keys.current.a = false; break
          case 'KeyS': keys.current.s = false; break
          case 'KeyD': keys.current.d = false; break
          case 'ShiftLeft':
          case 'ShiftRight': keys.current.shift = false; break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }, [])

    useFrame((_, delta) => {
      const { w, a, s, d, shift } = keys.current

      const forward = new Vector3()
      camera.getWorldDirection(forward)
      forward.y = 0
      forward.normalize()

      const right = new Vector3()
      right.crossVectors(forward, new Vector3(0, 1, 0)).normalize()

      const moveDir = new Vector3()
      if (w) moveDir.add(forward)
      if (s) moveDir.sub(forward)
      if (d) moveDir.add(right)
      if (a) moveDir.sub(right)

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize()
      }

      const currentSpeed = shift ? 8 : 4
      velocity.current.copy(moveDir.multiplyScalar(currentSpeed * delta))

      const nextX = position.current.x + velocity.current.x
      const nextZ = position.current.z + velocity.current.z

      let resolvedX = nextX
      let resolvedZ = nextZ

      for (const b of bounds) {
        if (
          resolvedX + radius > b.min[0] &&
          resolvedX - radius < b.max[0] &&
          resolvedZ + radius > b.min[2] &&
          resolvedZ - radius < b.max[2]
        ) {
          if (velocity.current.x > 0) resolvedX = b.min[0] - radius
          else if (velocity.current.x < 0) resolvedX = b.max[0] + radius
        }
      }

      for (const b of bounds) {
        if (
          resolvedX + radius > b.min[0] &&
          resolvedX - radius < b.max[0] &&
          resolvedZ + radius > b.min[2] &&
          resolvedZ - radius < b.max[2]
        ) {
          if (velocity.current.z > 0) resolvedZ = b.min[2] - radius
          else if (velocity.current.z < 0) resolvedZ = b.max[2] + radius
        }
      }

      position.current.x = resolvedX
      position.current.z = resolvedZ
      camera.position.copy(position.current)
    })

    return <PointerLockControls />
  }
)

export default FPSController
