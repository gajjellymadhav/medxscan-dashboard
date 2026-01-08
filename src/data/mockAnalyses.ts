export interface Analysis {
  id: string;
  userId: string;
  imageUrl: string;
  xrayType: 'chest' | 'bone';
  boneRegion?: 'wrist' | 'hand' | 'elbow' | 'forearm' | 'humerus' | 'shoulder';
  symptoms?: string;
  detectedConditions: string[];
  createdAt: string;
  reportGenerated: boolean;
}

export const chestConditions = [
  'Atelectasis', 'Cardiomegaly', 'Consolidation', 'Edema', 'Effusion',
  'Emphysema', 'Fibrosis', 'Hernia', 'Infiltration', 'Mass', 'Nodule',
  'Pleural Thickening', 'Pneumonia', 'Pneumothorax', 'COVID-19 patterns',
  'TB patterns', 'Normal'
];

export const boneConditions = ['Musculoskeletal Abnormality', 'Normal'];

export const boneRegions = [
  { value: 'wrist', label: 'Wrist' },
  { value: 'hand', label: 'Hand/Fingers' },
  { value: 'elbow', label: 'Elbow' },
  { value: 'forearm', label: 'Forearm' },
  { value: 'humerus', label: 'Humerus' },
  { value: 'shoulder', label: 'Shoulder' },
];

const getRandomConditions = (type: 'chest' | 'bone'): string[] => {
  const conditions = type === 'chest' ? chestConditions : boneConditions;
  const isNormal = Math.random() > 0.7;
  
  if (isNormal) return ['Normal'];
  
  const numConditions = type === 'chest' ? Math.floor(Math.random() * 3) + 1 : 1;
  const shuffled = conditions.filter(c => c !== 'Normal').sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numConditions);
};

export const generateMockAnalyses = (userId: string): Analysis[] => {
  const analyses: Analysis[] = [
    {
      id: '1',
      userId,
      imageUrl: '/placeholder.svg',
      xrayType: 'chest',
      symptoms: 'Persistent cough, mild fever',
      detectedConditions: ['Pneumonia', 'Infiltration'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
    {
      id: '2',
      userId,
      imageUrl: '/placeholder.svg',
      xrayType: 'bone',
      boneRegion: 'wrist',
      symptoms: 'Pain after fall',
      detectedConditions: ['Musculoskeletal Abnormality'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
    {
      id: '3',
      userId,
      imageUrl: '/placeholder.svg',
      xrayType: 'chest',
      detectedConditions: ['Normal'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      reportGenerated: true,
    },
  ];
  return analyses;
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
    detectedConditions: getRandomConditions(analysis.xrayType),
  };
  
  const stored = localStorage.getItem('medxscan_analyses');
  const analyses = stored ? JSON.parse(stored) : [];
  analyses.unshift(newAnalysis);
  localStorage.setItem('medxscan_analyses', JSON.stringify(analyses));
  
  return newAnalysis;
};
