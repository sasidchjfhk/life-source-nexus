import { useState } from "react";
import { Heart, Menu, X, User, LogOut, Settings, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";

interface ProductionHeaderProps {
  isLoggedIn: boolean;
  userName: string;
  userType?: "donor" | "hospital" | "admin" | "recipient";
  onLogout: () => void;
  onLogin: (userData: { name: string; email: string }) => void;
}

const ProductionHeader = ({ 
  isLoggedIn, 
  userName, 
  userType = "donor", 
  onLogout, 
  onLogin 
}: ProductionHeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: "Donation",
      items: [
        { name: "Become a Donor", href: "/donor-registration", description: "Register as an organ donor" },
        { name: "Find Recipients", href: "/recipients", description: "View patients in need" },
        { name: "Donor Dashboard", href: "/donor-dashboard", description: "Manage your donor profile" }
      ]
    },
    {
      title: "Recipients",
      items: [
        { name: "Register as Recipient", href: "/recipient-registration", description: "Join the waiting list" },
        { name: "Recipient Dashboard", href: "/recipient-dashboard", description: "Track your status" },
        { name: "Find Donors", href: "/donors", description: "View available donors" }
      ]
    },
    {
      title: "Medical",
      items: [
        { name: "Doctor Registration", href: "/doctor-registration", description: "Register as medical professional" },
        { name: "Hospital Registration", href: "/hospital-registration", description: "Register your facility" },
        { name: "Medical Directory", href: "/medical-directory", description: "Find medical professionals" }
      ]
    },
    {
      title: "About",
      items: [
        { name: "How It Works", href: "/how-it-works", description: "Learn about our process" },
        { name: "Success Stories", href: "/success-stories", description: "Read patient testimonials" },
        { name: "Research", href: "/research", description: "Our medical research" }
      ]
    }
  ];

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserBadgeColor = (type: string) => {
    switch (type) {
      case 'donor': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'recipient': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'hospital': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleDashboardClick = () => {
    switch (userType) {
      case 'donor':
        navigate('/donor-dashboard');
        break;
      case 'recipient':
        navigate('/recipient-dashboard');
        break;
      case 'hospital':
        navigate('/hospital-dashboard');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="relative">
            <Heart className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Life Source Nexus
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Saving Lives Through Technology</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-96 gap-3 p-6">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block space-y-1 rounded-md p-3 hover:bg-accent transition-colors"
                        >
                          <div className="text-sm font-medium leading-none">{subItem.name}</div>
                          <p className="text-xs text-muted-foreground leading-snug">
                            {subItem.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          {isLoggedIn && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
            </Button>
          )}

          {/* User Menu or Login */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-full">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="text-xs">{getUserInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{userName}</span>
                      <Badge variant="secondary" className={`text-xs h-4 ${getUserBadgeColor(userType)}`}>
                        {userType.charAt(0).toUpperCase() + userType.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userName} />
                    <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDashboardClick}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy & Security
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => onLogin({ name: "Demo User", email: "demo@example.com" })}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/donor-registration")}>
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-bold">Life Source Nexus</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {navigationItems.map((item) => (
                  <div key={item.title} className="space-y-3">
                    <h3 className="font-semibold text-primary">{item.title}</h3>
                    <div className="space-y-2 pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default ProductionHeader;