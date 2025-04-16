
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Wallet } from "lucide-react";

interface MapTabProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const MapTab = ({ walletConnected, onConnectWallet }: MapTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Organ Tracking Map</h2>
      <Card className="mb-8">
        <CardContent className="p-0 overflow-hidden">
          <div className="aspect-[16/9] relative">
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center max-w-md p-4">
                Connect your wallet to view the organ tracking map with real-time GPS updates.
                Live tracking helps ensure organ transportation security and transparency.
              </p>
              <Button onClick={onConnectWallet} disabled={walletConnected} className="mt-2">
                <Wallet className="h-4 w-4 mr-2" />
                {walletConnected ? "Wallet Connected" : "Connect Wallet to View Map"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapTab;
