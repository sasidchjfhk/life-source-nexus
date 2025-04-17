
import { Sparkles, Dna } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InitialStateProps {
  activeModel: string;
  onRunAnalysis: () => void;
}

const InitialState = ({ activeModel, onRunAnalysis }: InitialStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/5"></div>
        <div className="absolute inset-2 rounded-full bg-primary/10"></div>
        <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
          {activeModel === "claude" ? 
            <Sparkles className="h-8 w-8 text-muted-foreground opacity-60" /> : 
            <Dna className="h-8 w-8 text-muted-foreground opacity-60" />}
        </div>
      </div>
      <h3 className="text-lg font-medium">Ready to Find Optimal Matches</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Our AI engine uses {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} to analyze 
        thousands of variables including genetic markers, tissue compatibility, 
        medical history, and geographical proximity.
      </p>
      <Button onClick={onRunAnalysis} className="mt-6 gap-2">
        {activeModel === "claude" ? <Sparkles className="h-4 w-4" /> : <Dna className="h-4 w-4" />}
        Run {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} Analysis
      </Button>
    </div>
  );
};

export default InitialState;
