<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

// Components
import CustomCursor from '@/components/CustomCursor.vue'
import TerminalHeader from '@/components/TerminalHeader.vue'
import SkillsOrbit from '@/components/SkillsOrbit.vue'
import TimelineVisualization from '@/components/TimelineVisualization.vue'
import CommandPalette from '@/components/CommandPalette.vue'

// Data
import { professionalData } from '@/data/professional-data'

// Composables
useKeyboardShortcuts()

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Smooth scroll setup
  gsap.registerPlugin(ScrollTrigger)
  
  // Parallax effects
  gsap.utils.toArray('.parallax').forEach((element: any) => {
    gsap.to(element, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  })
  
  // Section transitions
  gsap.utils.toArray('.section').forEach((section: any) => {
    gsap.from(section.children, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      }
    })
  })
})
</script>

<template>
  <div class="home">
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <!-- Command Palette -->
    <CommandPalette />

    <!-- Hero Section -->
    <section class="section hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">
            <span class="code comment">/**</span><br>
            <span class="code comment">* Developer:</span>
            <span class="hero__name text-gradient">{{ professionalData.identity.name }}</span><br>
            <span class="code comment">* Version:</span>
            <span class="hero__version">{{ professionalData.currentVersion }}</span><br>
            <span class="code comment">*/</span>
          </h1>
          
          <div class="hero__tags">
            <span 
              v-for="tag in professionalData.identity.tags"
              :key="tag"
              class="hero__tag"
              data-tech
            >
              <span class="code string">"{{ tag }}"</span>
            </span>
          </div>

          <p class="hero__description">
            Frontend Developer passionate about creating immersive digital experiences 
            using modern JavaScript frameworks and cutting-edge technologies.
          </p>

          <div class="hero__shortcuts">
            <div class="hero__shortcut">
              <kbd>Ctrl</kbd>+<kbd>D</kbd>
              <span>Developer Mode</span>
            </div>
            <div class="hero__shortcut">
              <kbd>Ctrl</kbd>+<kbd>H</kbd>
              <span>Toggle Timeline</span>
            </div>
            <div class="hero__shortcut">
              <kbd>Ctrl</kbd>+<kbd>P</kbd>
              <span>Command Palette</span>
            </div>
          </div>
        </div>

        <TerminalHeader />
      </div>
    </section>

    <!-- Skills Section -->
    <section class="section skills parallax">
      <div class="container">
        <SkillsOrbit />
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="section timeline">
      <div class="container">
        <TimelineVisualization />
      </div>
    </section>

    <!-- Achievements Section -->
    <section class="section achievements parallax">
      <div class="container">
        <div class="achievements__header">
          <h2 class="achievements__title">
            <span class="code keyword">const</span>
            <span class="code variable">achievements</span>
            <span class="code"> = [</span>
          </h2>
        </div>

        <div class="achievements__grid">
          <div 
            v-for="(achievement, index) in professionalData.achievements"
            :key="index"
            class="achievements__item"
            data-tech
          >
            <div class="achievements__item-number">
              <span class="code string">[{{ index }}]</span>
            </div>
            <div class="achievements__item-content">
              <span class="code string">"{{ achievement }}"</span>
            </div>
          </div>
        </div>

        <div class="achievements__footer">
          <span class="code">];</span>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section contact">
      <div class="container">
        <div class="contact__content">
          <h2 class="contact__title">
            <span class="code comment">// Ready to collaborate?</span><br>
            <span class="code keyword">export default</span>
            <span class="code variable">{ contact }</span>
          </h2>

          <div class="contact__info">
            <a 
              :href="`mailto:${professionalData.identity.email}`"
              class="contact__link"
              data-tech
            >
              <i class="fas fa-envelope"></i>
              {{ professionalData.identity.email }}
            </a>
            
            <a 
              :href="professionalData.identity.github"
              target="_blank"
              class="contact__link"
              data-tech
            >
              <i class="fab fa-github"></i>
              GitHub Profile
            </a>
            
            <div class="contact__location">
              <i class="fas fa-map-marker-alt"></i>
              {{ professionalData.identity.location }}
            </div>
          </div>

          <div class="contact__footer">
            <p class="code comment">
              // Built with Vue 3 + Quasar + Three.js + GSAP<br>
              // Source: github.com/jcruz375/dev-universe
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  position: relative;
}

.hero {
  min-height: 100vh;
  @include flex-center;
  flex-direction: column;
  text-align: center;
  background: radial-gradient(ellipse at center, rgba(100, 255, 218, 0.05) 0%, transparent 70%);
  
  @include element('content') {
    margin-bottom: $spacing-xxl;
    max-width: 800px;
  }
  
  @include element('title') {
    font-size: 3rem;
    margin-bottom: $spacing-xl;
    line-height: 1.2;
    font-family: $font-family-mono;
    
    @include mobile {
      font-size: 2rem;
    }
  }
  
  @include element('name') {
    font-size: 3.5rem;
    font-weight: 700;
    display: block;
    
    @include mobile {
      font-size: 2.5rem;
    }
  }
  
  @include element('version') {
    color: $secondary;
    font-weight: 600;
  }
  
  @include element('tags') {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
    flex-wrap: wrap;
  }
  
  @include element('tag') {
    @include glass();
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-lg;
    border: 1px solid rgba($primary, 0.3);
    transition: all $animation-normal ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      @include neon-glow($primary, 3px);
    }
  }
  
  @include element('description') {
    font-size: 1.25rem;
    line-height: 1.6;
    color: $vscode-comment;
    margin-bottom: $spacing-xl;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  @include element('shortcuts') {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xxl;
    
    @include mobile {
      flex-direction: column;
      gap: $spacing-md;
    }
  }
  
  @include element('shortcut') {
    @include glass();
    padding: $spacing-md;
    border-radius: $border-radius-md;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    kbd {
      background: $vscode-panel;
      border: 1px solid $vscode-border;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.75rem;
      color: $vscode-comment;
      font-family: $font-family-mono;
    }
    
    span {
      color: $vscode-text;
      font-weight: 500;
    }
  }
}

.achievements {
  background: linear-gradient(135deg, rgba($space-mid, 0.5) 0%, rgba($space-light, 0.3) 100%);
  
  @include element('header') {
    text-align: center;
    margin-bottom: $spacing-xxl;
  }
  
  @include element('title') {
    font-size: 2.5rem;
    font-family: $font-family-mono;
    
    @include mobile {
      font-size: 1.8rem;
    }
  }
  
  @include element('grid') {
    display: grid;
    gap: $spacing-lg;
    max-width: 800px;
    margin: 0 auto $spacing-xl;
  }
  
  @include element('item') {
    @include glass();
    padding: $spacing-lg;
    border-radius: $border-radius-lg;
    display: flex;
    gap: $spacing-md;
    border-left: 4px solid $primary;
    transition: all $animation-normal ease;
    cursor: pointer;
    
    &:hover {
      transform: translateX(8px);
      @include neon-glow($primary, 3px);
    }
  }
  
  @include element('item-number') {
    color: $secondary;
    font-weight: 600;
    font-family: $font-family-mono;
    flex-shrink: 0;
  }
  
  @include element('item-content') {
    flex: 1;
    color: $vscode-text;
    line-height: 1.4;
  }
  
  @include element('footer') {
    text-align: center;
    font-size: 2rem;
    font-family: $font-family-mono;
    color: $vscode-comment;
  }
}

.contact {
  background: radial-gradient(ellipse at center, rgba($secondary, 0.05) 0%, transparent 70%);
  
  @include element('content') {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }
  
  @include element('title') {
    font-size: 2.5rem;
    margin-bottom: $spacing-xxl;
    font-family: $font-family-mono;
    line-height: 1.3;
    
    @include mobile {
      font-size: 1.8rem;
    }
  }
  
  @include element('info') {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-bottom: $spacing-xxl;
    align-items: center;
  }
  
  @include element('link') {
    @include glass();
    padding: $spacing-lg $spacing-xl;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    color: $vscode-text;
    text-decoration: none;
    transition: all $animation-normal ease;
    border: 1px solid rgba($primary, 0.3);
    min-width: 250px;
    justify-content: center;
    
    &:hover {
      transform: translateY(-4px);
      @include neon-glow($primary, 5px);
      color: $primary;
    }
    
    i {
      font-size: 1.25rem;
      color: $primary;
    }
  }
  
  @include element('location') {
    @include glass();
    padding: $spacing-md $spacing-lg;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    color: $vscode-comment;
    
    i {
      color: $secondary;
    }
  }
  
  @include element('footer') {
    margin-top: $spacing-xxl;
    padding-top: $spacing-xl;
    border-top: 1px solid rgba($vscode-border, 0.3);
    
    p {
      color: $vscode-comment;
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
    }
  }
}
</style>