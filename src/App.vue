<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  // Force dark mode
  $q.dark.set(true)
})
</script>

<template>
  <div id="app" class="dev-universe">
    <router-view />
  </div>
</template>

<style lang="scss">
.dev-universe {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  overflow-x: hidden;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  cursor: none; // We'll implement custom cursor
}
</style>