// SGFC Types - Sistema de Gestão de Fila Cirúrgica

export interface Patient {
  id: string;
  prontuario: string;
  name: string;
  cpf?: string;
  birthDate: string;
  phone?: string;
  // Outros dados vindos do AGHUx (read-only)
}

export interface Especialidade {
  id: string;
  codigo: string;
  name: string;
  description?: string;
}

export interface Procedimento {
  id: string;
  codigo: string;
  name: string;
  especialidadeId: string;
  description?: string;
}

export interface Medico {
  id: string;
  crm: string;
  name: string;
  especialidades: string[];
}

export interface EntradaLEC {
  id: string;
  pacienteId: string;
  paciente: Patient;
  especialidadeId: string;
  especialidade: Especialidade;
  procedimentoId: string;
  procedimento: Procedimento;
  medicoId: string;
  medico: Medico;
  
  // Dados complementares (editáveis no SGFC)
  dataEntrada: string;
  urgencia: boolean;
  oncologico: boolean;
  ordemJudicial: boolean;
  observacoes?: string;
  
  // Calculados
  diasEspera: number;
  scorePrioridade: number;
  posicao: number;
  
  // Status
  ativo: boolean;
  motivoRemocao?: string;
  dataRemocao?: string;
  
  // Auditoria
  criadoPor: string;
  criadoEm: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'publico' | 'nir' | 'medico' | 'gestor' | 'admin';
  especialidades?: string[]; // Para médicos
}

export interface FilterLEC {
  especialidadeId?: string;
  procedimentoId?: string;
  medicoId?: string;
  urgencia?: boolean;
  oncologico?: boolean;
  ordemJudicial?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

export interface RelatorioLEC {
  totalPacientes: number;
  tempoMedioEspera: number;
  distribuicaoPorEspecialidade: Record<string, number>;
  pacientesUrgencia: number;
  pacientesOncologicos: number;
  pacientesOrdemJudicial: number;
}

export type PriorityLevel = 'normal' | 'urgente' | 'oncologico' | 'judicial';

export interface PriorityCalculation {
  diasEspera: number;
  multiplicadorUrgencia: number;
  multiplicadorOncologico: number;
  multiplicadorJudicial: number;
  scoreTotal: number;
}