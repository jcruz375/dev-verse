<script setup lang="ts">
import { useCustomCursor } from '../composables/useCustomCursor'

const { cursorRef, cursorDotRef, isHoveringTech } = useCustomCursor()
</script>

<template>
  <div class="custom-cursor">
    <div 
      ref="cursorRef" 
      class="custom-cursor__main"
      :class="{ 'custom-cursor__main--hover-tech': isHoveringTech }"
    ></div>
    <div 
      ref="cursorDotRef" 
      class="custom-cursor__dot"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.custom-cursor {
  @include element('main') {
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid $primary;
    border-radius: 50%;
    pointer-events: none;
    z-index: $z-cursor;
    mix-blend-mode: difference;
    transition: all $animation-fast ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    
    @include modifier('hover-tech') {
      background: rgba($primary, 0.2);
      @include neon-glow($primary, 5px);
    }
  }
  
  @include element('dot') {
    position: fixed;
    width: 8px;
    height: 8px;
    background: $primary;
    border-radius: 50%;
    pointer-events: none;
    z-index: $z-cursor - 1;
  }
}

// Particle styles
:global(.cursor-particle) {
  position: fixed;
  pointer-events: none;
  z-index: #{$z-cursor - 2};
}
</style>