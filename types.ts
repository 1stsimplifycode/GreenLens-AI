export interface MetricImpact {
  co2_kg: number;
  water_liters: number;
  waste_kg: number;
}

export interface AiAnalysis {
  confidence_score: number; // 0-100
  reasoning: string;
  methodology: string;
  sources: string[];
}

export interface ActionLog {
  id: string;
  timestamp: string; // ISO string
  description: string;
  user: string;
  department: string;
  metrics: MetricImpact;
  aiAnalysis: AiAnalysis;
  status: 'verified' | 'pending' | 'flagged';
}

export interface ScenarioResult {
  scenarioName: string;
  projectedMetrics: MetricImpact;
  impactChange: {
    co2_percent: number;
    water_percent: number;
    waste_percent: number;
  };
  analysis: string;
  recommendations: string[];
}

export interface UserProfile {
  name: string;
  role: 'Admin' | 'Evaluator' | 'User';
  organization: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ACTION_LOGGER = 'ACTION_LOGGER',
  PREDICTIVE_ADVISOR = 'PREDICTIVE_ADVISOR',
  GOVERNANCE_AUDIT = 'GOVERNANCE_AUDIT'
}