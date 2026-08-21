import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Bar({ x, value, color, index }) {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (!mesh.current) return
    const target = value * 1.45
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, target, 4.5 + index * 0.2, delta)
    mesh.current.position.y = mesh.current.scale.y / 2
  })
  return <mesh ref={mesh} position={[x, 0, 0]} scale={[1, .01, 1]} castShadow><boxGeometry args={[.22, 1, .26]}/><meshPhysicalMaterial color={color} roughness={.25} metalness={.12} clearcoat={.4}/></mesh>
}

function Graph({ values, color }) {
  const group = useRef()
  const points = useMemo(() => values.map((value, index) => [(index - (values.length - 1) / 2) * .38, value * 1.45 + .05, .16]), [values])
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.45 + state.pointer.x * .1, 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -.38 - state.pointer.y * .06, 3, delta)
  })
  return <group ref={group} rotation={[-.38, -.45, 0]} position={[0, -.58, 0]}><gridHelper args={[3.2, 8, '#c7d1d0', '#e2e7e6']}/>{values.map((value, index) => <Bar key={index} x={(index - (values.length - 1) / 2) * .38} value={value} color={color} index={index}/>)}<Line points={points} color={color} lineWidth={2.2}/>{points.map((point, index) => <mesh key={index} position={point}><sphereGeometry args={[.055, 16, 16]}/><meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={.65}/></mesh>)}</group>
}

export default function MetricGraph3D({ values, color }) {
  return <div className="metric-graph-3d" aria-hidden="true"><Canvas dpr={[1, 1.5]} orthographic camera={{position:[0,1.7,5],zoom:58}} shadows gl={{antialias:true,alpha:true}}><ambientLight intensity={2}/><directionalLight position={[-2,4,5]} intensity={3.2} castShadow/><pointLight position={[3,1,2]} color={color} intensity={2.2}/><Graph values={values} color={color}/></Canvas></div>
}
