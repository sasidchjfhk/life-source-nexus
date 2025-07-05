import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Dna } from "lucide-react";
import DoctorRegistrationForm from "@/components/DoctorRegistrationForm";

const DoctorRegistration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/register">
              <ArrowLeft className="h-4 w-4" />
              Back to Registration
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <Dna className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Life Source Nexus</span>
          </div>
        </div>

        {/* Registration Form */}
        <DoctorRegistrationForm />
      </div>
    </div>
  );
};

export default DoctorRegistration;