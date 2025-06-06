<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { professionalData } from '@/data/professional-data'

gsap.registerPlugin(ScrollTrigger)

const timelineRef = ref<HTMLElement>()
const isEducationMode = ref(false)

const animateTimeline = () => {
  if (!timelineRef.value) return

  const items = timelineRef.value.querySelectorAll('.timeline-item')
  
  items.forEach((item, index) => {
    gsap.fromTo(item, 
      {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        scale: 0.8
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })
}

const triggerGlitch = (element: HTMLElement) => {
  element.classList.add('glitch')
  setTimeout(() => {
    element.classList.remove('glitch')
  }, 500)
}

onMounted(() => {
  setTimeout(animateTimeline, 100)
})
</script>

<template>
  <div 
    class="timeline-visualization"
    data-component="TimelineVisualization"
    data-props="none"
    data-emits="timeline-changed"
    data-hooks="ref, onMounted, gsap, ScrollTrigger"
    data-timeline
  >
    <div class="timeline-visualization__header">
      <h2 class="timeline-visualization__title">
        <span class="code keyword">git</span>
        <span class="code"> log --oneline</span>
      </h2>
      <p class="timeline-visualization__subtitle">
        Professional journey through major releases
      </p>
    </div>

    <div 
      ref="timelineRef"
      class="timeline-visualization__container"
    >
      <div class="timeline-visualization__line"></div>
      
      <div 
        v-for="(event, index) in professionalData.timeline"
        :key="event.version"
        class="timeline-item"
        :class="{
          'timeline-item--left': index % 2 === 0,
          'timeline-item--right': index % 2 === 1
        }"
        @click="triggerGlitch($event.currentTarget as HTMLElement)"
      >
        <div class="timeline-item__marker">
          <div class="timeline-item__version">{{ event.version }}</div>
        </div>
        
        <div class="timeline-item__content">
          <div class="timeline-item__year">{{ event.year }}</div>
          <h3 class="timeline-item__label">{{ event.label }}</h3>
          
          <div class="timeline-item__highlights">
            <div 
              v-for="highlight in event.highlights"
              :key="highlight"
              class="timeline-item__highlight"
            >
              <i class="fas fa-code"></i>
              {{ highlight }}
            </div>
          </div>
          
          <div class="timeline-item__commit">
            <i class="fab fa-git-alt"></i>
            <span class="code">
              git commit -m "{{ event.label }}"
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-visualization__stats">
      <div class="timeline-visualization__stat">
        <div class="timeline-visualization__stat-number">{{ professionalData.timeline.length }}</div>
        <div class="timeline-visualization__stat-label">Major Releases</div>
      </div>
      
      <div class="timeline-visualization__stat">
        <div class="timeline-visualization__stat-number">
          {{ new Date().getFullYear() - professionalData.timeline[0].year }}
        </div>
        <div class="timeline-visualization__stat-label">Years Active</div>
      </div>
      
      <div class="timeline-visualization__stat">
        <div class="timeline-visualization__stat-number">30+</div>
        <div class="timeline-visualization__stat-label">Projects Deployed</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timeline-visualization {
  position: relative;
  padding: $spacing-xxl 0;
  
  @include element('header') {
    text-align: center;
    margin-bottom: $spacing-xxl;
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
    position: relative;
    max-width: 1000px;
    margin: 0 auto $spacing-xxl;
    padding: 0 $spacing-lg;
  }
  
  @include element('line') {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, $primary, $secondary);
    transform: translateX(-50%);
    
    @include mobile {
      left: 30px;
    }
  }
  
  @include element('stats') {
    display: flex;
    justify-content: center;
    gap: $spacing-xxl;
    margin-top: $spacing-xxl;
    
    @include mobile {
      flex-direction: column;
      gap: $spacing-lg;
      align-items: center;
    }
  }
  
  @include element('stat') {
    text-align: center;
    
    @include element('number') {
      font-size: 3rem;
      font-weight: 700;
      @include text-gradient(linear-gradient(45deg, $primary, $secondary));
      margin-bottom: $spacing-xs;
    }
    
    @include element('label') {
      color: $vscode-comment;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
}

.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: $spacing-xxl;
  
  @include modifier('left') {
    justify-content: flex-end;
    
    .timeline-item__content {
      margin-right: $spacing-xl;
      text-align: right;
      
      @include mobile {
        margin-right: 0;
        margin-left: $spacing-xl;
        text-align: left;
      }
    }
  }
  
  @include modifier('right') {
    justify-content: flex-start;
    
    .timeline-item__content {
      margin-left: $spacing-xl;
    }
  }
  
  @include element('marker') {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 10;
    
    @include mobile {
      left: 30px;
    }
  }
  
  @include element('version') {
    background: $primary;
    color: $space-deep;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-lg;
    font-family: $font-family-mono;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 0 20px rgba($primary, 0.5);
    white-space: nowrap;
  }
  
  @include element('content') {
    @include glass();
    padding: $spacing-lg;
    border-radius: $border-radius-lg;
    max-width: 400px;
    cursor: pointer;
    transition: all $animation-normal ease;
    border-left: 4px solid $primary;
    
    &:hover {
      transform: translateY(-4px);
      @include neon-glow($primary, 5px);
    }
    
    @include mobile {
      max-width: none;
      margin-right: $spacing-md;
    }
  }
  
  @include element('year') {
    color: $secondary;
    font-weight: 600;
    font-size: 1.125rem;
    margin-bottom: $spacing-xs;
  }
  
  @include element('label') {
    color: $vscode-text;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: $spacing-md;
    line-height: 1.3;
  }
  
  @include element('highlights') {
    margin-bottom: $spacing-md;
  }
  
  @include element('highlight') {
    color: $vscode-comment;
    font-size: 0.875rem;
    margin-bottom: $spacing-xs;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    i {
      color: $primary;
      width: 12px;
    }
  }
  
  @include element('commit') {
    color: $vscode-comment;
    font-size: 0.75rem;
    font-family: $font-family-mono;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid rgba($vscode-border, 0.3);
    
    i {
      color: $secondary;
    }
  }
}

// Mobile adjustments
@include mobile {
  .timeline-item {
    @include modifier('left');
    @include modifier('right') {
      justify-content: flex-start;
      
      .timeline-item__content {
        margin-left: $spacing-xl;
        margin-right: $spacing-md;
        text-align: left;
      }
    }
  }
}
</style>