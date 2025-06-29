<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <div 
      v-if="loading" 
      class="animate-spin rounded-full border-2 border-transparent border-t-current mr-2"
      :class="loadingSize"
    ></div>

    <!-- Icon (à esquerda) -->
    <component 
      v-if="icon && !iconRight" 
      :is="icon" 
      :class="iconClasses" 
    />

    <!-- Slot para conteúdo customizado ou texto -->
    <slot>{{ label }}</slot>

    <!-- Icon (à direita) -->
    <component 
      v-if="icon && iconRight" 
      :is="icon" 
      :class="iconClasses" 
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: object
  iconRight?: boolean
  tag?: 'button' | 'a' | 'router-link'
  href?: string
  to?: string | object
  block?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

interface Emits {
  (e: 'click', event: Event): void
}

// Props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  tag: 'button',
  rounded: 'lg'
})

const emit = defineEmits<Emits>()

// Computed
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'active:scale-95'
  ]

  // Tamanhos
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  // Bordas arredondadas
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }

  // Variantes de cores
  const variantClasses = {
    primary: [
      'bg-respira-300 text-white border border-respira-300',
      'hover:bg-respira-400 hover:border-respira-400',
      'focus:ring-respira-300',
      'shadow-respira'
    ],
    secondary: [
      'bg-kids-300 text-white border border-kids-300',
      'hover:bg-kids-400 hover:border-kids-400',
      'focus:ring-kids-300',
      'shadow-kids'
    ],
    outline: [
      'bg-transparent text-respira-300 border border-respira-300',
      'hover:bg-respira-300 hover:text-white',
      'focus:ring-respira-300'
    ],
    ghost: [
      'bg-transparent text-brand-roxo border border-transparent',
      'hover:bg-brand-bege hover:text-brand-roxo',
      'focus:ring-brand-roxo'
    ],
    danger: [
      'bg-kids-300 text-white border border-kids-300',
      'hover:bg-kids-400 hover:border-kids-400',
      'focus:ring-kids-300'
    ]
  }

  // Largura total
  const blockClasses = props.block ? 'w-full' : ''

  return [
    ...baseClasses,
    sizeClasses[props.size],
    roundedClasses[props.rounded],
    ...variantClasses[props.variant],
    blockClasses
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  const spacingMap = {
    xs: props.iconRight ? 'ml-1' : 'mr-1',
    sm: props.iconRight ? 'ml-1.5' : 'mr-1.5',
    md: props.iconRight ? 'ml-2' : 'mr-2',
    lg: props.iconRight ? 'ml-2.5' : 'mr-2.5',
    xl: props.iconRight ? 'ml-3' : 'mr-3'
  }

  return [
    sizeMap[props.size],
    spacingMap[props.size]
  ].join(' ')
})

const loadingSize = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }
  return sizeMap[props.size]
})

// Methods
const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Animações customizadas */
@keyframes pulse-respira {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(146, 211, 199, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(146, 211, 199, 0);
  }
}

@keyframes pulse-kids {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(243, 157, 148, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(243, 157, 148, 0);
  }
}

.google-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-google {
  pointer-events: none;
}
</style>
