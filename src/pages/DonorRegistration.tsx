
import { Link } from "react-router-dom";
import EnhancedDonorRegistrationForm from "@/components/EnhancedDonorRegistrationForm";
import { Heart, Dna, ArrowLeft, Database, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonorRegistration = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <header className="container py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Heart className="h-6 w-6 text-red-500" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <Dna className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Life Source Nexus
            </h1>
          </div>
          <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 transition-colors">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="container flex-1 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Save Lives Through Organ Donation
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Register as an organ donor on our revolutionary blockchain-powered platform. Your information will be securely stored,
            and you'll receive an NFT badge certifying your donor status. Join thousands of heroes who are ready to save lives.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>NFT Certification</span>
            </div>
          </div>
        </div>
        
        <EnhancedDonorRegistrationForm />
        
        <div className="text-center text-sm text-muted-foreground mt-12">
          <p>&copy; 2025 Life Source Nexus. All rights reserved.</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <Database className="h-3 w-3" />
            <span>Powered by blockchain technology and AI</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default DonorRegistration;
