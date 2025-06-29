<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-bege to-respira-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
    
    <!-- Container Principal - Responsivo -->
    <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
      
      <!-- Card de Login - Responsivo -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-soft p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6 lg:space-y-8">
        
        <!-- Logo e Header - Responsivo -->
        <div class="text-center space-y-3 sm:space-y-4 lg:space-y-5">
          <!-- Logo da Respira KIDS -->
          <div class="flex justify-center">
            <img 
              v-if="!imageError"
              src="/images/logos/logo-respira-kids.png" 
              alt="Respira KIDS"
              class="h-12 sm:h-16 lg:h-20 w-auto"
              @error="handleImageError"
            />
            <!-- Fallback Logo -->
            <div 
              v-else
              class="h-12 sm:h-16 lg:h-20 w-24 sm:w-32 lg:w-40 bg-gradient-to-r from-respira-300 to-kids-300 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm sm:text-lg lg:text-xl">
                Respira KIDS
              </span>
            </div>
          </div>
          
          <!-- Título -->
          <div class="space-y-1 sm:space-y-2">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-roxo">
              Bem-vindo de volta!
            </h1>
            <p class="text-brand-cinza text-xs sm:text-sm lg:text-base">
              Entre na sua conta para continuar
            </p>
          </div>
        </div>

        <!-- Formulário - Responsivo -->
        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5 lg:space-y-6">
          
          <!-- Campo Email -->
          <RkInput
            v-model="loginForm.email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            :required="true"
            :error-message="errors.email"
            :disabled="isLoading || isGoogleLoading"
            autocomplete="email"
            :icon="EmailIcon"
            size="lg"
            variant="filled"
          />

          <!-- Campo Senha -->
          <RkInput
            v-model="loginForm.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            :required="true"
            :error-message="errors.password"
            :disabled="isLoading || isGoogleLoading"
            autocomplete="current-password"
            :icon="LockIcon"
            size="lg"
            variant="filled"
          />

          <!-- Toggle Mostrar Senha - Responsivo -->
          <div class="flex items-center">
            <label class="flex items-center cursor-pointer group">
              <input
                v-model="showPassword"
                type="checkbox"
                class="sr-only"
                :disabled="isLoading || isGoogleLoading"
              />
              <div class="relative">
                <input
                  type="checkbox"
                  :checked="showPassword"
                  :disabled="isLoading || isGoogleLoading"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-respira-300 bg-gray-100 border-gray-300 rounded focus:ring-respira-300 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                />
              </div>
              <span class="ml-2 sm:ml-3 text-xs sm:text-sm text-brand-cinza group-hover:text-brand-roxo transition-colors duration-200">
                Mostrar senha
              </span>
            </label>
          </div>

          <!-- Erro Geral -->
          <div v-if="generalError" class="p-3 rounded-lg bg-kids-50 border border-kids-200">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-kids-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-kids-600">
                {{ generalError }}
              </p>
            </div>
          </div>

          <!-- Botão Login - Responsivo -->
          <RkButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            :disabled="!isFormValid || isLoading || isGoogleLoading"
            block
            class="shadow-respira mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg font-semibold py-3 sm:py-4"
          >
            {{ isLoading ? 'Entrando...' : 'Entrar na conta' }}
          </RkButton>

        </form>

        <!-- Divisor "OU" -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs sm:text-sm">
            <span class="px-3 sm:px-4 bg-white text-brand-cinza font-medium">
              OU
            </span>
          </div>
        </div>

        <!-- Login Social -->
        <div class="space-y-3 sm:space-y-4">
          <!-- Botão Google -->
          <RkButton
            variant="outline"
            size="lg"
            :loading="isGoogleLoading"
            :disabled="isLoading || isGoogleLoading"
            @click="handleGoogleLogin"
            block
            class="border-gray-300 hover:border-gray-400 transition-all duration-200 google-button"
            :class="{ 'loading-google': isGoogleLoading }"
          >
            <template #default>
              <div class="flex items-center justify-center space-x-2 sm:space-x-3">
                <!-- Google Icon -->
                <div 
                  v-if="!isGoogleLoading"
                  class="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <svg viewBox="0 0 24 24" class="w-full h-full">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span class="text-sm sm:text-base font-medium text-gray-700">
                  {{ isGoogleLoading ? 'Conectando...' : 'Continuar com Google' }}
                </span>
              </div>
            </template>
          </RkButton>
        </div>

        <!-- Links Auxiliares - Responsivo -->
        <div class="space-y-3 sm:space-y-4">
          
          <!-- Esqueci a Senha -->
          <div class="text-center">
            <button
              type="button"
              @click="handleForgotPassword"
              :disabled="isLoading || isGoogleLoading"
              class="text-xs sm:text-sm text-respira-400 hover:text-respira-500 transition-colors disabled:opacity-50 font-medium"
            >
              Esqueci minha senha
            </button>
          </div>

          <!-- Divisor -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs sm:text-sm">
              <span class="px-3 sm:px-4 bg-white text-brand-cinza font-medium">
                Não tem uma conta?
              </span>
            </div>
          </div>

          <!-- Link Cadastro -->
          <div class="text-center">
            <button
              type="button"
              @click="handleSignUp"
              :disabled="isLoading || isGoogleLoading"
              class="text-xs sm:text-sm text-kids-400 hover:text-kids-500 transition-colors disabled:opacity-50 font-semibold"
            >
              Criar conta gratuita
            </button>
          </div>
        </div>
      </div>

      <!-- Footer com informações -->
      <div class="mt-6 sm:mt-8 text-center">
        <p class="text-xs sm:text-sm text-brand-cinza">
          Sistema de gestão para profissionais da saúde
        </p>
        <p class="text-xs text-brand-cinza mt-1">
          © 2024 Respira KIDS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import RkInput from '@/components/base/RkInput.vue'
import RkButton from '@/components/base/RkButton.vue'
import type { LoginForm } from '@/types/database.types'

// Icons (simplified SVG components)
const EmailIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
    </svg>
  `
}

const LockIcon = {
  template: `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
    </svg>
  `
}

// Composables
const router = useRouter()
const { signIn, signInWithGoogle, isAuthenticated } = useAuth()

// Estado do componente
const loginForm = ref<LoginForm>({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const isGoogleLoading = ref(false)
const showPassword = ref(false)
const generalError = ref('')
const imageError = ref(false)

// Computed
const isFormValid = computed(() => {
  return loginForm.value.email.length > 0 && 
         loginForm.value.password.length > 0 &&
         !errors.value.email && 
         !errors.value.password
})

// Methods
const validateForm = () => {
  errors.value = { email: '', password: '' }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!loginForm.value.email) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!emailRegex.test(loginForm.value.email)) {
    errors.value.email = 'E-mail inválido'
  }
  
  // Validar senha
  if (!loginForm.value.password) {
    errors.value.password = 'Senha é obrigatória'
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
  }
  
  return !errors.value.email && !errors.value.password
}

const handleLogin = async () => {
  generalError.value = ''
  
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await signIn(loginForm.value.email, loginForm.value.password)
    
    // Redirect será feito automaticamente pelo router guard
  } catch (error) {
    generalError.value = error instanceof Error ? error.message : 'Erro no login'
    console.error('Erro no login:', error)
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  generalError.value = ''
  isGoogleLoading.value = true
  
  try {
    await signInWithGoogle()
    // O redirect será feito pelo OAuth flow
  } catch (error) {
    generalError.value = error instanceof Error ? error.message : 'Erro no login com Google'
    console.error('Erro no login com Google:', error)
  } finally {
    isGoogleLoading.value = false
  }
}

const handleForgotPassword = () => {
  console.log('Recuperar senha para:', loginForm.value.email)
  // TODO: Implementar modal ou página de recuperação de senha
  alert('Funcionalidade em desenvolvimento')
}

const handleSignUp = () => {
  console.log('Redirecionar para cadastro')
  // TODO: Implementar página de cadastro ou modal
  alert('Funcionalidade em desenvolvimento')
}

const handleImageError = () => {
  imageError.value = true
  console.log('Erro ao carregar logo, usando fallback')
}

// Lifecycle
onMounted(() => {
  // Se já estiver autenticado, redirecionar
  if (isAuthenticated.value) {
    router.push('/')
  }
})
</script>

<style scoped>
/* Animações customizadas para o Google button */
.google-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.google-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-button:active {
  transform: translateY(0);
}

.loading-google {
  pointer-events: none;
}

/* Animações de entrada */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animações para estados de loading */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Gradiente personalizado para fallback logo */
.logo-fallback {
  background: linear-gradient(135deg, var(--color-respira-300), var(--color-kids-300));
}

/* Responsividade adicional para elementos pequenos */
@media (max-width: 375px) {
  .text-xs {
    font-size: 0.7rem;
  }
  
  .space-y-3 > * + * {
    margin-top: 0.5rem;
  }
}

/* Melhorias de acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .google-button {
    transition: none;
  }
  
  .fade-in {
    animation: none;
  }
  
  .loading-pulse {
    animation: none;
  }
}

/* Focus styles melhorados */
button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color-respira-300);
  outline-offset: 2px;
}

/* Melhorias para modo escuro (future-proof) */
@media (prefers-color-scheme: dark) {
  /* Preparado para implementação futura do modo escuro */
}
</style>