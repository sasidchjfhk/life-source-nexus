
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

const AIChatbot = () => {
  return (
    <div className="bg-secondary/10 rounded-lg p-6 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">AI Assistant</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Have questions about organ donation, transplant process, or our platform? Our AI assistant can help answer your questions.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link to="/donor-dashboard" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Open Chat Assistant</span>
          </Link>
        </Button>
        <Button asChild>
          <Link to="/donor-registration" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>Start Registration</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AIChatbot;
