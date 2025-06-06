<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue' // ⬅️ Faltava o nextTick aqui
import { useThreeJS } from '@/composables/useThreeJS'
import { professionalData } from '@/data/professional-data'

const containerRef = ref<HTMLElement>()
const { createSkillsVisualization } = useThreeJS(containerRef)

onMounted(async () => {
  await nextTick()
  if (containerRef.value) {
    createSkillsVisualization(professionalData.skills)
  } else {
    console.warn('containerRef not ready')
  }

  console.log('skills recebidas:', professionalData.skills)

})
</script>


<template>
  <div 
    class="skills-orbit"
    data-component="SkillsOrbit"
    data-props="none"
    data-emits="skill-selected"
    data-hooks="ref, onMounted, useThreeJS"
  >
    <div class="skills-orbit__header">
      <h2 class="skills-orbit__title">
        <span class="code keyword">const</span>
        <span class="code variable">skills</span>
        <span class="code"> = </span>
        <span class="code string">"JavaScript Universe"</span>
      </h2>
      <p class="skills-orbit__subtitle">
        Interactive 3D visualization of my technical stack
      </p>
    </div>

    <div 
      ref="containerRef" 
      class="skills-orbit__container"
    ></div>

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
  padding: $spacing-xxl 0;
  
  @include element('header') {
    text-align: center;
    margin-bottom: $spacing-xxl;
    z-index: 10;
    position: relative;
  }
  
  @include element('title') {
    font-size: 2.5rem;
    margin-bottom: $spacing-md;
    font-family: $font-family-mono;
    
    @include mobile {
      font-size: 1.8rem;
    }
  }
  
  @include element('subtitle') {
    color: $vscode-comment;
    font-size: 1.125rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  @include element('container') {
    width: 100%;
    height: 600px;
    position: relative;
    margin-bottom: $spacing-xxl;
    
    @include mobile {
      height: 400px;
    }
  }
  
  @include element('legend') {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;
    max-width: 1000px;
    margin: 0 auto;
    
    @include mobile {
      grid-template-columns: 1fr;
      gap: $spacing-md;
    }
  }
  
  @include element('legend-item') {
    @include glass();
    padding: $spacing-lg;
    border-radius: $border-radius-lg;
    display: flex;
    gap: $spacing-md;
    transition: all $animation-normal ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      @include neon-glow();
    }
  }
  
  @include element('legend-color') {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
    box-shadow: 0 0 10px currentColor;
  }
  
  @include element('legend-content') {
    flex: 1;
  }
  
  @include element('legend-name') {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: $spacing-xs;
    color: $vscode-text;
  }
  
  @include element('legend-satellites') {
    font-size: 0.875rem;
    color: $vscode-comment;
    line-height: 1.4;
  }
}

// Three.js canvas styling
:global(.skills-orbit canvas) {
  border-radius: $border-radius-lg;
  background: radial-gradient(ellipse at center, rgba(100, 255, 218, 0.1) 0%, transparent 70%);
}
</style>