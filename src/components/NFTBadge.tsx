import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Sparkles, Shield, Heart, Trophy, Star } from "lucide-react";

interface NFTBadgeProps {
  badgeId: string;
  type?: "donor" | "hospital" | "doctor" | "achievement";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const NFTBadge = ({ badgeId, type = "donor", size = "md", className = "" }: NFTBadgeProps) => {
  const getBadgeInfo = (id: string) => {
    if (id.includes('donor-registration')) {
      return {
        title: "Verified Donor",
        description: "Blockchain-certified organ donor",
        icon: Heart,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    }
    
    if (id.includes('hospital-verification')) {
      return {
        title: "Verified Hospital",
        description: "Admin-verified healthcare facility",
        icon: Shield,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      };
    }
    
    if (id.includes('doctor-certification')) {
      return {
        title: "Certified Doctor",
        description: "Licensed medical professional",
        icon: Award,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    }
    
    if (id.includes('achievement')) {
      return {
        title: "Achievement Badge",
        description: "Special recognition",
        icon: Trophy,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200"
      };
    }
    
    // Default badge
    return {
      title: "NFT Badge",
      description: "Blockchain certificate",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    };
  };

  const badgeInfo = getBadgeInfo(badgeId);
  const IconComponent = badgeInfo.icon;

  const sizeClasses = {
    sm: {
      card: "p-2",
      icon: "h-4 w-4",
      title: "text-xs",
      description: "text-xs",
      badge: "text-xs px-1"
    },
    md: {
      card: "p-3",
      icon: "h-5 w-5",
      title: "text-sm",
      description: "text-xs",
      badge: "text-xs px-2"
    },
    lg: {
      card: "p-4",
      icon: "h-6 w-6",
      title: "text-base",
      description: "text-sm",
      badge: "text-sm px-3"
    }
  };

  const classes = sizeClasses[size];

  return (
    <Card className={`${badgeInfo.bgColor} ${badgeInfo.borderColor} border-2 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className={classes.card}>
        <div className="flex items-start gap-2">
          <div className={`${badgeInfo.bgColor} p-2 rounded-full`}>
            <IconComponent className={`${classes.icon} ${badgeInfo.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`${classes.title} font-semibold ${badgeInfo.color}`}>
                {badgeInfo.title}
              </h4>
              <Badge variant="outline" className={`${classes.badge} ${badgeInfo.color} border-current`}>
                <Sparkles className="h-3 w-3 mr-1" />
                NFT
              </Badge>
            </div>
            <p className={`${classes.description} text-muted-foreground mt-1`}>
              {badgeInfo.description}
            </p>
            <div className={`${classes.description} text-muted-foreground mt-1 font-mono`}>
              #{badgeId.split('-').pop()?.substring(0, 8)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTBadge;