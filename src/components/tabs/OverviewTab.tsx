
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LogIn, 
  User, 
  Hospital, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

const OverviewTab = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Life Source Nexus</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Our platform revolutionizes organ donation through blockchain technology, 
          AI matching algorithms, and secure data management.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Link to="/register" className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              <span>Register Now</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/" className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
            <User className="h-16 w-16 text-green-600 dark:text-green-400 opacity-80" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Donor Registration</h3>
            <p className="text-muted-foreground mb-4">
              Register as an organ donor and receive an NFT badge certifying your donor status.
            </p>
            <Button asChild variant="ghost" className="w-full group">
              <Link to="/donor-registration" className="flex items-center justify-between">
                <span>Become a Donor</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
            <Hospital className="h-16 w-16 text-blue-600 dark:text-blue-400 opacity-80" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Hospital Portal</h3>
            <p className="text-muted-foreground mb-4">
              Access our hospital dashboard to manage organ donation requests and matches.
            </p>
            <Button asChild variant="ghost" className="w-full group">
              <Link to="/hospital-dashboard" className="flex items-center justify-between">
                <span>Hospital Login</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
            <ShieldCheck className="h-16 w-16 text-amber-600 dark:text-amber-400 opacity-80" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Admin Portal</h3>
            <p className="text-muted-foreground mb-4">
              Administrative tools for hospital verification and fraud detection.
            </p>
            <Button asChild variant="ghost" className="w-full group">
              <Link to="/admin-dashboard" className="flex items-center justify-between">
                <span>Admin Login</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
