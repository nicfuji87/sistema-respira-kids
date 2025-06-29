import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginScreen from '@/components/LoginScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginScreen,
      meta: { 
        requiresGuest: true,
        title: 'Login - Respira KIDS'
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: 'Dashboard - Respira KIDS'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { 
        requiresAuth: true,
        title: 'Sobre - Respira KIDS'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ]
})

// Guard de navegação
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Atualizar título da página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
    return
  }
  
  // Verificar se a rota é apenas para usuários não autenticados
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router 
