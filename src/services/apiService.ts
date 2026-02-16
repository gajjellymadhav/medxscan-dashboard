import { apiClient } from '@/api/client';
import type {
  ApiResponse,
  XRayPredictionData,
  ChatMessageData,
  HealthCheckData,
} from '@/types/api';

export const apiService = {
  xray: {
    async predict(image: File, symptoms?: string): Promise<ApiResponse<XRayPredictionData>> {
      const formData = new FormData();
      formData.append('image', image);
      if (symptoms) formData.append('symptoms', symptoms);
      return apiClient.upload('/api/v1/xray/predict', formData);
    },

    async getReport(reportId: string): Promise<ApiResponse<any>> {
      return apiClient.get(`/api/v1/xray/report/${reportId}`);
    },

    async downloadReport(reportPath: string): Promise<void> {
      const url = apiClient.getFileUrl(reportPath);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.pdf';
      a.click();
    },
  },

  chat: {
    async ask(question: string, context?: string): Promise<ApiResponse<ChatMessageData>> {
      return apiClient.post('/api/v1/chat/ask', { question, context });
    },
  },

  system: {
    async healthCheck(): Promise<ApiResponse<HealthCheckData>> {
      return apiClient.get('/api/v1/health');
    },
  },
};
