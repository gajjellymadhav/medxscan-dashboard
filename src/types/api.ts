export interface ApiSuccessResponse<T> {
  success: true;
  status: number;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  data: null;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface XRayPredictionData {
  prediction: string;
  confidence: number;
  heatmap_path: string;
  report_path: string;
}

export interface ChatMessageData {
  question: string;
  answer: string;
  source: string;
  timestamp: string;
}

export interface HealthCheckData {
  status: string;
  service: string;
  version: string;
}
