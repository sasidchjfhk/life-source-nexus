
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Dna, Hospital, User, ShieldCheck, ArrowRight, LogIn } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <header className="container py-8">
        <div className="flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-primary" />
          <Dna className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-primary">Life Source Nexus</h1>
        </div>
        <p className="text-center text-xl mt-2 text-muted-foreground">
          Blockchain-powered organ donation platform
        </p>
      </header>
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to Life Source Nexus</h2>
          <p className="text-lg text-muted-foreground">
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
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
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
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Hospital className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
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
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
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
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/10 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-4 text-center">All Available Pages</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/register">Register</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/donor-registration">Donor Registration</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/donor-dashboard">Donor Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/hospital-dashboard">Hospital Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Life Source Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
