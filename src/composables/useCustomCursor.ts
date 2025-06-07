import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

export function useCustomCursor() {
  const cursorRef = ref<HTMLElement>()
  const cursorDotRef = ref<HTMLElement>()
  const isHoveringTech = ref(false)
  // const particles = ref<HTMLElement[]>([])

  let mouseX = 0
  let mouseY = 0
  let cursorX = 0
  let cursorY = 0

  const initCursor = () => {
    if (!cursorRef.value || !cursorDotRef.value) return

    const cursor = cursorRef.value
    const cursorDot = cursorDotRef.value

    const updateCursor = () => {
      // Smooth cursor following
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1

      gsap.set(cursor, {
        x: cursorX - 20,
        y: cursorY - 20
      })

      gsap.set(cursorDot, {
        x: mouseX - 4,
        y: mouseY - 4
      })

      requestAnimationFrame(updateCursor)
    }

    updateCursor()
  }

  const createParticle = (x: number, y: number) => {
    const particle = document.createElement('div')
    particle.className = 'cursor-particle'
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: #64ffda;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
    `
    
    document.body.appendChild(particle)

    gsap.set(particle, { x: x - 2, y: y - 2 })
    
    gsap.to(particle, {
      duration: 1,
      opacity: 0,
      scale: 0,
      ease: "power2.out",
      onComplete: () => {
        particle.remove()
      }
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Create particle trail
    if (Math.random() > 0.8) {
      createParticle(mouseX, mouseY)
    }
  }

  const handleMouseEnterTech = () => {
    isHoveringTech.value = true
    if (cursorRef.value) {
      cursorRef.value.textContent = '👨‍💻'
      gsap.to(cursorRef.value, {
        scale: 1.5,
        duration: 0.2
      })
    }
  }

  const handleMouseLeaveTech = () => {
    isHoveringTech.value = false
    if (cursorRef.value) {
      cursorRef.value.textContent = ''
      gsap.to(cursorRef.value, {
        scale: 1,
        duration: 0.2
      })
    }
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    
    // Add listeners to tech elements
    const techElements = document.querySelectorAll('[data-tech]')
    techElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnterTech)
      el.addEventListener('mouseleave', handleMouseLeaveTech)
    })

    setTimeout(initCursor, 100)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    
    const techElements = document.querySelectorAll('[data-tech]')
    techElements.forEach(el => {
      el.removeEventListener('mouseenter', handleMouseEnterTech)
      el.removeEventListener('mouseleave', handleMouseLeaveTech)
    })
  })

  return {
    cursorRef,
    cursorDotRef,
    isHoveringTech
  }
}