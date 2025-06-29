# 🏗️ Arquitetura da Aplicação - Respira KIDS

Este documento estabelece as diretrizes e princípios arquiteturais para o desenvolvimento da aplicação **Respira KIDS**. Seguir essas regras garante código limpo, maintível e escalável.

## 📋 Princípios Fundamentais

### 1. 🎯 **Single Responsibility Principle (SRP)**
> *"Cada componente/função deve ter uma única responsabilidade"*

**✅ Boas Práticas:**
```typescript
// ❌ Ruim - Componente fazendo muitas coisas
<template>
  <div>
    <!-- Navegação, formulário, lista, modal tudo junto -->
  </div>
</template>

// ✅ Bom - Componentes separados
<template>
  <div>
    <NavigationBar />
    <UserForm @submit="handleSubmit" />
    <UserList :users="users" />
    <Modal v-if="showModal" />
  </div>
</template>
```

**Aplicação no projeto:**
- Um componente = uma funcionalidade específica
- Uma função = uma operação específica
- Um serviço = um domínio específico

### 2. 🔄 **DRY - Don't Repeat Yourself**
> *"Nunca repita código ou seja redundante"*

**✅ Boas Práticas:**
```typescript
// ❌ Ruim - Código repetido
const formatUserName1 = (name: string) => name.trim().toLowerCase()
const formatUserName2 = (name: string) => name.trim().toLowerCase()

// ✅ Bom - Função reutilizável
// utils/formatters.ts
export const formatUserName = (name: string) => name.trim().toLowerCase()
```

**Aplicação no projeto:**
- Criar composables para lógica reutilizável
- Usar components base para elementos comuns
- Centralizar configurações e constantes

### 3. 💎 **KISS - Keep It Simple**
> *"Mantenha simples, evite complexidade desnecessária"*

**✅ Boas Práticas:**
```typescript
// ❌ Ruim - Complexo demais
const processUser = (user: User) => {
  return user?.profile?.settings?.preferences?.theme === 'dark' 
    ? { ...user, isDark: true } 
    : { ...user, isDark: false }
}

// ✅ Bom - Simples e claro
const processUser = (user: User) => ({
  ...user,
  isDark: user.profile?.settings?.preferences?.theme === 'dark'
})
```

**Aplicação no projeto:**
- Prefira soluções diretas
- Evite over-engineering
- Código auto-explicativo

### 4. 🚫 **YAGNI - You Aren't Gonna Need It**
> *"Se não precisar agora, não crie agora"*

**✅ Boas Práticas:**
- Implemente funcionalidades apenas quando necessário
- Não crie abstrações prematuras
- Foque no MVP primeiro

**Aplicação no projeto:**
- Desenvolva features conforme demanda
- Refatore quando necessário, não antes
- Mantenha arquitetura flexível para mudanças

### 5. 🎯 **Single Source of Truth**
> *"Uma única fonte de verdade para cada dado"*

**✅ Boas Práticas:**
```typescript
// ✅ Bom - Estado centralizado
// composables/useAuth.ts
export const useAuth = () => {
  const user = ref<User | null>(null)
  // Única fonte de verdade para usuário atual
}
```

**Aplicação no projeto:**
- Use composables para estado global
- Centralize configurações
- Evite duplicação de dados

## 🎨 Boas Práticas Específicas Vue.js/TypeScript

### 6. 📁 **Organização de Arquivos**
```
src/
├── components/          # Componentes reutilizáveis
│   ├── base/           # Componentes base (Button, Input)
│   └── layout/         # Layout components
├── composables/        # Lógica reutilizável
├── lib/                # Configurações e utilitários
├── types/              # Definições TypeScript
├── views/              # Páginas da aplicação
└── assets/             # Assets estáticos
```

### 7. 🏷️ **Convenções de Nomenclatura**
```typescript
// Componentes: PascalCase
LoginScreen.vue
RkButton.vue

// Composables: camelCase com 'use'
useAuth.ts
useAgendamentos.ts

// Types: PascalCase
interface User {}
type UserRole = 'admin' | 'user'

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
```

### 8. 🔧 **Composables Pattern**
```typescript
// composables/useAuth.ts
export function useAuth() {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (credentials: LoginCredentials) => {
    // Lógica de login
  }
  
  return {
    user: readonly(user),
    isAuthenticated,
    login
  }
}
```

### 9. ⚡ **Performance e Otimização**
```vue
<template>
  <!-- Use v-show para elementos que alternam frequentemente -->
  <div v-show="isVisible">Conteúdo</div>
  
  <!-- Use v-if para renderização condicional real -->
  <div v-if="shouldRender">Conteúdo</div>
  
  <!-- Use v-memo para listas grandes -->
  <div v-for="item in items" :key="item.id" v-memo="[item.id]">
    {{ item.name }}
  </div>
</template>
```

### 10. 🛡️ **Type Safety**
```typescript
// Sempre tipagem explícita
interface UserFormData {
  name: string
  email: string
  age?: number
}

// Props tipadas
interface Props {
  user: User
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})
```

## 🎨 Design System e Componentes

### 11. 🎨 **Componentes Base**
```typescript
// components/base/RkButton.vue
// Reutilizável, flexível, consistente
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}
```

### 12. 🌈 **Sistema de Cores**
```typescript
// Usar cores da marca definidas no Tailwind
const colors = {
  respira: '#92D3C7',  // Azul principal
  kids: '#F39D94',     // Vermelho principal
  brand: {
    bege: '#FDF0DE',
    roxo: '#4E1963',
    amarelo: '#FDCD1F',
    verde: '#C6E09F',
    cinza: '#7A7A7A'
  }
}
```

### 13. 📱 **Design Responsivo**
```css
/* Mobile First */
.component {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
  }
}
```

## 🔐 Segurança e Autenticação

### 14. 🔒 **Supabase Integration**
```typescript
// lib/supabase.ts
export const supabase = createClient<Database>(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### 15. 🛡️ **Route Guards**
```typescript
// router/index.ts
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
    return
  }
  
  next()
})
```

## 🚀 Performance e Build

### 16. ⚡ **Code Splitting**
```typescript
// router/index.ts - Lazy loading
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue')
  }
]
```

### 17. 🎯 **Bundle Optimization**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
```

## 🧪 Testes e Qualidade

### 18. ✅ **ESLint Configuration**
```typescript
// eslint.config.ts
export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...configTs(),
  configPrettier
]
```

### 19. 🎨 **Prettier Configuration**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none"
}
```

## 📚 Documentação

### 20. 📝 **Comentários JSDoc**
```typescript
/**
 * Composable para gerenciamento de autenticação
 * 
 * @returns {Object} Estado e métodos de autenticação
 * @example
 * const { user, login, logout } = useAuth()
 */
export function useAuth() {
  // implementação
}
```

### 21. 📖 **README Components**
```markdown
# RkButton

Componente de botão reutilizável com múltiplas variantes.

## Props
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean

## Uso
```vue
<RkButton variant="primary" size="lg" :loading="isLoading">
  Salvar
</RkButton>
```

## 🔄 Workflow de Desenvolvimento

### 22. 🌊 **Git Flow**
```bash
# Feature branch
git checkout -b feat/nova-funcionalidade

# Commit semântico
git commit -m "feat: adicionar autenticação Google"

# Pull request
git push origin feat/nova-funcionalidade
```

### 23. 📦 **Semantic Versioning**
```
MAJOR.MINOR.PATCH

1.0.0 - Release inicial
1.1.0 - Nova funcionalidade
1.1.1 - Bug fix
2.0.0 - Breaking change
```

## 🎯 Metas de Qualidade

### 24. 📊 **Métricas**
- **Performance**: LCP < 2.5s, FID < 100ms
- **Acessibilidade**: Score > 95
- **TypeScript**: 100% tipado
- **Testes**: Cobertura > 80%

### 25. 🏆 **Code Review**
- **Checklist**: Funcionalidade, Performance, Segurança
- **Approval**: 2+ desenvolvedores
- **CI/CD**: Testes automatizados passando

## 🚀 Deploy e Monitoramento

### 26. 🔄 **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build
- name: Test
  run: npm run test
- name: Deploy
  run: npm run deploy
```

### 27. 📈 **Monitoring**
- **Errors**: Sentry ou similar
- **Performance**: Web Vitals
- **Analytics**: Google Analytics
- **Logs**: Estruturados e centralizados

---

## 🎉 Conclusão

Esta arquitetura garante:
- **Escalabilidade**: Fácil adição de features
- **Manutenibilidade**: Código limpo e organizado
- **Performance**: Otimizações aplicadas
- **Qualidade**: Padrões rigorosos
- **Colaboração**: Diretrizes claras para o time

**Lembre-se**: Estas são diretrizes, não leis. Use o bom senso e adapte conforme necessário, sempre priorizando a qualidade e produtividade da equipe.