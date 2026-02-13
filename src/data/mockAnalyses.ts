export interface Analysis {
  id: string;
  userId: string;
  imageUrl: string;
  symptoms?: string;
  detectedConditions: string[];
  createdAt: string;
  reportGenerated: boolean;
}

export const chestConditions = ['Normal', 'Pneumonia', 'COVID-19', 'Tuberculosis'];

const getRandomConditions = (): string[] => {
  const isNormal = Math.random() > 0.6;
  if (isNormal) return ['Normal'];
  
  const abnormal = chestConditions.filter(c => c !== 'Normal');
  const shuffled = abnormal.sort(() => Math.random() - 0.5);
  return [shuffled[0]];
};

export const generateMockAnalyses = (userId: string): Analysis[] => {
  return [
    {
      id: '1',
      userId,
      imageUrl: '/placeholder.svg',
      symptoms: 'Persistent cough, mild fever',
      detectedConditions: ['Pneumonia'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
    {
      id: '2',
      userId,
      imageUrl: '/placeholder.svg',
      symptoms: 'Shortness of breath, fatigue',
      detectedConditions: ['COVID-19'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
    {
      id: '3',
      userId,
      imageUrl: '/placeholder.svg',
      detectedConditions: ['Normal'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
  ];
};

export const getAnalysesFromStorage = (userId: string): Analysis[] => {
  const stored = localStorage.getItem('medxscan_analyses');
  if (!stored) {
    const mockData = generateMockAnalyses(userId);
    localStorage.setItem('medxscan_analyses', JSON.stringify(mockData));
    return mockData;
  }
  return JSON.parse(stored).filter((a: Analysis) => a.userId === userId);
};

export const addAnalysis = (analysis: Omit<Analysis, 'id' | 'createdAt' | 'reportGenerated'>): Analysis => {
  const newAnalysis: Analysis = {
    ...analysis,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    reportGenerated: true,
    detectedConditions: getRandomConditions(),
  };
  
  const stored = localStorage.getItem('medxscan_analyses');
  const analyses = stored ? JSON.parse(stored) : [];
  analyses.unshift(newAnalysis);
  localStorage.setItem('medxscan_analyses', JSON.stringify(analyses));
  
  return newAnalysis;
};
