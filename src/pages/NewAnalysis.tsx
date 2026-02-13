import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image, FileImage, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { addAnalysis } from '@/data/mockAnalyses';

const NewAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      processFile(droppedFile);
    }
  }, []);

  const isValidFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/dicom'];
    return validTypes.includes(file.type) || file.name.endsWith('.dcm');
  };

  const processFile = (file: File) => {
    setFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      processFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !user) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newAnalysis = addAnalysis({
      userId: user.id,
      imageUrl: preview || '/placeholder.svg',
      symptoms: symptoms || undefined,
      detectedConditions: [],
    });
    
    setIsSubmitting(false);
    navigate(`/results/${newAnalysis.id}`);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container py-8 md:py-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <FileImage className="h-8 w-8 text-primary" />
                New Chest X-Ray Analysis
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Upload your chest X-ray image for AI-powered analysis. Our system will detect potential conditions and generate a comprehensive report.
              </p>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        </section>

        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upload Chest X-Ray Image</CardTitle>
                <CardDescription>
                  Supported formats: PNG, JPEG, and DICOM files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Zone */}
                <div className="space-y-2">
                  <Label>Chest X-Ray Image *</Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                      isDragging
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {preview ? (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="X-ray Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={clearFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <p className="text-center mt-4 text-sm text-muted-foreground">
                          {file?.name}
                        </p>
                      </div>
                    ) : file ? (
                      <div className="text-center">
                        <Image className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="mt-3 font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">DICOM file selected</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                          className="mt-3"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium">
                          Drag & drop your chest X-ray here
                        </p>
                        <p className="text-muted-foreground mt-1">
                          or{' '}
                          <label className="text-primary cursor-pointer hover:underline font-medium">
                            browse files
                            <input
                              type="file"
                              className="hidden"
                              accept=".png,.jpg,.jpeg,.dcm"
                              onChange={handleFileInput}
                            />
                          </label>
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="space-y-2">
                  <Label>Symptoms (Optional)</Label>
                  <Textarea
                    placeholder="Describe any symptoms you're experiencing, such as cough, fever, breathing difficulties, etc."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Providing symptoms helps improve the accuracy of the analysis
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!file || isSubmitting}
                    className="flex-1 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-muted/50 mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Chest X-Ray Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI model analyzes chest X-rays to detect: Normal, Pneumonia, COVID-19, and Tuberculosis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewAnalysis;
