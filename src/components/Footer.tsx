
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              &copy; 2025 Life Source Nexus. All rights reserved.
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Privacy Policy</Button>
            <Button variant="ghost" size="sm">Terms of Service</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
