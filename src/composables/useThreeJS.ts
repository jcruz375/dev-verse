// useThreeJS.ts
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import { onUnmounted, Ref } from 'vue'
import type { Skill } from '../types/index'

const orbitingPlanets: {
  mesh: THREE.Mesh
  angle: number
  radius: number
}[] = []


export function useThreeJS(containerRef: Ref<HTMLElement | null>) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  let controls: OrbitControls
  let animationFrameId: number

  const init = () => {
    if (!containerRef.value) return

    // Garante que o canvas anterior foi removido (evita duplicação ao trocar de rota)
    if (containerRef.value.contains(renderer.domElement)) {
      containerRef.value.removeChild(renderer.domElement)
    }

    // Renderizador
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.value.appendChild(renderer.domElement)

    // Câmera
    camera.position.set(0, 0, 20)
    camera.lookAt(0, 0, 0)

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Evento resize
    window.addEventListener('resize', handleResize)
  }

  const handleResize = () => {
    if (!containerRef.value) return

    camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)

    console.log('Animando frame...')

  }

  const createSkillsVisualization = (skills: Skill[]) => {
    orbitingPlanets.length = 0
    init()

    // Limpa cena
    while (scene.children.length > 0) {
      scene.remove(scene.children[0])
    }

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 20)
    scene.add(pointLight)

    // Núcleo central (opcional)
    const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const coreMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('#f7df1e') })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(core)

    // Planetas
    // skills.forEach((skill, index) => {
    //   const geometry = new THREE.SphereGeometry(1, 32, 32)
    //   const material = new THREE.MeshStandardMaterial({
    //     color: new THREE.Color(skill.color),
    //     roughness: 0.3,
    //     metalness: 0.1
    //   })

    //   const sphere = new THREE.Mesh(geometry, material)
    //   const angle = (index / skills.length) * Math.PI * 2
    //   const radius = 5 + index * 2


    //   orbitingPlanets.push({ mesh: sphere, angle, radius })
    //   scene.add(sphere)
    // })

    skills.forEach((skill, index) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(skill.color),
        roughness: 0.3,
        metalness: 0.1
      })

      const sphere = new THREE.Mesh(geometry, material)

      // Distribui uniformemente com ângulo + espaçamento de raio
      const angle = (index / skills.length) * Math.PI * 2
      const radius = 6 + index * 2 // 🔧 espaçamento fixo incremental

      // Posição inicial
      sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      )

      orbitingPlanets.push({ mesh: sphere, angle, radius })
      scene.add(sphere)

      // 🐞 DEBUG opcional:
      console.log(`✅ Adicionado: ${skill.name} @ radius: ${radius}`)
    })


    // CHAMAR A ANIMAÇÃO AGORA:
    animate()
  }


  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
    controls?.dispose()
    renderer.dispose()
  })

  return {
    createSkillsVisualization
  }
}
