import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitário para combinar classes CSS de forma inteligente
 * Merge entre clsx e tailwind-merge para evitar conflitos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatadores de data e hora
 */
export const formatters = {
  /**
   * Formatar data para exibição (DD/MM/AAAA)
   */
  date: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR')
  },

  /**
   * Formatar data e hora para exibição (DD/MM/AAAA HH:mm)
   */
  dateTime: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  /**
   * Formatar apenas hora (HH:mm)
   */
  time: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  /**
   * Formatar data relativa ("há 2 horas", "ontem", etc.)
   */
  relative: (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffInMs = now.getTime() - d.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    if (diffInDays === 1) return 'ontem'
    if (diffInDays < 7) return `há ${diffInDays} dias`
    
    return formatters.date(d)
  }
}

/**
 * Validadores comuns
 */
export const validators = {
  /**
   * Validar email
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validar CPF
   */
  cpf: (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '')
    
    if (cleanCpf.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false
    
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
    }
    
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
    }
    
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    
    return remainder === parseInt(cleanCpf.charAt(10))
  },

  /**
   * Validar telefone brasileiro
   */
  phone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length === 10 || cleanPhone.length === 11
  },

  /**
   * Validar senha forte
   */
  strongPassword: (password: string): boolean => {
    // Mínimo 8 caracteres, pelo menos 1 minúscula, 1 maiúscula, 1 número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }
}

/**
 * Utilitários de string
 */
export const stringUtils = {
  /**
   * Capitalizar primeira letra
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  /**
   * Capitalizar cada palavra
   */
  title: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  /**
   * Truncar texto
   */
  truncate: (str: string, length: number): string => {
    return str.length > length ? str.substring(0, length) + '...' : str
  },

  /**
   * Slug para URLs
   */
  slug: (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Espaços vira hífen
      .replace(/-+/g, '-') // Múltiplos hífens vira um
      .trim()
  }
}

/**
 * Utilitários de número
 */
export const numberUtils = {
  /**
   * Formatar moeda brasileira
   */
  currency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  },

  /**
   * Formatar porcentagem
   */
  percentage: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value / 100)
  },

  /**
   * Formatar número com separadores
   */
  number: (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }
}

/**
 * Debounce function para otimizar performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar execuções
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Gerar ID único simples
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Verificar se é mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Copiar texto para clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err)
    return false
  }
}

/**
 * Download de arquivo
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
