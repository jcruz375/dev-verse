<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)

// Mock project data
const projects = [
  { name: 'Unilever Interactive Platform', type: 'Vue 3 + Quasar', description: 'Marketing platform with gamification' },
  { name: 'BMG Digital Experience', type: 'React + Next.js', description: 'Banking digital transformation' },
  { name: 'Mondelez Campaign Hub', type: 'Angular + RxJS', description: 'Multi-brand campaign management' },
  { name: 'NeoPDV ERP Cloud', type: 'Vue 2 → Vue 3', description: 'Legacy system migration' },
  { name: 'Flutter Mobile App', type: 'Flutter + Dart', description: 'Native mobile ERP client' },
  { name: 'E-commerce Platform', type: 'Next.js + Node.js', description: 'Full-stack e-commerce solution' }
]

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects
  
  return projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openPalette = () => {
  isOpen.value = true
  selectedIndex.value = 0
  setTimeout(() => {
    const input = document.querySelector('.command-palette__input') as HTMLInputElement
    input?.focus()
  }, 100)
}

const closePalette = () => {
  isOpen.value = false
  searchQuery.value = ''
  selectedIndex.value = 0
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  
  switch (e.key) {
    case 'Escape':
      closePalette()
      break
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredProjects.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      selectProject(filteredProjects.value[selectedIndex.value])
      break
  }
}

const selectProject = (project: typeof projects[0]) => {
  $q.notify({
    message: `Selected: ${project.name}`,
    caption: project.description,
    color: 'primary',
    icon: 'fas fa-rocket'
  })
  closePalette()
}

// const handleGlobalKeydown = (e: KeyboardEvent) => {
//   // This will be triggered by the custom event from useKeyboardShortcuts
// }

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('open-command-palette', openPalette)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('open-command-palette', openPalette)
})
</script>

<template>
  <q-dialog 
    v-model="isOpen" 
    class="command-palette-dialog"
    position="top"
    @hide="closePalette"
  >
    <div 
      class="command-palette"
      data-component="CommandPalette"
      data-props="none"
      data-emits="project-selected"
      data-hooks="ref, computed, onMounted, onUnmounted"
    >
      <div class="command-palette__header">
        <i class="fas fa-search command-palette__search-icon"></i>
        <input
          v-model="searchQuery"
          class="command-palette__input"
          placeholder="Search projects, technologies, or descriptions..."
          @input="selectedIndex = 0"
        />
        <div class="command-palette__shortcut">
          <kbd>Ctrl</kbd>+<kbd>P</kbd>
        </div>
      </div>

      <div class="command-palette__results" v-if="filteredProjects.length">
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.name"
          class="command-palette__result"
          :class="{ 'command-palette__result--selected': index === selectedIndex }"
          @click="selectProject(project)"
          @mouseenter="selectedIndex = index"
        >
          <div class="command-palette__result-main">
            <div class="command-palette__result-name">
              <i class="fas fa-folder-open"></i>
              {{ project.name }}
            </div>
            <div class="command-palette__result-type">
              {{ project.type }}
            </div>
          </div>
          <div class="command-palette__result-description">
            {{ project.description }}
          </div>
        </div>
      </div>

      <div class="command-palette__empty" v-else>
        <i class="fas fa-search"></i>
        <p>No projects found for "{{ searchQuery }}"</p>
        <p class="command-palette__empty-hint">
          Try searching for Vue, React, Flutter, or other technologies
        </p>
      </div>

      <div class="command-palette__footer">
        <div class="command-palette__hint">
          <kbd>↑</kbd><kbd>↓</kbd> to navigate
        </div>
        <div class="command-palette__hint">
          <kbd>Enter</kbd> to select
        </div>
        <div class="command-palette__hint">
          <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.command-palette {
  background: $vscode-bg;
  border: 1px solid $vscode-border;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-xl;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  font-family: $font-family-mono;
  
  @include element('header') {
    padding: $spacing-lg;
    border-bottom: 1px solid $vscode-border;
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
  
  @include element('search-icon') {
    color: $vscode-comment;
    font-size: 1.125rem;
  }
  
  @include element('input') {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: $vscode-text;
    font-size: 1rem;
    font-family: $font-family-mono;
    
    &::placeholder {
      color: $vscode-comment;
    }
  }
  
  @include element('shortcut') {
    display: flex;
    gap: 2px;
    
    kbd {
      background: $vscode-panel;
      border: 1px solid $vscode-border;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      color: $vscode-comment;
      font-family: $font-family-mono;
    }
  }
  
  @include element('results') {
    max-height: 400px;
    overflow-y: auto;
    @include custom-scrollbar();
  }
  
  @include element('result') {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid rgba($vscode-border, 0.3);
    cursor: pointer;
    transition: all $animation-fast ease;
    
    &:hover,
    &--selected {
      background: rgba($primary, 0.1);
      border-left: 3px solid $primary;
    }
  }
  
  @include element('result-main') {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xs;
  }
  
  @include element('result-name') {
    color: $vscode-text;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    i {
      color: $primary;
      width: 16px;
    }
  }
  
  @include element('result-type') {
    color: $secondary;
    font-size: 0.875rem;
    background: rgba($secondary, 0.1);
    padding: 2px 8px;
    border-radius: $border-radius-sm;
    border: 1px solid rgba($secondary, 0.3);
  }
  
  @include element('result-description') {
    color: $vscode-comment;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  @include element('empty') {
    padding: $spacing-xxl;
    text-align: center;
    color: $vscode-comment;
    
    i {
      font-size: 2rem;
      margin-bottom: $spacing-md;
      opacity: 0.5;
    }
    
    p {
      margin-bottom: $spacing-sm;
      
      &:first-of-type {
        color: $vscode-text;
        font-weight: 500;
      }
    }
  }
  
  @include element('empty-hint') {
    font-size: 0.875rem;
    opacity: 0.7;
  }
  
  @include element('footer') {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $vscode-border;
    background: $vscode-sidebar;
    display: flex;
    gap: $spacing-lg;
  }
  
  @include element('hint') {
    color: $vscode-comment;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
    
    kbd {
      background: $vscode-panel;
      border: 1px solid $vscode-border;
      border-radius: 3px;
      padding: 1px 4px;
      font-size: 0.625rem;
      font-family: $font-family-mono;
    }
  }
}

// Dialog overlay styling
:global(.command-palette-dialog .q-dialog__inner) {
  padding-top: 10vh;
}
</style>