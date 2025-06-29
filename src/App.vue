<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// Lifecycle
onMounted(() => {
  console.log('🏥 Sistema de Fisioterapia - Pronto para uso!')
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Sistema de Fisioterapia Direto -->
    <RouterView />
  </div>
</template>

<style scoped>
/* Animações customizadas se necessário */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
