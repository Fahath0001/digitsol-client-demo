import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, RoundedBox, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const modelUrl = `${import.meta.env.BASE_URL}models/digitsol-glass-city-hero.glb`

function AccentCube({ position, color, size = .18, speed = 1.3 }) {
  return <Float speed={speed} rotationIntensity={.22} floatIntensity={.38}><RoundedBox position={position} args={[size, size, size]} radius={.025} smoothness={2} castShadow><meshPhysicalMaterial color={color} roughness={.22} metalness={.05} /></RoundedBox></Float>
}

function CameraModel({ cameraRef }) {
  return <group ref={cameraRef} scale={1} visible={false} position={[0, -.05, 0]}>
    <RoundedBox args={[3.25, 2, 1.18]} radius={.18} smoothness={4} castShadow receiveShadow><meshPhysicalMaterial color="#17233b" roughness={.25} metalness={.38} /></RoundedBox>
    <RoundedBox position={[-1.36, -.12, .18]} args={[.7, 1.75, 1.12]} radius={.15} smoothness={4} castShadow><meshPhysicalMaterial color="#009c95" roughness={.3} /></RoundedBox>
    <RoundedBox position={[-.42, 1.08, -.08]} args={[1.05, .35, .72]} radius={.09} smoothness={3} castShadow><meshPhysicalMaterial color="#24324a" roughness={.24} metalness={.3} /></RoundedBox>
    <mesh position={[.55, .02, .82]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.92, .92, .72, 48]} /><meshPhysicalMaterial color="#111a28" roughness={.15} metalness={.55} /></mesh>
    <mesh position={[.55, .02, 1.22]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.66, .78, .4, 48]} /><meshPhysicalMaterial color="#263c4d" roughness={.08} metalness={.65} /></mesh>
    <mesh position={[.55, .02, 1.44]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.48, .58, .08, 48]} /><meshPhysicalMaterial color="#07131e" roughness={.05} metalness={.2} transmission={.22} /></mesh>
    <mesh position={[.55, .02, 1.49]}><circleGeometry args={[.34, 48]} /><meshPhysicalMaterial color="#009c95" roughness={.05} metalness={.25} transparent opacity={.72} /></mesh>
    <mesh position={[1.12, 1.06, .12]} castShadow><cylinderGeometry args={[.16, .16, .11, 24]} /><meshPhysicalMaterial color="#ff6b16" roughness={.25} /></mesh>
    <mesh position={[-.62, 1.24, .12]} castShadow><cylinderGeometry args={[.24, .24, .12, 32]} /><meshPhysicalMaterial color="#f9b62b" roughness={.25} metalness={.2} /></mesh>
    <mesh position={[1.25, .58, .61]}><circleGeometry args={[.13, 24]} /><meshBasicMaterial color="#f9b62b" /></mesh>
  </group>
}

const cameraBlockPositions = Array.from({ length: 24 }, (_, index) => {
  const col = index % 6
  const row = Math.floor(index / 6)
  return new THREE.Vector3((col - 2.5) * .48, (row - 1.5) * .48, (index % 3 - 1) * .2)
})
const cityBlockPositions = Array.from({ length: 24 }, (_, index) => {
  const col = index % 5
  const row = Math.floor(index / 5)
  const height = ((col * 3 + row * 2) % 5) * .24
  return new THREE.Vector3((col - 2) * .55, -1 + row * .34 + height, ((index * 2) % 4 - 1.5) * .32)
})
const blockColors = ['#009c95', '#ff6b16', '#f9b62b', '#17233b', '#9fa9ad']

function TransitionBlocks({ blocksRef }) {
  return <group ref={blocksRef} visible={false}>{cameraBlockPositions.map((_, index) => <RoundedBox key={index} args={[.25, .25, .25]} radius={.025} smoothness={2} castShadow><meshPhysicalMaterial color={blockColors[index % blockColors.length]} roughness={.25} metalness={.08} transparent opacity={index % 5 === 4 ? .62 : 1} /></RoundedBox>)}</group>
}

function GlassCity({ reduced }) {
  const root = useRef()
  const cityRef = useRef()
  const cameraRef = useRef()
  const blocksRef = useRef()
  const targetMorph = useRef(reduced ? 1 : 0)
  const nextMorph = useRef(reduced ? 1 : 0)
  const transitionStart = useRef(-1)
  const targetRotation = useRef(.28)
  const lastChange = useRef(0)
  const lastInteraction = useRef(0)
  const clockTime = useRef(0)
  const dragging = useRef(false)
  const pointerX = useRef(0)
  const { scene } = useGLTF(modelUrl)
  const { model, scale, position } = useMemo(() => {
    const clone = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(clone)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const normalizedScale = 4.25 / Math.max(size.x, size.y, size.z, 1)
    return { model: clone, scale: normalizedScale, position: center.multiplyScalar(-normalizedScale) }
  }, [scene])

  useEffect(() => {
    model.traverse(child => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) child.material.needsUpdate = true
    })
  }, [model])

  useFrame((state, delta) => {
    if (!root.current || !cityRef.current || !cameraRef.current || !blocksRef.current || document.hidden) return
    const elapsed = state.clock.elapsedTime
    clockTime.current = elapsed
    if (!reduced && transitionStart.current < 0 && !dragging.current && elapsed - lastInteraction.current >= 5 && elapsed - lastChange.current >= 5) {
      nextMorph.current = targetMorph.current ? 0 : 1
      targetRotation.current += Math.PI / 2
      transitionStart.current = elapsed
    }
    if (transitionStart.current >= 0) {
      const rawProgress = Math.min((elapsed - transitionStart.current) / 1.6, 1)
      const progress = THREE.MathUtils.smoothstep(rawProgress, 0, 1)
      cityRef.current.visible = false
      cameraRef.current.visible = false
      blocksRef.current.visible = true
      const from = nextMorph.current ? cityBlockPositions : cameraBlockPositions
      const to = nextMorph.current ? cameraBlockPositions : cityBlockPositions
      blocksRef.current.children.forEach((block, index) => {
        block.position.lerpVectors(from[index], to[index], progress)
        block.rotation.set(progress * Math.PI * (index % 2 ? 1 : -1), progress * Math.PI * .75, 0)
      })
      if (rawProgress === 1) {
        targetMorph.current = nextMorph.current
        transitionStart.current = -1
        lastChange.current = elapsed
        blocksRef.current.visible = false
      }
    } else {
      cityRef.current.visible = targetMorph.current === 0
      cameraRef.current.visible = targetMorph.current === 1
      blocksRef.current.visible = false
    }
    const transition = reduced ? 1 : targetMorph.current
    cityRef.current.scale.setScalar(.72)
    cityRef.current.rotation.y = 0
    cameraRef.current.scale.setScalar(1)
    const frontFacingRotation = -root.current.rotation.y + .12
    cameraRef.current.rotation.y = THREE.MathUtils.lerp(.55, frontFacingRotation, transition)
    cameraRef.current.rotation.z = (1 - transition) * -.12
    if (reduced) return
    const holdProgress = Math.min(Math.max((elapsed - lastChange.current) / 5, 0), 1)
    const holdRotation = dragging.current ? 0 : holdProgress * (Math.PI / 4)
    const targetY = targetRotation.current + holdRotation + state.pointer.x * .08 + Math.sin(elapsed * .22) * .025
    const targetX = .055 - state.pointer.y * .045
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, dragging.current ? 12 : 2.4, delta)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetX, 2.4, delta)
    root.current.position.y = -.15 + Math.sin(state.clock.elapsedTime * .65) * .035
  })

  const startDrag = event => {
    event.stopPropagation()
    dragging.current = true
    pointerX.current = event.clientX
    lastInteraction.current = clockTime.current
    event.nativeEvent?.target?.setPointerCapture?.(event.pointerId)
  }
  const moveDrag = event => {
    if (!dragging.current) return
    const deltaX = event.clientX - pointerX.current
    pointerX.current = event.clientX
    targetRotation.current += deltaX * .012
    lastInteraction.current = clockTime.current
  }
  const stopDrag = event => {
    dragging.current = false
    lastInteraction.current = clockTime.current
    lastChange.current = clockTime.current
    event.nativeEvent?.target?.releasePointerCapture?.(event.pointerId)
  }

  return <group ref={root} rotation={[.055, .28, 0]} position={[.2, -.15, 0]} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
    <group ref={cityRef} scale={.72}><primitive object={model} scale={scale} position={position} /></group>
    <CameraModel cameraRef={cameraRef} />
    <TransitionBlocks blocksRef={blocksRef} />
    {!reduced && <><AccentCube position={[-2.05, 1.2, -.35]} color="#009c95" size={.15} speed={1.2} /><AccentCube position={[-1.75, .45, .5]} color="#ff6b16" size={.13} speed={1.6} /><AccentCube position={[1.95, 1.28, -.4]} color="#f9b62b" size={.24} speed={1.35} /><AccentCube position={[2.2, .4, .35]} color="#ff6b16" size={.16} speed={1.7} /><AccentCube position={[-1.5, 1.65, -.55]} color="#17233b" size={.1} speed={1.45} /></>}
  </group>
}

function StaticFallback() { return <div className="scene-fallback" aria-hidden="true"><i /><i /><i /><i /><i /></div> }

export default function HeroScene() {
  const reduced = useReducedMotion()
  let webgl = true
  try { const canvas = document.createElement('canvas'); webgl = !!(canvas.getContext('webgl2') || canvas.getContext('webgl')) } catch { webgl = false }
  if (!webgl) return <StaticFallback />
  return <div className="scene-wrap scene-interactive" role="img" aria-label="Drag to rotate the animated glass city and three-dimensional camera"><Suspense fallback={<StaticFallback />}><Canvas dpr={[1, 1.5]} camera={{ position: [5.1, 3.15, 7.2], fov: 34 }} shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}><ambientLight intensity={1.65} /><hemisphereLight args={['#ffffff', '#8a969b', 1.2]} /><directionalLight position={[4, 7, 5]} intensity={3.5} castShadow shadow-mapSize={[1024, 1024]} /><pointLight position={[-4, 2, 4]} color="#d8fffb" intensity={8} /><GlassCity reduced={reduced} /><ContactShadows position={[0, -2.18, 0]} opacity={.26} scale={7} blur={2.6} far={5} /></Canvas></Suspense></div>
}

useGLTF.preload(modelUrl)
