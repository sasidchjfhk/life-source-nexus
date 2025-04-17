
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { AIModel } from "@/models/aiModels";

interface ModelInfoBannerProps {
  showModelInfo: boolean;
  activeModel: string;
  modelInfo: Record<string, AIModel>;
}

const ModelInfoBanner = ({ showModelInfo, activeModel, modelInfo }: ModelInfoBannerProps) => {
  if (!showModelInfo) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg p-3 bg-primary/5 border border-primary/20 transition-all duration-300 overflow-hidden">
      <div className="flex gap-4">
        <div className="rounded-md overflow-hidden w-24 h-24 flex-shrink-0">
          <img 
            src={activeModel === "claude" ? modelInfo.claude.image : modelInfo.gpt.image} 
            alt={activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{activeModel === "claude" ? modelInfo.claude.name : modelInfo.gpt.name}</h3>
          <p className="text-muted-foreground text-sm">
            {activeModel === "claude" ? modelInfo.claude.description : modelInfo.gpt.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {activeModel === "claude" ? "98.7% Accuracy" : "96.2% Accuracy"}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {activeModel === "claude" ? "Genetic Analysis" : "Medical History Analysis"}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {activeModel === "claude" ? "Anthropic's Latest Model" : "OpenAI's Latest Model"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInfoBanner;
