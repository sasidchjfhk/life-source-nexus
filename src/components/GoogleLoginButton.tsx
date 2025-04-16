
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
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
  const handleGoogleLogin = () => {
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
    }, 1500);
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant={variant}
      size={size}
      className="gap-2"
    >
      <Mail className="h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default GoogleLoginButton;
