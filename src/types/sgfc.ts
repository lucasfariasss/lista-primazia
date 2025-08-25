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
  
  // Dados complementares (mapeados do banco)
  dataEntrada: string;
  prioridade: 'ONC' | 'BRE' | 'SEM'; // Oncológico, Com Brevidade, Sem Brevidade
  medidaJudicial: boolean;
  situacao: 'CA' | 'AE' | 'DP' | 'PP' | 'CNR' | 'T1F' | 'T2F' | 'T3F' | 'CRS';
  observacoes?: string;
  dataNovoContato?: string;
  
  // Campos calculados para compatibilidade
  urgencia: boolean; // prioridade === 'BRE'
  oncologico: boolean; // prioridade === 'ONC'
  ordemJudicial: boolean; // medidaJudicial
  diasEspera: number;
  scorePrioridade: number;
  posicao: number;
  
  // Status
  ativo: boolean;
  motivoSaida?: 'MORTE' | 'OUTRO_LOCAL' | 'AUTOEXCLUSAO';
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
  prioridade?: 'ONC' | 'BRE' | 'SEM';
  situacao?: 'CA' | 'AE' | 'DP' | 'PP' | 'CNR' | 'T1F' | 'T2F' | 'T3F' | 'CRS';
  urgencia?: boolean;
  oncologico?: boolean;
  ordemJudicial?: boolean;
  ativo?: boolean;
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