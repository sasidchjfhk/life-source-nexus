
import { Heart, Zap, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Bot } from "lucide-react";
import { Match } from "@/models/organMatchingData";

interface MatchItemProps {
  match: Match;
  activeModel: string;
}

const MatchItem = ({ match, activeModel }: MatchItemProps) => {
  return (
    <Card className="overflow-hidden border-gradient-to-b from-primary/10 to-transparent">
      <CardHeader className="pb-2 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Match ID: {match.id}</CardTitle>
          <div className="flex items-center gap-1">
            {activeModel === "claude" ? 
              <Sparkles className="h-3 w-3 text-amber-500" /> : 
              <Bot className="h-3 w-3 text-blue-500" />}
            <span className="text-xs text-muted-foreground">
              {activeModel === "claude" ? "Claude 3.9" : "GPT-4o"}
            </span>
          </div>
        </div>
        <CardDescription className="flex items-center">
          Compatibility: 
          <span className={`ml-1 font-medium ${
            match.compatibility > 80 ? "text-green-500" : 
            match.compatibility > 60 ? "text-blue-500" : 
            "text-red-500"
          }`}>
            {match.compatibility}%
          </span>
          <Badge 
            className="ml-2"
            variant={match.compatibility > 80 ? "default" : match.compatibility > 60 ? "secondary" : "destructive"}
          >
            {match.compatibility > 80 ? "High" : match.compatibility > 60 ? "Medium" : "Low"}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={match.donor.image} alt={match.donor.name} />
            <AvatarFallback>{match.donor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{match.donor.name}</p>
            <p className="text-muted-foreground">Donor • {match.donor.age} • {match.donor.bloodType}</p>
          </div>
        </div>
        
        <div className="relative py-2">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20"></div>
          <div className="absolute left-8 top-1/2 w-5 h-0.5 bg-primary/20"></div>
          <Zap className="h-4 w-4 text-primary absolute left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={match.recipient.image} alt={match.recipient.name} />
            <AvatarFallback>{match.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{match.recipient.name}</p>
            <p className="text-muted-foreground">Recipient • {match.recipient.age} • {match.recipient.bloodType}</p>
          </div>
        </div>
        
        <div className="text-sm mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-primary" />
            <p className="font-medium">AI Assessment:</p>
          </div>
          <div className="ml-6 space-y-1">
            <p className="text-xs text-muted-foreground flex justify-between">
              <span>Success rate:</span> 
              <span className="font-medium">{match.predicted_success}</span>
            </p>
            <p className="text-xs text-muted-foreground flex justify-between">
              <span>Complications:</span> 
              <span className="font-medium">{match.predicted_complications}</span>
            </p>
            <p className="text-xs font-medium mt-1 text-primary">{match.recommendation}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full gap-2">
          <Heart className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchItem;
