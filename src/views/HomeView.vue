<template>
  <div class="p-6 bg-gray-50 min-h-full">
    <!-- Header Profissional -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard - Sistema de Fisioterapia</h1>
      <p class="text-gray-600">Visão geral dos atendimentos e gestão de pacientes</p>
    </div>

    <!-- Cards de Métricas - Layout Limpo -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div
        v-for="metric in metrics"
        :key="metric.title"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ metric.title }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ metric.value }}</p>
            <p 
              v-if="metric.trend"
              :class="[
                'text-sm mt-1 flex items-center',
                metric.trend > 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <svg 
                v-if="metric.trend > 0"
                class="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04L10.75 5.612V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
              </svg>
              <svg 
                v-else
                class="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
              </svg>
              {{ Math.abs(metric.trend) }}% vs mês anterior
            </p>
          </div>
          <div :class="[
            'p-3 rounded-lg',
            metric.color
          ]">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path v-html="metric.iconPath" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção Principal: Agendamentos e Informações -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      <!-- Próximos Atendimentos -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Próximos Atendimentos</h3>
              <p class="text-sm text-gray-600">Agenda de hoje - {{ formatDate(new Date()) }}</p>
            </div>
            <div class="flex space-x-2">
              <button class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Novo Agendamento
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="agendamentos.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento agendado</h3>
            <p class="text-gray-500 mb-4">Você não tem consultas agendadas para hoje.</p>
            <button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Agendar Consulta
            </button>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="agendamento in agendamentos.slice(0, 6)"
              :key="agendamento.agendamento_id"
              class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <h4 class="text-sm font-medium text-gray-900">
                  Paciente
                </h4>
                <p class="text-sm text-gray-500">
                  {{ formatDateTime(agendamento.data_hora) }}
                </p>
                <p class="text-xs text-gray-400">
                  Fisioterapia
                </p>
              </div>
              <div class="flex-shrink-0">
                <span :class="getStatusColor(agendamento.status_agendamento || 'AGENDADO')">
                  {{ getStatusText(agendamento.status_agendamento || 'AGENDADO') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Painel Lateral: Informações Rápidas -->
      <div class="space-y-6">
        
        <!-- Pacientes Recentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Pacientes Recentes</h3>
            <p class="text-sm text-gray-600">Últimos registros</p>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div 
                v-for="patient in recentPatients" 
                :key="patient.id"
                class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ patient.name }}</p>
                  <p class="text-xs text-gray-500">{{ patient.lastVisit }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lembretes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Lembretes</h3>
            <p class="text-sm text-gray-600">Tarefas importantes</p>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div 
                v-for="reminder in reminders" 
                :key="reminder.id"
                class="flex items-start p-3 rounded-lg bg-yellow-50 border border-yellow-200"
              >
                <div class="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ reminder.title }}</p>
                  <p class="text-xs text-gray-600">{{ reminder.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações Rápidas -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
        <p class="text-sm text-gray-600">Acesso direto às principais funcionalidades</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="action in quickActions"
            :key="action.title"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            @click="handleQuickAction(action.title)"
          >
            <div class="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path v-html="action.iconPath" />
              </svg>
            </div>
            <span class="mt-3 text-sm font-medium text-gray-900 text-center group-hover:text-blue-600">
              {{ action.title }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAgendamentos } from '@/composables/useAgendamentos'
import { formatters } from '@/lib/utils'

// Composables
const { agendamentos, loading, fetchAgendamentos } = useAgendamentos()

// Dados estáticos para demo
const metrics = ref([
  {
    title: 'Atendimentos Hoje',
    value: '8',
    trend: 12,
    color: 'bg-blue-100 text-blue-600',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Pacientes Ativos',
    value: '147',
    trend: 8,
    color: 'bg-green-100 text-green-600',
    iconPath: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z'
  },
  {
    title: 'Consultas Este Mês',
    value: '324',
    trend: -3,
    color: 'bg-purple-100 text-purple-600',
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
  },
  {
    title: 'Taxa de Presença',
    value: '94%',
    trend: 5,
    color: 'bg-yellow-100 text-yellow-600',
    iconPath: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
  }
])

const recentPatients = ref([
  { id: 1, name: 'Maria Silva', lastVisit: 'Hoje, 14:30' },
  { id: 2, name: 'João Santos', lastVisit: 'Ontem, 16:00' },
  { id: 3, name: 'Ana Costa', lastVisit: 'Ter, 10:15' },
  { id: 4, name: 'Pedro Lima', lastVisit: 'Seg, 09:30' }
])

const reminders = ref([
  { id: 1, title: 'Revisar exercícios da Maria', time: '15:00' },
  { id: 2, title: 'Ligar para João sobre retorno', time: '16:30' },
  { id: 3, title: 'Preparar relatório mensal', time: 'Amanhã' }
])

const quickActions = ref([
  {
    title: 'Novo Agendamento',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Cadastrar Paciente',
    iconPath: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
  },
  {
    title: 'Evolução Clínica',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: 'Relatórios',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    title: 'Exercícios',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Financeiro',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
  },
  {
    title: 'Agenda',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    title: 'Configurações',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
])

// Methods
const formatDate = (date: Date) => formatters.date(date)
const formatDateTime = (date: string) => formatters.dateTime(date)

const getStatusColor = (status: string) => {
  const colors = {
    AGENDADO: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    CONFIRMADO: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    CANCELADO: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    REALIZADO: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
  }
  return colors[status as keyof typeof colors] || colors.AGENDADO
}

const getStatusText = (status: string) => {
  const texts = {
    AGENDADO: 'Agendado',
    CONFIRMADO: 'Confirmado',
    CANCELADO: 'Cancelado',
    REALIZADO: 'Realizado'
  }
  return texts[status as keyof typeof texts] || 'Agendado'
}

const handleQuickAction = (action: string) => {
  console.log(`Ação selecionada: ${action}`)
  // Implementar navegação ou modal específico
}

// Lifecycle
onMounted(() => {
  fetchAgendamentos()
})
</script>