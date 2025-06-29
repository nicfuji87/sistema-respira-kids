<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-brand-roxo"
    >
      {{ label }}
      <span v-if="required" class="text-kids-300 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Icon (se fornecido) -->
      <div 
        v-if="icon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component 
          :is="icon" 
          class="h-5 w-5 text-brand-cinza" 
          aria-hidden="true" 
        />
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        :autocomplete="autocomplete"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Loading Spinner -->
      <div 
        v-if="loading" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-respira-300"></div>
      </div>
    </div>

    <!-- Helper Text / Error -->
    <div v-if="helperText || errorMessage" class="text-sm">
      <p v-if="errorMessage" class="text-kids-300 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ errorMessage }}
      </p>
      <p v-else-if="helperText" class="text-brand-cinza">
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

// Types
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  required?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: object
  helperText?: string
  errorMessage?: string
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'filled'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

// Props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  autocomplete: 'off'
})

const emit = defineEmits<Emits>()

// Refs
const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

// Computed
const inputId = computed(() => `rk-input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset transition-all duration-200',
    'placeholder:text-brand-cinza focus:ring-2 focus:ring-inset',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
  ]

  // Tamanhos
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg'
  }

  // Variantes
  const variantClasses = {
    default: [
      'bg-white ring-gray-300',
      'focus:ring-respira-300 focus:bg-white'
    ],
    outline: [
      'bg-transparent ring-respira-300',
      'focus:ring-respira-300 focus:ring-2'
    ],
    filled: [
      'bg-brand-bege ring-transparent',
      'focus:ring-respira-300 focus:bg-white'
    ]
  }

  // Estados
  const stateClasses = props.errorMessage 
    ? 'ring-kids-300 focus:ring-kids-300' 
    : variantClasses[props.variant]

  // Espaçamento para ícone
  const iconClasses = props.icon ? 'pl-10' : ''

  return [
    ...baseClasses,
    sizeClasses[props.size],
    ...stateClasses,
    iconClasses
  ].join(' ')
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const focus = async () => {
  await nextTick()
  inputRef.value?.focus()
}

// Expose para uso externo
defineExpose({
  focus,
  inputRef
})
</script>

<style scoped>
/* Animações personalizadas se necessário */
.rk-input-transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 
