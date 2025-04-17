
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MatchItem from "./MatchItem";
import { Match } from "@/models/organMatchingData";

interface MatchesCarouselProps {
  matches: Match[];
  activeModel: string;
}

const MatchesCarousel = ({ matches, activeModel }: MatchesCarouselProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" /> 
          {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} Recommended Matches
        </h3>
        <Badge variant="outline" className="bg-primary/10">
          {matches.length} matches found
        </Badge>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {matches.map((match) => (
            <CarouselItem key={match.id} className="md:basis-1/2 lg:basis-1/3">
              <MatchItem match={match} activeModel={activeModel} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
};

export default MatchesCarousel;
