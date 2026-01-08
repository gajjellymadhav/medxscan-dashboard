import React from 'react';
import { Activity, Brain, FileText, MessageSquare, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Diagnosis',
    description: 'Deep learning models trained on NIH ChestX-ray14, COVIDx, and MURA datasets for accurate detection of thoracic and musculoskeletal abnormalities.',
  },
  {
    icon: FileText,
    title: 'Structured Reports',
    description: 'Comprehensive diagnostic reports with Grad-CAM visualizations highlighting areas of concern in your X-ray images.',
  },
  {
    icon: MessageSquare,
    title: 'AI Health Assistant',
    description: 'Multimodal chatbot powered by Google Gemini for follow-up questions about your X-ray analysis and health concerns.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your medical data is encrypted and stored securely. We prioritize your privacy and data protection.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your X-ray analysis results in seconds, not days. Fast, accurate, and reliable diagnostics.',
  },
  {
    icon: Activity,
    title: 'Comprehensive Coverage',
    description: 'Detects 17+ conditions including pneumonia, COVID-19 patterns, TB, and various musculoskeletal abnormalities.',
  },
];

const team = [
  { name: 'Gillela Ram Reddy', id: '2211CS020153' },
  { name: 'Gaddameedi Rishitha', id: '2211CS020154' },
  { name: 'Gajjely Madhav', id: '2211CS020165' },
  { name: 'Gade Vignesh', id: '2211CS020169' },
];

const About: React.FC = () => {
  const { user } = useAuth();

  const content = (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 md:py-24">
        <div className="container text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MedXScan AI
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A Unified Framework for Intelligent X-Ray Diagnosis and Conversational Healthcare Assistance
          </p>
        </div>
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Features */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-md">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Info */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About the Project</h2>
            <p className="text-muted-foreground mb-8">
              MedXScan AI is a B.Tech final year project developed at Malla Reddy University. 
              The system leverages state-of-the-art deep learning models (CNNs) trained on 
              publicly available medical imaging datasets to provide accurate and reliable 
              X-ray diagnosis assistance.
            </p>
            
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm">
                    <strong>Guide:</strong> Prof. Sameera Sultana
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Department of Computer Science & Engineering, Malla Reddy University
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container py-12">
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">⚠️ Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              MedXScan AI is designed for educational and research purposes only. The diagnostic 
              suggestions provided by this system should not be considered as professional medical 
              advice. Always consult qualified healthcare providers for proper diagnosis and treatment. 
              The developers are not responsible for any medical decisions made based on this system's output.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );

  if (user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        {content}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {content}
      <Footer />
    </div>
  );
};

export default About;
