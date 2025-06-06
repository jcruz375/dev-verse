import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

export function useKeyboardShortcuts() {
  const router = useRouter()

  const shortcuts = {
    'ctrl+d': () => {
      toggleDeveloperMode()
    },
    'ctrl+h': () => {
      toggleTimeline()
    },
    'ctrl+p': () => {
      openCommandPalette()
    }
  }

  const toggleDeveloperMode = () => {
    const devMode = document.body.classList.toggle('dev-mode')
    
    if (devMode) {
      Notify.create({
        message: 'Modo Desenvolvedor Ativado',
        caption: 'Props, emits e hooks agora são visíveis',
        color: 'positive',
        icon: 'code',
        position: 'top'
      })
      
      // Add dev info to components
      document.querySelectorAll('[data-component]').forEach(el => {
        const componentName = el.getAttribute('data-component')
        const devInfo = document.createElement('div')
        devInfo.className = 'dev-info'
        devInfo.innerHTML = `
          <div class="component-name">${componentName}</div>
          <div class="component-details">
            <span>Props: ${el.getAttribute('data-props') || 'none'}</span>
            <span>Emits: ${el.getAttribute('data-emits') || 'none'}</span>
            <span>Hooks: ${el.getAttribute('data-hooks') || 'none'}</span>
          </div>
        `
        el.appendChild(devInfo)
      })
    } else {
      Notify.create({
        message: 'Modo Desenvolvedor Desativado',
        color: 'info',
        icon: 'visibility_off',
        position: 'top'
      })
      
      // Remove dev info
      document.querySelectorAll('.dev-info').forEach(el => el.remove())
    }
  }

  const toggleTimeline = () => {
    const timelineElement = document.querySelector('[data-timeline]')
    if (timelineElement) {
      const isEducation = timelineElement.classList.toggle('education-mode')
      
      Notify.create({
        message: isEducation ? 'Mostrando Timeline Educacional' : 'Mostrando Timeline Profissional',
        color: 'accent',
        icon: isEducation ? 'school' : 'work',
        position: 'top'
      })
    }
  }

  const openCommandPalette = () => {
    const event = new CustomEvent('open-command-palette')
    document.dispatchEvent(event)
    
    Notify.create({
      message: 'Command Palette Aberto',
      caption: 'Digite para buscar projetos',
      color: 'primary',
      icon: 'search',
      position: 'top'
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = []
    
    if (e.ctrlKey) key.push('ctrl')
    if (e.shiftKey) key.push('shift')
    if (e.altKey) key.push('alt')
    if (e.metaKey) key.push('meta')
    
    key.push(e.key.toLowerCase())
    
    const shortcut = key.join('+')
    
    if (shortcuts[shortcut as keyof typeof shortcuts]) {
      e.preventDefault()
      shortcuts[shortcut as keyof typeof shortcuts]()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    shortcuts,
    toggleDeveloperMode,
    toggleTimeline,
    openCommandPalette
  }
}