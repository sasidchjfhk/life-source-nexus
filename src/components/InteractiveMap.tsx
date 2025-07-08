import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Users, 
  Heart, 
  Filter,
  ZoomIn,
  ZoomOut,
  Navigation
} from "lucide-react";

interface MapData {
  donors: Array<{
    id: string;
    name: string;
    location: string;
    bloodType: string;
    organ: string;
    availability: boolean;
  }>;
  recipients: Array<{
    id: string;
    name: string;
    location: string;
    bloodType: string;
    requiredOrgan: string;
    urgencyLevel: number;
  }>;
  hospitals: Array<{
    id: string;
    name: string;
    location: string;
    type: string;
  }>;
}

const InteractiveMap = () => {
  const [mapData, setMapData] = useState<MapData>({
    donors: [],
    recipients: [],
    hospitals: []
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'donors' | 'recipients' | 'hospitals'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const [donorsRes, recipientsRes] = await Promise.all([
        supabase.from('donors').select('*'),
        supabase.from('recipients').select('*')
      ]);

      const donors = (donorsRes.data || []).map(d => ({
        id: d.id,
        name: d.name,
        location: d.location || 'Unknown',
        bloodType: d.blood_type,
        organ: d.organ,
        availability: d.availability || false
      }));

      const recipients = (recipientsRes.data || []).map(r => ({
        id: r.id,
        name: r.name,
        location: r.location || 'Unknown',
        bloodType: r.blood_type,
        requiredOrgan: r.required_organ,
        urgencyLevel: r.urgency_level || 1
      }));

      // Mock hospital data
      const hospitals = [
        { id: 'h1', name: 'City Medical Center', location: 'Downtown', type: 'General Hospital' },
        { id: 'h2', name: 'St. Johns Hospital', location: 'Midtown', type: 'Specialty Care' },
        { id: 'h3', name: 'Metro Health', location: 'Uptown', type: 'Trauma Center' },
        { id: 'h4', name: 'Regional Medical', location: 'Westside', type: 'Research Hospital' }
      ];

      setMapData({ donors, recipients, hospitals });
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = () => {
    switch (activeFilter) {
      case 'donors':
        return mapData.donors.map(d => ({ ...d, type: 'donor' }));
      case 'recipients':
        return mapData.recipients.map(r => ({ ...r, type: 'recipient' }));
      case 'hospitals':
        return mapData.hospitals.map(h => ({ ...h, type: 'hospital' }));
      default:
        return [
          ...mapData.donors.map(d => ({ ...d, type: 'donor' })),
          ...mapData.recipients.map(r => ({ ...r, type: 'recipient' })),
          ...mapData.hospitals.map(h => ({ ...h, type: 'hospital' }))
        ];
    }
  };

  const getLocationCounts = (): Record<string, { donors: number; recipients: number; hospitals: number }> => {
    const locations: Record<string, { donors: number; recipients: number; hospitals: number }> = {};
    getFilteredData().forEach(item => {
      const loc = item.location;
      if (!locations[loc]) {
        locations[loc] = { donors: 0, recipients: 0, hospitals: 0 };
      }
      if (item.type === 'donor') {
        locations[loc].donors++;
      } else if (item.type === 'recipient') {
        locations[loc].recipients++;
      } else {
        locations[loc].hospitals++;
      }
    });
    return locations;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg animate-pulse flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const locationCounts = getLocationCounts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Interactive Geographic Map
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            <Filter className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button
            variant={activeFilter === 'donors' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('donors')}
          >
            <Users className="h-3 w-3 mr-1" />
            Donors ({mapData.donors.length})
          </Button>
          <Button
            variant={activeFilter === 'recipients' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('recipients')}
          >
            <Heart className="h-3 w-3 mr-1" />
            Recipients ({mapData.recipients.length})
          </Button>
          <Button
            variant={activeFilter === 'hospitals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('hospitals')}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Hospitals ({mapData.hospitals.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Visualization */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border-2 border-dashed border-border relative overflow-hidden">
          {/* Mock map background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              <path d="M50,50 Q200,30 350,80 Q320,150 280,200 Q150,250 50,180 Z" fill="currentColor" />
              <path d="M100,100 Q250,80 300,150 Q270,200 200,220 Q120,200 100,150 Z" fill="currentColor" />
            </svg>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Navigation className="h-3 w-3" />
            </Button>
          </div>

          {/* Location markers */}
          {Object.entries(locationCounts).map(([location, counts], index) => {
            const total = counts.donors + counts.recipients + counts.hospitals;
            const x = 20 + (index * 60) % 320;
            const y = 40 + Math.floor(index / 5) * 80;
            
            return (
              <div
                key={location}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  selectedLocation === location ? 'scale-110 z-10' : 'hover:scale-105'
                }`}
                style={{ left: `${x}px`, top: `${y}px` }}
                onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
              >
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                    total > 5 ? 'bg-red-500' : 
                    total > 2 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                      {total}
                    </div>
                  </div>
                  
                  {selectedLocation === location && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-3 min-w-48 z-20">
                      <h4 className="font-semibold mb-2">{location}</h4>
                      <div className="space-y-1 text-sm">
                        {counts.donors > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-blue-500" />
                            <span>{counts.donors} Donors</span>
                          </div>
                        )}
                        {counts.recipients > 0 && (
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>{counts.recipients} Recipients</span>
                          </div>
                        )}
                        {counts.hospitals > 0 && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-green-500" />
                            <span>{counts.hospitals} Hospitals</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Location List */}
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(locationCounts).map(([location, counts]) => (
            <div
              key={location}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedLocation === location ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'
              }`}
              onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{location}</h4>
                <Badge variant="outline">
                  {counts.donors + counts.recipients + counts.hospitals}
                </Badge>
              </div>
              <div className="flex gap-3 text-sm text-muted-foreground">
                {counts.donors > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    {counts.donors}
                  </span>
                )}
                {counts.recipients > 0 && (
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    {counts.recipients}
                  </span>
                )}
                {counts.hospitals > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-green-500" />
                    {counts.hospitals}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Donors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Recipients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Hospitals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Activity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;