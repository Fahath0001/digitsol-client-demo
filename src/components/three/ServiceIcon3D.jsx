import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const palette = { teal: '#009c95', orange: '#ff6b16', yellow: '#f9b62b' }

function Material({ color }) { return <meshStandardMaterial color={color} roughness={.28} metalness={.18} /> }

function IconGeometry({ type, color }) {
  if (type === 'Digital Strategy') return <group>{[.45,.8,1.15].map((height,index)=><RoundedBox key={height} position={[(index-1)*.48,height/2-.55,0]} args={[.3,height,.3]} radius={.05}><Material color={index===2?'#f9b62b':color}/></RoundedBox>)}</group>
  if (type === 'Branding & Creative') return <group><RoundedBox args={[1.55,1,.48]} radius={.13}><Material color={color}/></RoundedBox><RoundedBox position={[-.55,.48,0]} args={[.48,.25,.38]} radius={.06}><Material color="#f9b62b"/></RoundedBox><mesh position={[.2,0,.34]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.39,.39,.32,32]}/><Material color="#17233b"/></mesh><mesh position={[.2,0,.52]}><circleGeometry args={[.23,32]}/><meshStandardMaterial color="#009c95" roughness={.08} metalness={.3}/></mesh><mesh position={[.58,.48,.04]}><cylinderGeometry args={[.08,.08,.1,20]}/><Material color="#17233b"/></mesh></group>
  if (type === 'Web Experiences') return <group>{[-.42,.42].flatMap((x)=>[-.42,.42].map(y=><RoundedBox key={`${x}${y}`} position={[x,y,0]} args={[.65,.65,.3]} radius={.08}><Material color={x===y?'#f9b62b':color}/></RoundedBox>))}</group>
  if (type === 'Mobile Applications') return <group><RoundedBox args={[.9,1.55,.28]} radius={.14}><Material color={color}/></RoundedBox><mesh position={[0,0,.15]}><planeGeometry args={[.62,1.08]}/><meshStandardMaterial color="#eafffb"/></mesh><mesh position={[0,-.62,.17]}><circleGeometry args={[.06,20]}/><meshBasicMaterial color="#17233b"/></mesh></group>
  if (type === 'Social & Paid Media') return <group rotation={[0,0,-.15]}><mesh rotation={[0,0,-Math.PI/2]}><coneGeometry args={[.58,1.25,4]}/><Material color={color}/></mesh><RoundedBox position={[-.63,-.28,0]} args={[.22,.72,.3]} radius={.05}><Material color="#f9b62b"/></RoundedBox></group>
  return <group><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.55,.12,16,32]}/><Material color={color}/></mesh><RoundedBox position={[.48,-.5,0]} rotation={[0,0,-.75]} args={[.18,.72,.18]} radius={.04}><Material color="#f9b62b"/></RoundedBox><RoundedBox position={[-.42,-.18,.08]} args={[.16,.38,.16]} radius={.03}><Material color="#ff6b16"/></RoundedBox></group>
}

const cubePositions = Array.from({ length: 15 }, (_, index) => [((index % 5) - 2) * .38, (Math.floor(index / 5) - 1) * .38, ((index * 2) % 3 - 1) * .18])
const scatterPositions = Array.from({ length: 15 }, (_, index) => {
  const angle = index * 2.399
  const radius = 1.05 + (index % 4) * .22
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, ((index * 7) % 5 - 2) * .25]
})

function MorphCubes({ cubes }) {
  return <group ref={cubes} scale={0}>{cubePositions.map((position,index)=>{const size=.17+(index%4)*.045;return <RoundedBox key={index} position={position} args={[size,size,size]} radius={size*.28} smoothness={4}><meshStandardMaterial color={['#009c95','#f9b62b','#17233b'][index%3]} roughness={.2} metalness={.14} transparent /></RoundedBox>})}</group>
}

function FloatingCubes({ accent }) {
  const group = useRef()
  const colors = useRef([new THREE.Color(palette[accent]),new THREE.Color('#f9b62b'),new THREE.Color('#17233b')])
  const blend = useRef(0)
  const blendTarget = useRef(0)
  useEffect(() => { colors.current=[new THREE.Color(palette[accent]),new THREE.Color(accent==='teal'?'#f9b62b':'#009c95'),new THREE.Color('#17233b')];blendTarget.current=1;const release=setTimeout(()=>{blendTarget.current=0},760);return()=>clearTimeout(release) },[accent])
  useFrame((state,delta)=>{if(!group.current||document.hidden)return;blend.current=THREE.MathUtils.damp(blend.current,blendTarget.current,5.5,delta);const contraction=1-blend.current*.68;group.current.scale.setScalar(contraction);group.current.rotation.z=Math.sin(state.clock.elapsedTime*.45)*.09+blend.current*.45;group.current.children.forEach((floatGroup,index)=>{floatGroup.traverse(child=>{if(child.material?.color){child.material.color.lerp(colors.current[index%3],Math.min(delta*(blend.current>0.05?5:1.8),1));child.material.transparent=true;child.material.opacity=1-blend.current*.42}})})})
  const items = [[-1.45,.9,.1,.16,'#009c95',1.1],[1.4,.72,-.1,.2,'#ff6b16',1.35],[-1.28,-.82,.2,.12,'#f9b62b',1.55],[1.48,-.68,.15,.14,'#17233b',1.2],[.95,1.3,-.2,.1,'#009c95',1.7]]
  return <group ref={group}>{items.map(([x,y,z,size,color,speed],index)=><Float key={index} speed={speed} rotationIntensity={.75} floatIntensity={.5}><RoundedBox position={[x,y,z]} args={[size,size,size]} radius={size*.22} smoothness={3}><meshStandardMaterial color={color} roughness={.24} metalness={.12}/></RoundedBox></Float>)}</group>
}

function AnimatedIcon({ type, accent, active, hero }) {
  const group = useRef()
  const icon = useRef()
  const cubes = useRef()
  const [displayedType, setDisplayedType] = useState(type)
  const [displayedAccent, setDisplayedAccent] = useState(accent)
  const [phase, setPhase] = useState('idle')
  const targetColor = useRef(new THREE.Color(palette[accent]))
  const targetColors = useRef([new THREE.Color(palette[accent]), new THREE.Color('#f9b62b'), new THREE.Color('#17233b')])
  const iconScaleValue = useRef(1)

  useEffect(() => {
    if (type === displayedType) return
    targetColor.current.set(palette[accent])
    targetColors.current = [new THREE.Color(palette[accent]), new THREE.Color(accent === 'teal' ? '#f9b62b' : '#009c95'), new THREE.Color('#17233b')]
    setPhase('to-cubes')
    const recolor = setTimeout(() => setPhase('recolor'), 380)
    const assemble = setTimeout(() => { setDisplayedType(type); setDisplayedAccent(accent); setPhase('to-icon') }, 760)
    const finish = setTimeout(() => setPhase('idle'), 1250)
    return () => { clearTimeout(recolor); clearTimeout(assemble); clearTimeout(finish) }
  }, [type, accent])

  useFrame((state, delta) => {
    if (!group.current || !icon.current || !cubes.current || document.hidden) return
    const iconTarget = phase === 'idle' || phase === 'to-icon' ? 1 : 0
    const cubeTarget = phase === 'to-cubes' || phase === 'recolor' ? 1 : 0
    iconScaleValue.current = THREE.MathUtils.damp(iconScaleValue.current, iconTarget, 8, delta)
    const iconScale = iconScaleValue.current
    const cubeScale = THREE.MathUtils.damp(cubes.current.scale.x, cubeTarget, 8, delta)
    icon.current.scale.setScalar(iconScale * (hero ? 1.68 : 1))
    cubes.current.scale.setScalar(cubeScale)
    const visibleOpacity = Math.min(iconScale, 1)
    icon.current.traverse(child => { if (child.material) { child.material.transparent = true; child.material.opacity = visibleOpacity } })
    cubes.current.children.forEach((cube,index) => {
      cube.rotation.x += delta * (.7 + index * .025)
      cube.rotation.y += delta * (.55 + index * .02)
      const destination = phase === 'recolor' ? scatterPositions[index] : cubePositions[index]
      cube.position.x = THREE.MathUtils.damp(cube.position.x, destination[0], 4, delta)
      cube.position.y = THREE.MathUtils.damp(cube.position.y, destination[1], 4, delta)
      cube.position.z = THREE.MathUtils.damp(cube.position.z, destination[2], 4, delta)
      if (phase === 'recolor' || phase === 'to-icon') cube.material.color.lerp(targetColors.current[index % 3], Math.min(delta * 4.5, 1))
      cube.material.opacity = cubeScale
    })
    if (!active || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      group.current.rotation.y += (.45 - group.current.rotation.y) * Math.min(delta * 6, 1)
      group.current.rotation.x += (-.18 - group.current.rotation.x) * Math.min(delta * 6, 1)
      group.current.position.y += (0 - group.current.position.y) * Math.min(delta * 6, 1)
      return
    }
    const slowCycle = state.clock.elapsedTime * (Math.PI * 2 / 3)
    const pulse = Math.sin(slowCycle)
    group.current.rotation.y = .45 + pulse * .5
    group.current.rotation.x = -.18 + Math.cos(slowCycle) * .16
    group.current.position.y = Math.max(0,pulse) * .12
  })
  return <group ref={group} rotation={[-.18,.45,0]}><group ref={icon}><IconGeometry type={displayedType} color={palette[displayedAccent]} /></group><MorphCubes cubes={cubes}/></group>
}

export default function ServiceIcon3D({ type, accent, active = false, featured = false, hero = false, journey = false }) {
  return <Canvas dpr={[1,1.5]} camera={{ position:[0,0,journey?7.4:hero?5.5:featured?4.5:4],fov:38 }} gl={{ antialias:true,alpha:true }}><ambientLight intensity={2.2}/><directionalLight position={[2,3,4]} intensity={3}/><AnimatedIcon type={type} accent={accent} active={active} hero={hero}/>{featured&&<FloatingCubes accent={accent}/>}</Canvas>
}
