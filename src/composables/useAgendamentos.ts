import { ref, computed, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Agendamento } from '@/types/database.types'

// Estado global dos agendamentos
const agendamentos = ref<Agendamento[]>([])
const agendamentoAtual = ref<Agendamento | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

/**
 * Composable de Agendamentos
 * 
 * Funcionalidades:
 * - CRUD completo de agendamentos
 * - Filtros e buscas
 * - Estados de carregamento
 * - Cache inteligente
 */
export function useAgendamentos() {

  // Computed properties
  const agendamentosHoje = computed(() => {
    const hoje = new Date().toISOString().split('T')[0]
    return agendamentos.value.filter(agendamento => 
      agendamento.data_hora.startsWith(hoje)
    )
  })

  const agendamentosProximos = computed(() => {
    const agora = new Date()
    return agendamentos.value
      .filter(agendamento => new Date(agendamento.data_hora) > agora)
      .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
      .slice(0, 5)
  })

  const agendamentosPorStatus = computed(() => {
    return agendamentos.value.reduce((acc, agendamento) => {
      const status = agendamento.status_agendamento || 'AGENDADO'
      if (!acc[status]) acc[status] = []
      acc[status].push(agendamento)
      return acc
    }, {} as Record<string, Agendamento[]>)
  })

  const totalAgendamentos = computed(() => agendamentos.value.length)

  // Actions
  const fetchAgendamentos = async (filtros?: {
    dataInicio?: string
    dataFim?: string
    pacienteId?: string
    profissionalId?: string
    status?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('agendamentos')
        .select(`
          *,
          paciente:pacientes(
            pessoa:pessoas(nome_completo, email, telefone)
          ),
          profissional:profissionais(
            pessoa:pessoas(nome_completo)
          )
        `)
        .order('data_hora', { ascending: true })

      // Aplicar filtros
      if (filtros?.dataInicio) {
        query = query.gte('data_hora', filtros.dataInicio)
      }
      
      if (filtros?.dataFim) {
        query = query.lte('data_hora', filtros.dataFim)
      }

      if (filtros?.pacienteId) {
        query = query.eq('paciente_id', filtros.pacienteId)
      }

      if (filtros?.profissionalId) {
        query = query.eq('profissional_id', filtros.profissionalId)
      }

      if (filtros?.status) {
        query = query.eq('status_agendamento', filtros.status)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      agendamentos.value = data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar agendamentos'
      error.value = message
      console.error('Erro ao buscar agendamentos:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAgendamentoPorId = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('agendamentos')
        .select(`
          *,
          paciente:pacientes(
            pessoa:pessoas(nome_completo, email, telefone, data_nascimento)
          ),
          profissional:profissionais(
            pessoa:pessoas(nome_completo),
            especialidade,
            registro_profissional
          )
        `)
        .eq('agendamento_id', id)
        .single()

      if (fetchError) throw fetchError

      agendamentoAtual.value = data
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar agendamento'
      error.value = message
      console.error('Erro ao buscar agendamento:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const criarAgendamento = async (dadosAgendamento: Omit<Agendamento, 'agendamento_id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('agendamentos')
        .insert(dadosAgendamento)
        .select()
        .single()

      if (createError) throw createError

      // Adicionar ao estado local
      agendamentos.value.push(data)
      
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar agendamento'
      error.value = message
      console.error('Erro ao criar agendamento:', err)
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const atualizarAgendamento = async (id: string, dadosAtualizacao: Partial<Agendamento>) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('agendamentos')
        .update({
          ...dadosAtualizacao,
          updated_at: new Date().toISOString()
        })
        .eq('agendamento_id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Atualizar no estado local
      const index = agendamentos.value.findIndex(ag => ag.agendamento_id === id)
      if (index !== -1) {
        agendamentos.value[index] = data
      }

      // Atualizar agendamento atual se for o mesmo
      if (agendamentoAtual.value?.agendamento_id === id) {
        agendamentoAtual.value = data
      }

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar agendamento'
      error.value = message
      console.error('Erro ao atualizar agendamento:', err)
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const cancelarAgendamento = async (id: string, motivo?: string) => {
    return atualizarAgendamento(id, {
      status_agendamento: 'CANCELADO',
      observacoes: motivo || 'Cancelado pelo usuário'
    })
  }

  const confirmarAgendamento = async (id: string) => {
    return atualizarAgendamento(id, {
      status_agendamento: 'CONFIRMADO'
    })
  }

  const marcarComoRealizado = async (id: string, observacoes?: string) => {
    return atualizarAgendamento(id, {
      status_agendamento: 'REALIZADO',
      observacoes: observacoes || 'Atendimento realizado'
    })
  }

  const excluirAgendamento = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('agendamentos')
        .delete()
        .eq('agendamento_id', id)

      if (deleteError) throw deleteError

      // Remover do estado local
      agendamentos.value = agendamentos.value.filter(ag => ag.agendamento_id !== id)

      // Limpar agendamento atual se for o mesmo
      if (agendamentoAtual.value?.agendamento_id === id) {
        agendamentoAtual.value = null
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir agendamento'
      error.value = message
      console.error('Erro ao excluir agendamento:', err)
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  const buscarAgendamentosDisponiveis = async (profissionalId: string, data: string) => {
    loading.value = true
    error.value = null

    try {
      // Buscar horários ocupados na data
      const { data: ocupados, error: fetchError } = await supabase
        .from('agendamentos')
        .select('data_hora')
        .eq('profissional_id', profissionalId)
        .gte('data_hora', `${data}T00:00:00`)
        .lt('data_hora', `${data}T23:59:59`)
        .not('status_agendamento', 'eq', 'CANCELADO')

      if (fetchError) throw fetchError

      // Gerar horários disponíveis (8h às 18h, de hora em hora)
      const horariosDisponiveis = []
      const dataBase = new Date(`${data}T08:00:00`)
      
      for (let i = 0; i < 10; i++) {
        const horario = new Date(dataBase)
        horario.setHours(horario.getHours() + i)
        
        const horarioString = horario.toISOString()
        const ocupado = ocupados?.some(ag => ag.data_hora === horarioString)
        
        if (!ocupado) {
          horariosDisponiveis.push(horarioString)
        }
      }

      return horariosDisponiveis
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar horários disponíveis'
      error.value = message
      console.error('Erro ao buscar horários disponíveis:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const obterEstatisticas = async (dataInicio: string, dataFim: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('agendamentos')
        .select('status_agendamento')
        .gte('data_hora', dataInicio)
        .lte('data_hora', dataFim)

      if (fetchError) throw fetchError

      const estatisticas = {
        total: data?.length || 0,
        agendados: data?.filter(ag => ag.status_agendamento === 'AGENDADO').length || 0,
        confirmados: data?.filter(ag => ag.status_agendamento === 'CONFIRMADO').length || 0,
        realizados: data?.filter(ag => ag.status_agendamento === 'REALIZADO').length || 0,
        cancelados: data?.filter(ag => ag.status_agendamento === 'CANCELADO').length || 0
      }

      return estatisticas
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao obter estatísticas'
      error.value = message
      console.error('Erro ao obter estatísticas:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const limparEstado = () => {
    agendamentos.value = []
    agendamentoAtual.value = null
    error.value = null
  }

  return {
    // Estado (readonly)
    agendamentos: readonly(agendamentos),
    agendamentoAtual: readonly(agendamentoAtual),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    agendamentosHoje,
    agendamentosProximos,
    agendamentosPorStatus,
    totalAgendamentos,

    // Actions
    fetchAgendamentos,
    fetchAgendamentoPorId,
    criarAgendamento,
    atualizarAgendamento,
    cancelarAgendamento,
    confirmarAgendamento,
    marcarComoRealizado,
    excluirAgendamento,
    buscarAgendamentosDisponiveis,
    obterEstatisticas,
    limparEstado
  }
}