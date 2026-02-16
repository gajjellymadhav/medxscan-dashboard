import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, FileText, MessageSquare, Download, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalysesFromStorage, Analysis } from '@/data/mockAnalyses';
import { apiService } from '@/services/apiService';
import { useAPI } from '@/hooks/useAPI';
import { apiClient } from '@/api/client';
import type { ChatMessageData, XRayPredictionData } from '@/types/api';

const Results: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [apiPrediction, setApiPrediction] = useState<XRayPredictionData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const { isLoading: isChatLoading, execute: sendChatMessage } = useAPI<ChatMessageData>(
    apiService.chat.ask,
    {
      onSuccess: (data) => {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
      },
      onError: (error) => {
        setChatHistory(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${error}` }]);
      },
    }
  );

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const state = location.state as { prediction?: XRayPredictionData; imagePreview?: string } | null;
    if (state?.prediction) {
      setApiPrediction(state.prediction);
      setImagePreview(state.imagePreview || null);
    } else if (user && id && id !== 'api') {
      const analyses = getAnalysesFromStorage(user.id);
      const found = analyses.find(a => a.id === id);
      setAnalysis(found || null);
    }
  }, [user, id, location.state]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const question = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    const context = apiPrediction
      ? `Patient chest X-ray prediction: ${apiPrediction.prediction} (confidence: ${(apiPrediction.confidence * 100).toFixed(1)}%)`
      : analysis
        ? `Patient chest X-ray conditions: ${analysis.detectedConditions.join(', ')}`
        : undefined;

    await sendChatMessage(question, context);
  };

  if (isLoading || !user) return null;

  // Determine display data from either API response or mock analysis
  const prediction = apiPrediction?.prediction || (analysis?.detectedConditions?.[0] ?? 'Unknown');
  const confidence = apiPrediction?.confidence;
  const isNormal = prediction === 'Normal';
  const displayImage = apiPrediction
    ? (apiPrediction.heatmap_path ? apiClient.getFileUrl(apiPrediction.heatmap_path) : imagePreview)
    : analysis?.imageUrl;
  const displayConditions = apiPrediction
    ? [apiPrediction.prediction]
    : analysis?.detectedConditions || [];
  const displaySymptoms = analysis?.symptoms;
  const displayDate = analysis ? format(new Date(analysis.createdAt), 'MMMM d, yyyy h:mm a') : format(new Date(), 'MMMM d, yyyy h:mm a');

  if (!apiPrediction && !analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Report not found</h3>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Image & Report */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>X-Ray Analysis</span>
                  <Badge variant="default">Chest X-ray</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="X-ray"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                  {apiPrediction?.heatmap_path && (
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs">
                      Grad-CAM Visualization
                    </div>
                  )}
                  {!apiPrediction && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/10 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs">
                        Grad-CAM Visualization (Mock)
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Diagnostic Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {isNormal ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                  <span className="font-medium">
                    {isNormal ? 'No Abnormalities Detected' : 'Findings Detected'}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Detected Conditions:</p>
                  <div className="flex flex-wrap gap-2">
                    {displayConditions.map((condition) => (
                      <Badge key={condition} variant={isNormal ? 'secondary' : 'destructive'}>
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {confidence !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confidence:</p>
                    <p className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</p>
                  </div>
                )}

                {displaySymptoms && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reported Symptoms:</p>
                    <p className="text-sm">{displaySymptoms}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Analysis Date:</p>
                  <p className="text-sm">{displayDate}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Recommendations:</p>
                  <p className="text-sm">
                    {isNormal
                      ? 'The X-ray appears normal. Continue routine health monitoring. Consult a healthcare provider if symptoms persist.'
                      : 'Based on the detected findings, we recommend consulting with a qualified healthcare provider for further evaluation and treatment planning.'}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (apiPrediction?.report_path) {
                      apiService.xray.downloadReport(apiPrediction.report_path);
                    }
                  }}
                  disabled={!apiPrediction?.report_path}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Chat */}
          <Card className="flex flex-col h-[calc(100vh-12rem)] lg:h-auto lg:min-h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI Health Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Ask questions about your X-ray results, detected conditions, or get general health information.
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Try asking:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['What does this condition mean?', 'What are the treatment options?', 'Should I see a specialist?'].map((q) => (
                          <Button
                            key={q}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setChatMessage(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your question..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="resize-none"
                  rows={2}
                  disabled={isChatLoading}
                />
                <Button onClick={handleSendMessage} disabled={!chatMessage.trim() || isChatLoading}>
                  Send
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by Google Gemini AI
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
