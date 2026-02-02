export interface AnalysisResult {
  summary: string;
  saudiSummary: string;
  spatialIssues: string[];
  contrastIssues: string[];
  suggestions: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  imagePreview: string | null;
}