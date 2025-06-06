<script setup lang="ts">
import { ref, computed } from 'vue'
import { professionalData } from '@/data/professional-data'

const currentTime = ref(new Date())
const terminalCommand = ref('')
const terminalOutput = ref('Welcome to João\'s Development Universe\nType "help" for available commands...')

// Update time every second
setInterval(() => {
  currentTime.value = new Date()
}, 1000)

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const commands = {
  help: () => `Available commands:
  - about: Personal information
  - skills: Technical skills overview
  - projects: Recent projects
  - contact: Contact information
  - clear: Clear terminal
  - version: Current version info`,
  
  about: () => `${professionalData.identity.name}
Location: ${professionalData.identity.location}
Role: Frontend Developer | ${professionalData.currentVersion}
Tags: ${professionalData.identity.tags.join(', ')}`,

  skills: () => professionalData.skills.map(skill => 
    `${skill.name}: ${skill.satellites.join(', ')}`
  ).join('\n'),

  version: () => `Development Universe ${professionalData.currentVersion}
Built with Vue 3 + Quasar + Three.js + GSAP`,

  contact: () => `Email: ${professionalData.identity.email}
GitHub: ${professionalData.identity.github}`,

  clear: () => {
    terminalOutput.value = ''
    return ''
  }
}

const executeCommand = () => {
  const cmd = terminalCommand.value.toLowerCase().trim()
  const output = commands[cmd as keyof typeof commands]?.() || `Command not found: ${cmd}`
  
  if (cmd !== 'clear') {
    terminalOutput.value += `\n$ ${terminalCommand.value}\n${output}`
  }
  
  terminalCommand.value = ''
}
</script>

<template>
  <div 
    class="terminal-header"
    data-component="TerminalHeader"
    data-props="none"
    data-emits="command-executed"
    data-hooks="ref, computed, setInterval"
  >
    <!-- VS Code style header -->
    <div class="terminal-header__titlebar">
      <div class="terminal-header__controls">
        <span class="close"></span>
        <span class="minimize"></span>
        <span class="maximize"></span>
      </div>
      <div class="terminal-header__title">
        joao-dev-universe — Terminal
      </div>
      <div class="terminal-header__time">
        {{ formattedTime }}
      </div>
    </div>

    <!-- Tab bar -->
    <div class="terminal-header__tabs">
      <div class="terminal-header__tab terminal-header__tab--active">
        <i class="fas fa-terminal"></i>
        bash
      </div>
      <div class="terminal-header__tab">
        <i class="fab fa-js-square"></i>
        main.js
      </div>
      <div class="terminal-header__tab">
        <i class="fab fa-vuejs"></i>
        App.vue
      </div>
    </div>

    <!-- Terminal content -->
    <div class="terminal-header__content">
      <div class="terminal-header__output">
        <pre>{{ terminalOutput }}</pre>
      </div>
      
      <div class="terminal-header__input">
        <span class="terminal-header__prompt">joao@dev-universe:~$ </span>
        <input 
          v-model="terminalCommand"
          @keyup.enter="executeCommand"
          class="terminal-header__command"
          placeholder="Type a command..."
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.terminal-header {
  background: $vscode-bg;
  border: 1px solid $vscode-border;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-xl;
  font-family: $font-family-mono;
  overflow: hidden;
  
  @include element('titlebar') {
    background: $vscode-sidebar;
    padding: $spacing-sm $spacing-md;
    @include flex-between;
    border-bottom: 1px solid $vscode-border;
  }
  
  @include element('controls') {
    display: flex;
    gap: $spacing-xs;
    
    span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      cursor: pointer;
      
      &.close { background: #ff5f57; }
      &.minimize { background: #ffbd2e; }
      &.maximize { background: #28ca42; }
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  @include element('title') {
    color: $vscode-text;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  @include element('time') {
    color: $vscode-comment;
    font-size: 0.75rem;
    font-family: $font-family-mono;
  }
  
  @include element('tabs') {
    display: flex;
    background: $vscode-panel;
    border-bottom: 1px solid $vscode-border;
  }
  
  @include element('tab') {
    padding: $spacing-sm $spacing-md;
    color: $vscode-comment;
    font-size: 0.875rem;
    cursor: pointer;
    border-right: 1px solid $vscode-border;
    @include flex-center;
    gap: $spacing-xs;
    transition: all $animation-fast ease;
    
    &:hover {
      background: rgba($primary, 0.1);
      color: $vscode-text;
    }
    
    @include modifier('active') {
      background: $vscode-bg;
      color: $vscode-text;
      border-bottom: 2px solid $primary;
    }
    
    i {
      font-size: 1rem;
    }
  }
  
  @include element('content') {
    padding: $spacing-lg;
    min-height: 200px;
    background: $vscode-bg;
  }
  
  @include element('output') {
    color: $vscode-text;
    font-size: 0.875rem;
    line-height: 1.4;
    margin-bottom: $spacing-md;
    max-height: 150px;
    overflow-y: auto;
    @include custom-scrollbar();
    
    pre {
      margin: 0;
      white-space: pre-wrap;
    }
  }
  
  @include element('input') {
    @include flex-center;
    gap: $spacing-sm;
  }
  
  @include element('prompt') {
    color: $primary;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  @include element('command') {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: $vscode-text;
    font-family: $font-family-mono;
    font-size: 0.875rem;
    
    &::placeholder {
      color: $vscode-comment;
    }
  }
}
</style>