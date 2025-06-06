<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import type { Skill } from '../types/index'
import { professionalData } from '../data/professional-data'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationId = ref<number | null>(null)
const hoveredSkill = ref<Skill | null>(null)
const hoverPosition = ref({ x: 0, y: 0 })

const center = ref({ x: 0, y: 0 })
const particles = ref<Array<{
  x: number
  y: number
  radius: number
  color: string
  skill: Skill
  orbitRadius: number
  angle: number
  speed: number
}>>([])

const initCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  center.value = {
    x: rect.width / 2,
    y: rect.height / 2
  }

  // Criar partículas (skills exceto "JavaScript")
  const skillsToOrbit = professionalData.skills.filter(s => s.name !== 'JavaScript')
  particles.value = skillsToOrbit.map((skill, index) => {
    const total = skillsToOrbit.length
    const angle = (index * 2 * Math.PI) / total
    const orbitRadius = skill.orbitRadius || 150
    const speed = 0.002 + Math.random() * 0.001

    return {
      x: center.value.x + orbitRadius * Math.cos(angle),
      y: center.value.y + orbitRadius * Math.sin(angle),
      radius: 10 + orbitRadius / 25,
      color: skill.color || '#ffffff',
      skill,
      orbitRadius,
      angle,
      speed: speed * (Math.random() > 0.5 ? 1 : -1)
    }
  })

  startAnimation()
}

const startAnimation = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }

  const animate = () => {
    animationId.value = requestAnimationFrame(animate)
    draw()
  }

  animate()
}

const draw = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx || !center.value.x || !center.value.y) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Fundo com gradiente
  const maxRadius = Math.max(...professionalData.skills.map(s => s.orbitRadius || 0)) + 100
  const gradient = ctx.createRadialGradient(center.value.x, center.value.y, 0, center.value.x, center.value.y, maxRadius)
  gradient.addColorStop(0, 'rgba(100, 255, 218, 0.1)')
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Desenhar órbitas
  ctx.strokeStyle = 'rgba(100, 255, 218, 0.05)'
  ctx.lineWidth = 1
  particles.value.forEach(p => {
    ctx.beginPath()
    ctx.arc(center.value.x, center.value.y, p.orbitRadius, 0, Math.PI * 2)
    ctx.stroke()
  })

  // Desenhar núcleo central (JavaScript)
  const jsSkill = professionalData.skills.find(s => s.name === 'JavaScript')
  if (jsSkill) {
    const r = 14
    ctx.beginPath()
    ctx.arc(center.value.x, center.value.y, r, 0, Math.PI * 2)

    const coreGradient = ctx.createRadialGradient(center.value.x, center.value.y, 0, center.value.x, center.value.y, r)
    coreGradient.addColorStop(0, jsSkill.color || '#ffffff')
    coreGradient.addColorStop(1, 'transparent')

    ctx.fillStyle = coreGradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Atualizar e desenhar partículas orbitando
  particles.value.forEach(p => {
    p.angle += p.speed
    p.x = center.value.x + p.orbitRadius * Math.cos(p.angle)
    p.y = center.value.y + p.orbitRadius * Math.sin(p.angle)

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)

    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
    glow.addColorStop(0, p.color)
    glow.addColorStop(1, 'transparent')

    ctx.fillStyle = glow
    ctx.fill()

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  })

  // Tooltip
  if (hoveredSkill.value && isFinite(hoverPosition.value.x)) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.fillRect(hoverPosition.value.x - 50, hoverPosition.value.y - 40, 100, 30)

    ctx.fillStyle = '#64ffda'
    ctx.font = '14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(hoveredSkill.value.name, hoverPosition.value.x, hoverPosition.value.y - 20)
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  const x = (event.clientX - rect.left) * (canvas.width / rect.width)
  const y = (event.clientY - rect.top) * (canvas.height / rect.height)
  hoverPosition.value = { x, y }
  hoveredSkill.value = null

  particles.value.forEach(p => {
    const dx = x - p.x
    const dy = y - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= p.radius) {
      hoveredSkill.value = p.skill
    }
  })

  // Também detecta hover no centro (JS)
  const js = professionalData.skills.find(s => s.name === 'JavaScript')
  if (js) {
    const dx = x - center.value.x
    const dy = y - center.value.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= 14) {
      hoveredSkill.value = js
    }
  }
}

watchEffect(() => {
  if (canvasRef.value) initCanvas()
})

onMounted(() => {
  window.addEventListener('resize', initCanvas)
})
onUnmounted(() => {
  if (animationId.value) cancelAnimationFrame(animationId.value)
  window.removeEventListener('resize', initCanvas)
})
</script>


<template>
  <div class="skills-orbit">
    <div class="skills-orbit__header">
      <h2 class="skills-orbit__title">
        <span class="code keyword">const </span>
        <span class="code variable">skills</span>
        <span class="code"> = </span>
        <span class="code string">"JavaScript Universe"</span>
      </h2>
      <p class="skills-orbit__subtitle">
        Interactive 2D visualization of my technical stack
      </p>
    </div>

    <div class="skills-orbit__container">
      <canvas 
        ref="canvasRef" 
        class="skills-canvas"
        @mousemove="handleMouseMove"
      ></canvas>
    </div>

    <div class="skills-orbit__legend">
      <div 
        v-for="skill in professionalData.skills" 
        :key="skill.name"
        class="skills-orbit__legend-item"
        :data-tech="skill.name"
      >
        <div 
          class="skills-orbit__legend-color"
          :style="{ backgroundColor: skill.color }"
        ></div>
        <div class="skills-orbit__legend-content">
          <h4 class="skills-orbit__legend-name">{{ skill.name }}</h4>
          <div class="skills-orbit__legend-satellites">
            {{ skill.satellites.join(' • ') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills-orbit {
  position: relative;
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  &__header {
    text-align: center;
    margin-bottom: 2.5rem;
    z-index: 10;
    position: relative;
    padding: 0 1rem;
  }
  
  &__title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: 'Courier New', monospace;
    background: linear-gradient(90deg, #64ffda, #00aaff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 10px rgba(100, 255, 218, 0.2);
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  &__subtitle {
    color: #aaa;
    font-size: 1.25rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  &__container {
    width: 100%;
    height: 500px;
    position: relative;
    margin-bottom: 2.5rem;
    overflow: hidden;
    border-radius: 15px;
    background: radial-gradient(ellipse at center, rgba(100, 255, 218, 0.1) 0%, transparent 70%);
    
    @media (max-width: 768px) {
      height: 400px;
    }
  }
  
  &__legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
  
  &__legend-item {
    background: rgba(25, 25, 50, 0.5);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: 10px;
    display: flex;
    gap: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid rgba(100, 100, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 15px rgba(100, 255, 218, 0.5);
    }
  }
  
  &__legend-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
    box-shadow: 0 0 10px currentColor;
  }
  
  &__legend-content {
    flex: 1;
  }
  
  &__legend-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #fff;
  }
  
  &__legend-satellites {
    font-size: 0.875rem;
    color: #aaa;
    line-height: 1.4;
  }
}

.skills-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.code {
  font-family: 'Courier New', monospace;
  
  &.keyword {
    color: #569cd6;
  }
  
  &.variable {
    color: #9cdcfe;
  }
  
  &.string {
    color: #ce9178;
  }
}
</style>