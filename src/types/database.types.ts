/**
 * Tipos TypeScript para o banco de dados
 * 
 * Estes tipos refletem a estrutura do banco Supabase
 * e garantem type safety em toda a aplicação
 */

export interface Database {
  public: {
    Tables: {
      pessoas: {
        Row: Pessoa
        Insert: PessoaInsert
        Update: PessoaUpdate
      }
      profissionais: {
        Row: Profissional
        Insert: ProfissionalInsert
        Update: ProfissionalUpdate
      }
      pacientes: {
        Row: Paciente
        Insert: PacienteInsert
        Update: PacienteUpdate
      }
      agendamentos: {
        Row: Agendamento
        Insert: AgendamentoInsert
        Update: AgendamentoUpdate
      }
      usuarios: {
        Row: Usuario
        Insert: UsuarioInsert
        Update: UsuarioUpdate
      }
    }
  }
}

// ===========================
// PESSOA - Entidade base
// ===========================
export interface Pessoa {
  pessoa_id: string
  nome_completo: string
  email?: string
  telefone?: string
  cpf?: string
  data_nascimento?: string
  endereco?: string
  cep?: string
  cidade?: string
  estado?: string
  tipo_pessoa: 'PACIENTE' | 'PROFISSIONAL' | 'ADMINISTRATIVO'
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface PessoaInsert {
  pessoa_id?: string
  nome_completo: string
  email?: string
  telefone?: string
  cpf?: string
  data_nascimento?: string
  endereco?: string
  cep?: string
  cidade?: string
  estado?: string
  tipo_pessoa: 'PACIENTE' | 'PROFISSIONAL' | 'ADMINISTRATIVO'
  ativo?: boolean
  created_at?: string
  updated_at?: string
}

export interface PessoaUpdate {
  nome_completo?: string
  email?: string
  telefone?: string
  cpf?: string
  data_nascimento?: string
  endereco?: string
  cep?: string
  cidade?: string
  estado?: string
  tipo_pessoa?: 'PACIENTE' | 'PROFISSIONAL' | 'ADMINISTRATIVO'
  ativo?: boolean
  updated_at?: string
}

// ===========================
// PROFISSIONAL
// ===========================
export interface Profissional {
  profissional_id: string
  pessoa_id: string
  especialidade: 'FISIOTERAPIA' | 'TERAPIA_OCUPACIONAL' | 'FONOAUDIOLOGIA' | 'PSICOLOGIA' | 'EDUCACAO_FISICA'
  registro_profissional: string
  conselho_classe: string
  descricao_profissional?: string
  valor_consulta?: number
  tempo_consulta?: number // em minutos
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface ProfissionalInsert {
  profissional_id?: string
  pessoa_id: string
  especialidade: 'FISIOTERAPIA' | 'TERAPIA_OCUPACIONAL' | 'FONOAUDIOLOGIA' | 'PSICOLOGIA' | 'EDUCACAO_FISICA'
  registro_profissional: string
  conselho_classe?: string
  descricao_profissional?: string
  valor_consulta?: number
  tempo_consulta?: number
  ativo?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProfissionalUpdate {
  especialidade?: 'FISIOTERAPIA' | 'TERAPIA_OCUPACIONAL' | 'FONOAUDIOLOGIA' | 'PSICOLOGIA' | 'EDUCACAO_FISICA'
  registro_profissional?: string
  conselho_classe?: string
  descricao_profissional?: string
  valor_consulta?: number
  tempo_consulta?: number
  ativo?: boolean
  updated_at?: string
}

// ===========================
// PACIENTE
// ===========================
export interface Paciente {
  paciente_id: string
  pessoa_id: string
  data_nascimento: string
  sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO'
  nome_responsavel?: string
  telefone_responsavel?: string
  email_responsavel?: string
  observacoes_medicas?: string
  alergias?: string
  medicamentos_uso?: string
  convenio_medico?: string
  numero_convenio?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface PacienteInsert {
  paciente_id?: string
  pessoa_id: string
  data_nascimento: string
  sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO'
  nome_responsavel?: string
  telefone_responsavel?: string
  email_responsavel?: string
  observacoes_medicas?: string
  alergias?: string
  medicamentos_uso?: string
  convenio_medico?: string
  numero_convenio?: string
  ativo?: boolean
  created_at?: string
  updated_at?: string
}

export interface PacienteUpdate {
  data_nascimento?: string
  sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO'
  nome_responsavel?: string
  telefone_responsavel?: string
  email_responsavel?: string
  observacoes_medicas?: string
  alergias?: string
  medicamentos_uso?: string
  convenio_medico?: string
  numero_convenio?: string
  ativo?: boolean
  updated_at?: string
}

// ===========================
// AGENDAMENTO
// ===========================
export interface Agendamento {
  agendamento_id: string
  paciente_id: string
  profissional_id: string
  data_hora: string
  tipo_atendimento: 'CONSULTA' | 'RETORNO' | 'AVALIACAO' | 'SESSAO'
  status_agendamento: 'AGENDADO' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO' | 'FALTOU'
  valor?: number
  observacoes?: string
  forma_pagamento?: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CONVENIO'
  pago?: boolean
  created_at: string
  updated_at: string
}

export interface AgendamentoInsert {
  agendamento_id?: string
  paciente_id: string
  profissional_id: string
  data_hora: string
  tipo_atendimento?: 'CONSULTA' | 'RETORNO' | 'AVALIACAO' | 'SESSAO'
  status_agendamento?: 'AGENDADO' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO' | 'FALTOU'
  valor?: number
  observacoes?: string
  forma_pagamento?: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CONVENIO'
  pago?: boolean
  created_at?: string
  updated_at?: string
}

export interface AgendamentoUpdate {
  paciente_id?: string
  profissional_id?: string
  data_hora?: string
  tipo_atendimento?: 'CONSULTA' | 'RETORNO' | 'AVALIACAO' | 'SESSAO'
  status_agendamento?: 'AGENDADO' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO' | 'FALTOU'
  valor?: number
  observacoes?: string
  forma_pagamento?: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CONVENIO'
  pago?: boolean
  updated_at?: string
}

// ===========================
// USUÁRIO (Auth)
// ===========================
export interface Usuario {
  usuario_id: string
  user_id: string // ID do Supabase Auth
  pessoa_id: string
  ultimo_login?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface UsuarioInsert {
  usuario_id?: string
  user_id: string
  pessoa_id: string
  ultimo_login?: string
  ativo?: boolean
  created_at?: string
  updated_at?: string
}

export interface UsuarioUpdate {
  ultimo_login?: string
  ativo?: boolean
  updated_at?: string
}

// ===========================
// TIPOS AUXILIARES
// ===========================

// Formulários de login/cadastro
export interface LoginForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  nomeCompleto: string
  tipoPessoa: 'PACIENTE' | 'PROFISSIONAL'
  telefone?: string
}

// Agendamento com relacionamentos
export interface AgendamentoCompleto extends Agendamento {
  paciente?: {
    pessoa: Pessoa
  }
  profissional?: {
    pessoa: Pessoa
    especialidade: string
  }
}

// Pessoa com perfil específico
export interface PessoaCompleta extends Pessoa {
  profissional?: Profissional
  paciente?: Paciente
}

// Estatísticas
export interface EstatisticasAgendamento {
  total: number
  agendados: number
  confirmados: number
  realizados: number
  cancelados: number
  faltaram: number
}

export interface EstatisticasProfissional {
  totalPacientes: number
  agendamentosHoje: number
  agendamentosSemana: number
  receitaMes: number
  taxaPresenca: number
}

// Filtros
export interface FiltroAgendamento {
  dataInicio?: string
  dataFim?: string
  pacienteId?: string
  profissionalId?: string
  status?: string
  tipoAtendimento?: string
}

export interface FiltroPaciente {
  nome?: string
  ativo?: boolean
  idade?: {
    min?: number
    max?: number
  }
  convenio?: string
}

// Horários disponíveis
export interface HorarioDisponivel {
  data: string
  hora: string
  disponivel: boolean
  profissionalId: string
}

// Configurações do sistema
export interface ConfiguracoesSistema {
  horaInicioAtendimento: string
  horaFimAtendimento: string
  duracaoConsultaPadrao: number
  diasFuncionamento: string[]
  feriados: string[]
  lembreteAntecedencia: number // horas
  confirmacaoObrigatoria: boolean
}

// Notificações
export interface Notificacao {
  id: string
  tipo: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  titulo: string
  mensagem: string
  lida: boolean
  data: string
  acao?: {
    label: string
    url: string
  }
}

// Estados de loading
export interface LoadingState {
  agendamentos: boolean
  pacientes: boolean
  profissionais: boolean
  auth: boolean
  global: boolean
}

// Erros personalizados
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Tema e preferências
export interface PreferenciasUsuario {
  tema: 'light' | 'dark' | 'auto'
  idioma: 'pt-BR' | 'en-US'
  notificacoes: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    cardsVisiveis: string[]
    layoutPersonalizado: boolean
  }
}

// Exportar tipos compostos úteis
export type { Database }
export type TipoPessoa = Pessoa['tipo_pessoa']
export type StatusAgendamento = Agendamento['status_agendamento']
export type TipoAtendimento = Agendamento['tipo_atendimento']
export type EspecialidadeProfissional = Profissional['especialidade']
export type FormaPagamento = Agendamento['forma_pagamento']