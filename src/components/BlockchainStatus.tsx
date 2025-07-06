import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Shield, Link, AlertCircle, CheckCircle } from "lucide-react";
import { initializeBlockchainService, getBlockchainService } from "@/services/blockchainService";

const BlockchainStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [rpcUrl, setRpcUrl] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    // Check if blockchain service is already initialized
    const service = getBlockchainService();
    if (service && service.isInitialized()) {
      setIsConnected(true);
      setContractAddress(service.getContractAddress());
    }
  }, []);

  const handleConnect = async () => {
    if (!contractAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid contract address",
        variant: "destructive"
      });
      return;
    }

    setIsInitializing(true);
    try {
      await initializeBlockchainService({
        contractAddress: contractAddress.trim(),
        rpcUrl: rpcUrl.trim() || undefined
      });

      setIsConnected(true);
      toast({
        title: "Blockchain Connected! 🔗",
        description: "Smart contract is now ready to log organ matches",
      });

      // Load recent logs
      loadRecentLogs();
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to blockchain. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const loadRecentLogs = async () => {
    try {
      const service = getBlockchainService();
      if (service) {
        const logs = await service.getMatchLogs();
        setRecentLogs(logs.slice(0, 5)); // Show last 5 logs
      }
    } catch (error) {
      console.error('Failed to load blockchain logs:', error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRecentLogs([]);
    toast({
      title: "Disconnected",
      description: "Blockchain service has been disconnected",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Blockchain Integration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
            {isConnected ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
          {isConnected && (
            <Badge variant="outline" className="gap-1">
              <Link className="h-3 w-3" />
              Smart Contract Active
            </Badge>
          )}
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractAddress">Smart Contract Address</Label>
              <Input
                id="contractAddress"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rpcUrl">RPC URL (Optional)</Label>
              <Input
                id="rpcUrl"
                placeholder="https://eth-sepolia.g.alchemy.com/v2/..."
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use MetaMask. Provide RPC URL for server-side signing.
              </p>
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? "Connecting..." : "Connect to Blockchain"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Contract: <code className="bg-muted px-1 rounded">{contractAddress}</code>
            </div>
            
            {recentLogs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Match Logs</h4>
                <div className="space-y-1">
                  {recentLogs.map((log, index) => (
                    <div key={index} className="text-xs bg-muted p-2 rounded">
                      <div>Score: {log.matchScore}% | Block: {log.blockNumber}</div>
                      <div className="text-muted-foreground truncate">
                        TX: {log.transactionHash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadRecentLogs}
              >
                Refresh Logs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainStatus;