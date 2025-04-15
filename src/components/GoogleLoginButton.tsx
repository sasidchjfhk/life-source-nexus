
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface GoogleLoginButtonProps {
  onSuccess?: (userData: { name: string; email: string }) => void;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const GoogleLoginButton = ({
  onSuccess,
  buttonText = "Sign in with Google",
  variant = "outline",
  size = "default"
}: GoogleLoginButtonProps) => {
  const handleGoogleLogin = () => {
    // Simulate Google authentication process
    setTimeout(() => {
      const mockUserData = {
        name: "John Doe",
        email: "john.doe@example.com"
      };
      
      if (onSuccess) {
        onSuccess(mockUserData);
      }
      
      toast({
        title: "Login Successful",
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
      <Google className="h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default GoogleLoginButton;
