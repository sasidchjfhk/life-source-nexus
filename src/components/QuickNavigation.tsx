
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, User, Hospital, ShieldCheck } from "lucide-react";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { toast } from "@/components/ui/use-toast";

const QuickNavigation = () => {
  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    toast({
      title: "Quick Login Successful",
      description: `Welcome, ${userData.name}! Redirecting you to the dashboard...`,
    });
    
    // Normally this would redirect to the appropriate dashboard based on user role
    // For demo purposes, we'll just show a toast
    
    setTimeout(() => {
      toast({
        title: "Demo Mode",
        description: "In a real app, you would now be redirected to your dashboard.",
      });
    }, 1500);
  };

  return (
    <div className="bg-secondary/10 rounded-lg p-6 border border-border/50">
      <h3 className="text-xl font-bold mb-4 text-center">Quick Navigation</h3>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/register">Register</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/donor-registration">Donor Registration</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link to="/donor-dashboard">
            <User className="h-4 w-4" />
            <span>Donor Dashboard</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link to="/hospital-dashboard">
            <Hospital className="h-4 w-4" />
            <span>Hospital Portal</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link to="/admin-dashboard">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Portal</span>
          </Link>
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground text-center mb-3">Quick Login</p>
        <div className="flex flex-wrap justify-center gap-2">
          <GoogleLoginButton 
            buttonText="Sign in as Donor"
            size="sm"
            variant="outline"
            onSuccess={handleGoogleLogin}
          />
          <GoogleLoginButton 
            buttonText="Sign in as Hospital"
            size="sm"
            variant="outline"
            onSuccess={handleGoogleLogin}
          />
          <GoogleLoginButton 
            buttonText="Sign in as Admin"
            size="sm"
            variant="outline"
            onSuccess={handleGoogleLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickNavigation;
