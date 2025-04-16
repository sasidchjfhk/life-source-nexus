
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Heart, Search, Check, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MatchingData {
  id: string;
  donor: string;
  recipient: string;
  organ: string;
  matchScore: number;
  status: "Pending" | "Matched" | "Rejected";
}

const OrganMatchingPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrgan, setFilterOrgan] = useState("all");
  
  // Mock organ matching data
  const [matchingData, setMatchingData] = useState<MatchingData[]>([
    { id: "M-001", donor: "James Wilson", recipient: "Maria Lopez", organ: "Kidney", matchScore: 95, status: "Pending" },
    { id: "M-002", donor: "Sarah Chen", recipient: "David Brown", organ: "Liver", matchScore: 87, status: "Pending" },
    { id: "M-003", donor: "Robert Miller", recipient: "John Davis", organ: "Heart", matchScore: 92, status: "Matched" },
    { id: "M-004", donor: "Emily Johnson", recipient: "Laura Martinez", organ: "Kidney", matchScore: 76, status: "Pending" },
    { id: "M-005", donor: "Michael Taylor", recipient: "Thomas Lee", organ: "Bone Marrow", matchScore: 89, status: "Rejected" },
  ]);
  
  const handleApproveMatch = (id: string) => {
    setMatchingData(matchingData.map(match => 
      match.id === id ? { ...match, status: "Matched" } : match
    ));
    toast({
      title: "Match Approved",
      description: `Match ID: ${id} has been approved.`,
    });
  };
  
  const handleRejectMatch = (id: string) => {
    setMatchingData(matchingData.map(match => 
      match.id === id ? { ...match, status: "Rejected" } : match
    ));
    toast({
      title: "Match Rejected",
      description: `Match ID: ${id} has been rejected.`,
    });
  };
  
  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-500">High ({score}%)</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-yellow-500">Medium ({score}%)</Badge>;
    } else {
      return <Badge className="bg-orange-500">Low ({score}%)</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Matched":
        return <Badge className="bg-green-500">Matched</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const filteredMatches = matchingData.filter(match => {
    const searchMatch = match.donor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        match.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        match.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const organMatch = filterOrgan === "all" || match.organ.toLowerCase() === filterOrgan.toLowerCase();
    
    return searchMatch && organMatch;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Organ Matching System</span>
            </CardTitle>
            <CardDescription>Match donors with recipients based on compatibility</CardDescription>
          </div>
          <Button size="sm" className="mt-2 md:mt-0">Run AI Matching</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or ID..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterOrgan} onValueChange={setFilterOrgan}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by organ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organs</SelectItem>
                <SelectItem value="kidney">Kidney</SelectItem>
                <SelectItem value="liver">Liver</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
                <SelectItem value="bone marrow">Bone Marrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No matching results found</div>
          ) : (
            filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Match ID: {match.id}</span>
                        {getStatusBadge(match.status)}
                        <Badge variant="outline">{match.organ}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        <div>
                          <div className="text-sm font-medium">Donor</div>
                          <div className="text-sm text-muted-foreground">{match.donor}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Recipient</div>
                          <div className="text-sm text-muted-foreground">{match.recipient}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Match Score</div>
                          <div>{getMatchScoreBadge(match.matchScore)}</div>
                        </div>
                      </div>
                    </div>
                    {match.status === "Pending" && (
                      <div className="flex gap-2 items-start">
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleApproveMatch(match.id)}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleRejectMatch(match.id)}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganMatchingPanel;
