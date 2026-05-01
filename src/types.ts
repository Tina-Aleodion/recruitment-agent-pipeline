export type Stage = 
  | "Applied" 
  | "Phone Screen" 
  | "Assessment" 
  | "First Interview" 
  | "Final Interview" 
  | "Offer" 
  | "Hired" 
  | "Rejected" 
  | "Withdrawn";

export interface RoleMetadata {
  hm: string;
  technical: boolean;
  stages: Stage[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: Stage;
  date: string; // ISO date
  lastUpdated: string; // ISO date
  hm: string;
  notes?: string;
  rejectedFrom?: Stage;
  rejectionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  candidateId?: string;
  details: string;
}

export type PipelineMetrics = {
  total: number;
  byStage: Record<Stage, number>;
  stale: number;
  urgent: number;
  conversionRate: number;
};
