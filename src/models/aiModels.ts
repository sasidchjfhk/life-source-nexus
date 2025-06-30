
import { Sparkles, Bot } from "lucide-react";
import { ReactNode } from "react";

export interface AIModel {
  name: string;
  icon: ReactNode;
  description: string;
  image: string;
}

export const modelInfo: Record<string, AIModel> = {
  claude: {
    name: "Claude 3.9 Opus",
    icon: null, // We'll handle the icon in the component
    description: "Advanced genetic compatibility analysis with 98.7% accuracy",
    image: "https://images.unsplash.com/photo-1677442135436-7056d4ddd7c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  gpt: {
    name: "GPT-4o",
    icon: null, // We'll handle the icon in the component
    description: "Specialized in medical history pattern recognition",
    image: "https://images.unsplash.com/photo-1684921663588-a2a1277cccbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
};

// Helper function to get icons
export const getModelIcon = (modelKey: string) => {
  switch (modelKey) {
    case 'claude':
      return <Sparkles className="h-4 w-4" />;
    case 'gpt':
      return <Bot className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};
