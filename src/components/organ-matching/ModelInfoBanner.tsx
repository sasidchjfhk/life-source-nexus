
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot } from "lucide-react";
import { AIModel } from "@/models/aiModels";

interface ModelInfoBannerProps {
  showModelInfo: boolean;
  activeModel: string;
  modelInfo: Record<string, AIModel>;
}

const getModelIcon = (modelKey: string): ReactNode => {
  switch (modelKey) {
    case 'claude':
      return <Sparkles className="h-4 w-4" />;
    case 'gpt':
      return <Bot className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const ModelInfoBanner = ({ showModelInfo, activeModel, modelInfo }: ModelInfoBannerProps) => {
  if (!showModelInfo) {
    return null;
  }

  const currentModel = activeModel === "claude" ? modelInfo.claude : modelInfo.gpt;

  return (
    <div className="flex gap-4">
      <div className="rounded-md overflow-hidden w-24 h-24 flex-shrink-0">
        <img 
          src={currentModel.image} 
          alt={currentModel.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {getModelIcon(activeModel)}
          <h3 className="font-medium text-lg">{currentModel.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {currentModel.description}
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
  );
};

export default ModelInfoBanner;
