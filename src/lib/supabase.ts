import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Configuração do cliente Supabase com boas práticas de segurança
 * 
 * Variáveis de ambiente:
 * - VITE_SUPABASE_URL: URL do projeto Supabase
 * - VITE_SUPABASE_ANON_KEY: Chave pública do Supabase
 */

// Configurações de ambiente
const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema Médico RK',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '120')
}

// Fallbacks para desenvolvimento (REMOVER EM PRODUÇÃO)
const FALLBACK_CONFIG = {
  url: 'https://tplzbsdjnskrzyduvnbj.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbHpic2Rqc25rcnp5ZHV2bmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjY5NzYsImV4cCI6MjA1MDc0Mjk3Nn0.CqZl5_iN4Sq1KfWKVIXGhTGJW_4kqB5qGNGHYcnP5PE'
}

// Validação de variáveis de ambiente
const supabaseUrl = ENV.SUPABASE_URL || FALLBACK_CONFIG.url
const supabaseKey = ENV.SUPABASE_ANON_KEY || FALLBACK_CONFIG.key

// Validações de segurança
if (!supabaseUrl || !supabaseKey) {
  const errorMsg = 'ERRO: Configurações do Supabase não encontradas. Verifique as variáveis de ambiente.'
  console.error(errorMsg)
  throw new Error(errorMsg)
}

if (ENV.APP_ENV === 'production' && (supabaseUrl === FALLBACK_CONFIG.url || supabaseKey === FALLBACK_CONFIG.key)) {
  console.warn('AVISO: Usando configurações de fallback em produção. Configure as variáveis de ambiente adequadamente.')
}

// Log de configuração (apenas em desenvolvimento)
if (ENV.DEBUG) {
  console.log('🔧 Configuração Supabase:', {
    url: supabaseUrl,
    environment: ENV.APP_ENV,
    app: ENV.APP_NAME,
    sessionTimeout: ENV.SESSION_TIMEOUT + ' minutos'
  })
}

/**
 * Cliente Supabase configurado com boas práticas
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configurações de segurança
    storageKey: `${ENV.APP_NAME.toLowerCase().replace(/\s+/g, '-')}-auth`,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': `${ENV.APP_NAME} v${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      'X-Environment': ENV.APP_ENV
    }
  },
  // Configurações de performance
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

/**
 * Configurações exportadas para uso na aplicação
 */
export const config = {
  env: ENV.APP_ENV,
  isProduction: ENV.APP_ENV === 'production',
  isDevelopment: ENV.APP_ENV === 'development',
  sessionTimeout: ENV.SESSION_TIMEOUT,
  debug: ENV.DEBUG,
  appName: ENV.APP_NAME
}

/**
 * Utilitário para verificar se o Supabase está configurado corretamente
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('pessoas').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message)
      return false
    }
    
    if (ENV.DEBUG) {
      console.log('✅ Conexão com Supabase estabelecida com sucesso')
    }
    
    return true
  } catch (error) {
    console.error('❌ Falha na verificação do Supabase:', error)
    return false
  }
} 
