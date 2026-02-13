import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, FileText, MessageSquare, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalysesFromStorage, Analysis } from '@/data/mockAnalyses';

const Results: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      const analyses = getAnalysesFromStorage(user.id);
      const found = analyses.find(a => a.id === id);
      setAnalysis(found || null);
    }
  }, [user, id]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: chatMessage },
      { 
        role: 'assistant', 
        content: `Thank you for your question about "${chatMessage}". This is a placeholder response. In the full implementation, this would be powered by Google Gemini AI to provide detailed medical insights based on your X-ray analysis and report.` 
      }
    ]);
    setChatMessage('');
  };

  if (isLoading || !user) return null;

  if (!analysis) {
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

  const isNormal = analysis.detectedConditions.includes('Normal');

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
            {/* X-ray Image with Heatmap Overlay */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>X-Ray Analysis</span>
                  <Badge variant="default">Chest X-ray</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={analysis.imageUrl}
                    alt="X-ray"
                    className="w-full h-full object-contain"
                  />
                  {/* Placeholder for Grad-CAM heatmap overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs">
                    Grad-CAM Visualization (Mock)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostic Report */}
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
                    {analysis.detectedConditions.map((condition) => (
                      <Badge
                        key={condition}
                        variant={isNormal ? 'secondary' : 'destructive'}
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {analysis.symptoms && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reported Symptoms:</p>
                    <p className="text-sm">{analysis.symptoms}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Analysis Date:</p>
                  <p className="text-sm">{format(new Date(analysis.createdAt), 'MMMM d, yyyy h:mm a')}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Recommendations:</p>
                  <p className="text-sm">
                    {isNormal
                      ? 'The X-ray appears normal. Continue routine health monitoring. Consult a healthcare provider if symptoms persist.'
                      : 'Based on the detected findings, we recommend consulting with a qualified healthcare provider for further evaluation and treatment planning.'}
                  </p>
                </div>

                <Button variant="outline" className="w-full">
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
                            onClick={() => {
                              setChatMessage(q);
                            }}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
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
                  ))
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
                />
                <Button onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                  Send
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by Google Gemini AI (Mock)
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
