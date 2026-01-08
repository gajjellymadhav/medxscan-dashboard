import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">MedXScan AI</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Guide:</strong> Prof. Sameera Sultana
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Team:</strong> Gillela Ram Reddy (2211CS020153) • Gaddameedi Rishitha (2211CS020154) • 
              Gajjely Madhav (2211CS020165) • Gade Vignesh (2211CS020169)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Malla Reddy University • B.Tech Final Year Project
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MedXScan AI. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};
