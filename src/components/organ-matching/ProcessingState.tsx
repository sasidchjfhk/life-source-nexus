
import { Sparkles, Dna } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingStateProps {
  processingProgress: number;
  activeModel: string;
}

const ProcessingState = ({ processingProgress, activeModel }: ProcessingStateProps) => {
  return (
    <div className="space-y-4 py-8">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
            {activeModel === "claude" ? 
              <Sparkles className="h-8 w-8 text-primary animate-pulse" /> : 
              <Dna className="h-8 w-8 text-primary animate-pulse" />}
          </div>
        </div>
        
        <h3 className="text-lg font-medium">Processing with {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"}</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {activeModel === "claude" ? 
            "Analyzing genetic markers, tissue compatibility, and organ viability..." : 
            "Evaluating medical history, immunology, and transplant success factors..."}
        </p>
      </div>
      <Progress value={processingProgress} className="h-2 w-full max-w-md mx-auto" />
      <p className="text-center text-sm text-muted-foreground">
        {processingProgress < 100 ? `${Math.round(processingProgress)}% complete` : "Finalizing results..."}
      </p>
    </div>
  );
};

export default ProcessingState;
