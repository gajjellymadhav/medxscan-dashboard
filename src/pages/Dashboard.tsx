import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileImage, Activity, Clock, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsCard } from '@/components/StatsCard';
import { AnalysisCard } from '@/components/AnalysisCard';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalysesFromStorage, Analysis } from '@/data/mockAnalyses';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setAnalyses(getAnalysesFromStorage(user.id));
    }
  }, [user]);

  const refreshAnalyses = () => {
    if (user) {
      setAnalyses(getAnalysesFromStorage(user.id));
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const recentConditions = analyses
    .flatMap(a => a.detectedConditions)
    .filter(c => c !== 'Normal')
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container py-12 md:py-20">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {user.name.split(' ')[0]}
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Upload your X-ray images for instant AI-powered analysis and get comprehensive diagnostic reports.
              </p>
              <Button
                size="lg"
                className="mt-6 gap-2"
                onClick={() => navigate('/new-analysis')}
              >
                <Plus className="h-5 w-5" />
                New Analysis
              </Button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        <div className="container py-8">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatsCard
              title="Total Analyses"
              value={analyses.length}
              icon={FileImage}
              description="All time"
            />
            <StatsCard
              title="Recent Conditions"
              value={recentConditions.length > 0 ? recentConditions[0] : 'None'}
              icon={Stethoscope}
              description={recentConditions.length > 1 ? `+${recentConditions.length - 1} more` : undefined}
            />
            <StatsCard
              title="Last Analysis"
              value={analyses.length > 0 ? 'Active' : 'None'}
              icon={Clock}
              description={analyses.length > 0 ? new Date(analyses[0].createdAt).toLocaleDateString() : undefined}
            />
          </div>

          {/* Past Analyses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Recent Analyses
              </CardTitle>
              {analyses.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => navigate('/reports')}>
                  View All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {analyses.length === 0 ? (
                <div className="text-center py-12">
                  <FileImage className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No analyses yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Upload your first X-ray to get started
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/new-analysis')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.slice(0, 5).map((analysis) => (
                    <AnalysisCard key={analysis.id} analysis={analysis} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
