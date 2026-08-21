import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function ButtonMesh({ active }) {
  const group = useRef()
  const animationProgress = useRef(1)
  const previousActive = useRef(active)
  const startRotation = useRef(0)
  const targetRotation = useRef(0)
  const serviceColors = ['#17233b', '#ff6b16', '#f9b62b', '#ff6b16', '#f9b62b', '#17233b']
  const activeColor = serviceColors[active] || '#17233b'
  const labelTextures = useMemo(() => {
    const faceColors = ['#009c95', '#ff6b16', '#17233b', '#f9b62b']
    return faceColors.map((color) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 512
      const context = canvas.getContext('2d')
      context.fillStyle = color
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#ffffff'
      context.font = '800 70px Arial, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText('EXPLORE OUR WORKS  >', canvas.width / 2, canvas.height / 2)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      return texture
    })
  }, [active])

  useEffect(() => () => labelTextures.forEach((texture) => texture.dispose()), [labelTextures])

  useEffect(() => {
    if (previousActive.current !== active) {
      previousActive.current = active
      startRotation.current = group.current?.rotation.x || targetRotation.current
      const faceRotation = [0, Math.PI / 2, -Math.PI / 2, Math.PI / 2, -Math.PI / 2, 0][active] || 0
      const fullTurn = Math.PI * 2
      const turns = Math.ceil((startRotation.current + fullTurn - faceRotation) / fullTurn)
      targetRotation.current = faceRotation + turns * fullTurn
      animationProgress.current = 0
    }
  }, [active])

  useFrame((state, delta) => {
    if (!group.current) return
    animationProgress.current = Math.min(1, animationProgress.current + delta / 0.95)
    const progress = animationProgress.current
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2
    group.current.rotation.x = THREE.MathUtils.lerp(startRotation.current, targetRotation.current, eased)
    group.current.rotation.y = -0.16
  })

  return (
    <group ref={group} rotation={[0, -0.16, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.7, 1.7, 1.7]} />
        <meshPhysicalMaterial color={activeColor} roughness={0.24} metalness={0.16} clearcoat={0.42} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.856]}>
        <planeGeometry args={[3.7, 1.7]} />
        <meshBasicMaterial map={labelTextures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.856]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.7, 1.7]} />
        <meshBasicMaterial map={labelTextures[2]} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.856, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.7, 1.7]} />
        <meshBasicMaterial map={labelTextures[1]} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.856, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.7, 1.7]} />
        <meshBasicMaterial map={labelTextures[3]} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function ExploreButton3D({ active }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.15, 5.3], fov: 34 }} shadows gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[-2, 4, 5]} intensity={3.5} castShadow />
      <pointLight position={[3, 1, 3]} color="#fff2d8" intensity={4} />
      <ButtonMesh active={active} />
    </Canvas>
  )
}
