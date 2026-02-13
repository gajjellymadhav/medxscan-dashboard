import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image, FileImage } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { addAnalysis } from '@/data/mockAnalyses';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    onOpenChange(false);
    resetForm();
    navigate(`/results/${newAnalysis.id}`);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setSymptoms('');
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-primary" />
            New Chest X-Ray Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Zone */}
          <div className="space-y-2">
            <Label>Chest X-Ray Image</Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => { setFile(null); setPreview(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : file ? (
                <div className="text-center">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop your chest X-ray image here, or{' '}
                    <label className="text-primary cursor-pointer hover:underline">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.dcm"
                        onChange={handleFileInput}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPEG, or DICOM files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label>Symptoms (Optional)</Label>
            <Textarea
              placeholder="Describe any symptoms you're experiencing..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
