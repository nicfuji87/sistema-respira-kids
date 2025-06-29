import { ref, computed, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Pessoa, Profissional, Paciente } from '@/types/database.types'

// Estado global de autenticação
const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const persona = ref<Pessoa | null>(null)
const perfilProfissional = ref<Profissional | null>(null)
const perfilPaciente = ref<Paciente | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

/**
 * Composable de Autenticação
 * 
 * Segue as melhores práticas:
 * - Single Source of Truth para estado de auth
 * - Type Safety com TypeScript
 * - Gestão de erro centralizada
 * - Performance otimizada
 */
export function useAuth() {
  
  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isProfissional = computed(() => persona.value?.tipo_pessoa === 'PROFISSIONAL')
  const isPaciente = computed(() => persona.value?.tipo_pessoa === 'PACIENTE')
  const isAdmin = computed(() => persona.value?.tipo_pessoa === 'ADMINISTRATIVO')
  
  const userDisplayName = computed(() => {
    return persona.value?.nome_completo || user.value?.email || 'Usuário'
  })

  // Actions
  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) throw authError
      
      // Buscar dados da pessoa após login
      if (data.user) {
        await fetchUserPersona(data.user.id)
      }
      
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no login'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, nomeCompleto: string, tipoPessoa: 'PACIENTE' | 'PROFISSIONAL') => {
    loading.value = true
    error.value = null
    
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nomeCompleto,
            tipo_pessoa: tipoPessoa
          }
        }
      })
      
      if (authError) throw authError
      
      // 2. Criar registro na tabela pessoas
      if (authData.user) {
        await createPersona(authData.user.id, nomeCompleto, tipoPessoa)
      }
      
      return authData
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no cadastro'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      
      // Limpar estado local
      clearUserData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no logout'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
      
      if (resetError) throw resetError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao resetar senha'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (authError) throw authError
      
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no login com Google'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  // Funções auxiliares privadas
  const fetchUserPersona = async (userId: string) => {
    try {
      // Buscar pessoa vinculada ao usuário
      const { data: userData } = await supabase
        .from('usuarios')
        .select('pessoa_id')
        .eq('user_id', userId)
        .single()

      if (userData?.pessoa_id) {
        // Buscar dados da pessoa
        const { data: pessoaData } = await supabase
          .from('pessoas')
          .select('*')
          .eq('pessoa_id', userData.pessoa_id)
          .single()

        if (pessoaData) {
          persona.value = pessoaData
          
          // Buscar perfil específico se for profissional ou paciente
          if (pessoaData.tipo_pessoa === 'PROFISSIONAL') {
            await fetchPerfilProfissional(pessoaData.pessoa_id)
          } else if (pessoaData.tipo_pessoa === 'PACIENTE') {
            await fetchPerfilPaciente(pessoaData.pessoa_id)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err)
    }
  }

  const fetchPerfilProfissional = async (pessoaId: string) => {
    const { data } = await supabase
      .from('profissionais')
      .select('*')
      .eq('pessoa_id', pessoaId)
      .single()

    if (data) {
      perfilProfissional.value = data
    }
  }

  const fetchPerfilPaciente = async (pessoaId: string) => {
    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('pessoa_id', pessoaId)
      .single()

    if (data) {
      perfilPaciente.value = data
    }
  }

  const createPersona = async (userId: string, nomeCompleto: string, tipoPessoa: 'PACIENTE' | 'PROFISSIONAL') => {
    try {
      // 1. Criar pessoa
      const { data: pessoaData, error: pessoaError } = await supabase
        .from('pessoas')
        .insert({
          nome_completo: nomeCompleto,
          tipo_pessoa: tipoPessoa,
          ativo: true
        })
        .select()
        .single()

      if (pessoaError) throw pessoaError

      // 2. Vincular usuário à pessoa
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          user_id: userId,
          pessoa_id: pessoaData.pessoa_id
        })

      if (usuarioError) throw usuarioError

      // 3. Criar perfil específico
      if (tipoPessoa === 'PROFISSIONAL') {
        await supabase
          .from('profissionais')
          .insert({
            pessoa_id: pessoaData.pessoa_id,
            especialidade: 'FISIOTERAPIA',
            registro_profissional: '',
            ativo: true
          })
      } else if (tipoPessoa === 'PACIENTE') {
        await supabase
          .from('pacientes')
          .insert({
            pessoa_id: pessoaData.pessoa_id,
            data_nascimento: new Date().toISOString(),
            ativo: true
          })
      }

      persona.value = pessoaData
    } catch (err) {
      console.error('Erro ao criar persona:', err)
      throw err
    }
  }

  const clearUserData = () => {
    user.value = null
    session.value = null
    persona.value = null
    perfilProfissional.value = null
    perfilPaciente.value = null
  }

  // Inicializar estado de autenticação
  const initAuth = async () => {
    try {
      // Obter sessão atual
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await fetchUserPersona(currentSession.user.id)
      }

      // Escutar mudanças de autenticação
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        session.value = newSession
        user.value = newSession?.user || null
        
        if (newSession?.user) {
          await fetchUserPersona(newSession.user.id)
        } else {
          clearUserData()
        }
      })
    } catch (err) {
      console.error('Erro ao inicializar autenticação:', err)
    }
  }

  return {
    // Estado (readonly)
    user: readonly(user),
    session: readonly(session),
    persona: readonly(persona),
    perfilProfissional: readonly(perfilProfissional),
    perfilPaciente: readonly(perfilPaciente),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    isAuthenticated,
    isProfissional,
    isPaciente,
    isAdmin,
    userDisplayName,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    initAuth
  }
}