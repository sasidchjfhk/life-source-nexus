
import { Link } from "react-router-dom";
import DonorRegistrationForm from "@/components/DonorRegistrationForm";
import { Heart, Dna, ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonorRegistration = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/5 p-4">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <Dna className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Life Source Nexus</h1>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="container flex-1 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Organ Donor Registration</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Register as an organ donor on our blockchain-powered platform. Your information will be securely stored
            and you'll receive an NFT badge certifying your donor status.
          </p>
        </div>
        
        <DonorRegistrationForm />
        
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>&copy; 2025 Life Source Nexus. All rights reserved.</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <Database className="h-3 w-3" />
            <span>Powered by blockchain technology</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default DonorRegistration;
