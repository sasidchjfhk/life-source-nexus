
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface TrackingPoint {
  id: string;
  lat: number;
  lng: number;
  timestamp: string;
  status: string;
  location: string;
}

interface OrganTrackingMapProps {
  organId?: string;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

const OrganTrackingMap = ({ 
  organId, 
  isWalletConnected, 
  onConnectWallet 
}: OrganTrackingMapProps) => {
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingPoint[]>([]);

  // Simulate fetching tracking data when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: TrackingPoint[] = [
          {
            id: "1",
            lat: 40.7128,
            lng: -74.0060,
            timestamp: "2025-04-15T08:30:00Z",
            status: "In Transit",
            location: "New York Medical Center"
          },
          {
            id: "2",
            lat: 40.7282,
            lng: -73.7949,
            timestamp: "2025-04-15T09:45:00Z",
            status: "In Transit",
            location: "Queens Medical Checkpoint"
          },
          {
            id: "3",
            lat: 40.6782,
            lng: -73.9442,
            timestamp: "2025-04-15T11:15:00Z",
            status: "Arrived",
            location: "Brooklyn General Hospital"
          }
        ];
        setTrackingData(mockData);
        setLoading(false);
      }, 2000);
    }
  }, [isWalletConnected]);

  if (!isWalletConnected) {
    return (
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="aspect-[16/9] relative">
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center p-6">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Connect your wallet to view the organ tracking map with real-time GPS updates.
                Blockchain verification ensures secure and transparent organ transportation.
              </p>
              <Button onClick={onConnectWallet}>
                Connect Wallet to View Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="aspect-[16/9] relative">
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading tracking data from the blockchain...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden">
        <div className="aspect-[16/9] relative">
          {/* Map placeholder - in a real app, this would be an actual map */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            {/* Map visualization would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-lg p-4">
                <h3 className="font-bold text-center mb-4">Organ Tracking Timeline</h3>
                <div className="space-y-4">
                  {trackingData.map((point, index) => (
                    <div key={point.id} className="relative pl-8 pb-4">
                      {index < trackingData.length - 1 && (
                        <div className="absolute left-3.5 top-3.5 bottom-0 w-0.5 bg-primary/20" />
                      )}
                      <div className="absolute left-0 rounded-full bg-primary p-1.5">
                        <MapPin className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-card rounded-lg border p-3 shadow-sm">
                        <div className="font-medium">{point.location}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Status: {point.status}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(point.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganTrackingMap;
