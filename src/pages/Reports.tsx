import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileImage, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnalysisCard } from '@/components/AnalysisCard';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalysesFromStorage, Analysis } from '@/data/mockAnalyses';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

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

  if (isLoading || !user) return null;

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = analysis.detectedConditions
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || analysis.xrayType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Past Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your previous X-ray analyses
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                All Analyses ({filteredAnalyses.length})
              </CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="chest">Chest</SelectItem>
                    <SelectItem value="bone">Bone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No reports found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Your analyses will appear here'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnalyses.map((analysis) => (
                  <AnalysisCard key={analysis.id} analysis={analysis} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
