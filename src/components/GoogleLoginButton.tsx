
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface GoogleLoginButtonProps {
  onSuccess?: (userData: { name: string; email: string }) => void;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  userType?: "donor" | "hospital" | "admin";
}

const GoogleLoginButton = ({
  onSuccess,
  buttonText = "Sign in with Google",
  variant = "outline",
  size = "default",
  userType = "donor"
}: GoogleLoginButtonProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    // Prevent multiple clicks
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    
    // Show loading toast
    toast({
      title: "Authenticating...",
      description: "Connecting to Google authentication service...",
    });
    
    // Simulate Google authentication process with different mock users based on userType
    setTimeout(() => {
      let mockUserData;
      
      switch(userType) {
        case "donor":
          mockUserData = {
            name: "John Donor",
            email: "john.donor@example.com"
          };
          break;
        case "hospital":
          mockUserData = {
            name: "Dr. Sarah Hospital",
            email: "sarah.hospital@citymedical.org"
          };
          break;
        case "admin":
          mockUserData = {
            name: "Admin Michael",
            email: "michael.admin@lifesourcenexus.org"
          };
          break;
        default:
          mockUserData = {
            name: "John Doe",
            email: "john.doe@example.com"
          };
      }
      
      if (onSuccess) {
        onSuccess(mockUserData);
      }
      
      toast({
        title: `${userType.charAt(0).toUpperCase() + userType.slice(1)} Login Successful`,
        description: "You've been logged in with Google!",
      });
      
      setIsLoggingIn(false);
    }, 1500);
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant={variant}
      size={size}
      className="gap-2"
      disabled={isLoggingIn}
    >
      {/* Google logo SVG for better visual indication */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        className="h-4 w-4"
      >
        <path 
          fill="currentColor" 
          d="M12 22a10 10 0 0 1-7.1-3A9.9 9.9 0 0 1 2 12.9a9.9 9.9 0 0 1 3-7.1A9.9 9.9 0 0 1 12 2a9.7 9.7 0 0 1 7 2.9c2 2 2.9 4.3 2.9 7.1 0 2.8-1 5.2-2.9 7.1A9.9 9.9 0 0 1 12 22zm0-8.3l4.7 2.8c.2-.5.3-1 .5-1.5s.2-1.1.2-1.7c0-.7 0-1.2-.2-1.9H12V15zm-1.5 0V11H5.8a7.7 7.7 0 0 0-.2 1.9c0 .6 0 1.2.2 1.7s.3 1 .5 1.5l4.2-2.6zm1.6-4.7h5.6a7.9 7.9 0 0 0-1.3-2.4 8.7 8.7 0 0 0-4.3-2.5v4.9zm-1.5 0V4a8.5 8.5 0 0 0-4.4 2.5 8 8 0 0 0-1.3 2.4h5.7z"
        />
      </svg>
      {isLoggingIn ? "Signing in..." : buttonText}
    </Button>
  );
};

export default GoogleLoginButton;
