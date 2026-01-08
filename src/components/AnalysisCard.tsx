import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Analysis, boneRegions } from '@/data/mockAnalyses';

interface AnalysisCardProps {
  analysis: Analysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const getBoneRegionLabel = (region?: string) => {
    return boneRegions.find(r => r.value === region)?.label || region;
  };

  const isNormal = analysis.detectedConditions.includes('Normal');

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-32 h-32 bg-muted flex items-center justify-center shrink-0">
            <img
              src={analysis.imageUrl}
              alt="X-ray thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={analysis.xrayType === 'chest' ? 'default' : 'secondary'}>
                    {analysis.xrayType === 'chest' ? 'Chest X-ray' : `Bone - ${getBoneRegionLabel(analysis.boneRegion)}`}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {analysis.detectedConditions.map((condition) => (
                    <Badge
                      key={condition}
                      variant="outline"
                      className={isNormal ? 'border-secondary text-secondary' : 'border-destructive/50 text-destructive'}
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>

                {analysis.symptoms && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                    Symptoms: {analysis.symptoms}
                  </p>
                )}
              </div>

              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link to={`/results/${analysis.id}`}>
                  <FileText className="h-4 w-4 mr-1" />
                  View Report
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
