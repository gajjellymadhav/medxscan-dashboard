import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowRight, Stethoscope, FileImage, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
                <Activity className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MedXScan AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Intelligent X-Ray Diagnosis & Healthcare Assistance
            </p>
            
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Upload your X-ray images and get instant AI-powered analysis with detailed diagnostic reports and conversational health guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Features */}
      <div className="container py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
              <FileImage className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload X-Ray</h3>
            <p className="text-sm text-muted-foreground">
              Simply upload your chest X-ray images in PNG, JPEG, or DICOM format
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 mx-auto mb-4">
              <Stethoscope className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Our deep learning models detect Pneumonia, COVID-19, Tuberculosis, and Normal conditions
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Chat with our AI assistant for follow-up questions about your results
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MedXScan AI • B.Tech Final Year Project</p>
          <p className="mt-1">Malla Reddy University</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
