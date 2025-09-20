import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Shield, Heart, Trophy, Medal, Eye, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface NFTBadge {
  id: string;
  badge_type: string;
  badge_name: string;
  description: string;
  blockchain_tx_hash: string;
  minted_at: string;
  metadata: any;
}

interface NFTBadgeDisplayProps {
  userId?: string;
  userType: "donor" | "recipient" | "doctor" | "hospital";
  className?: string;
}

const NFTBadgeDisplay = ({ userId, userType, className = "" }: NFTBadgeDisplayProps) => {
  const [badges, setBadges] = useState<NFTBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<NFTBadge | null>(null);

  useEffect(() => {
    loadNFTBadges();
  }, [userId, userType]);

  const loadNFTBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('nft_badges')
        .select('*')
        .eq('user_type', userType)
        .order('minted_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading NFT badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'donor-registration':
        return Heart;
      case 'medical-verification':
        return Shield;
      case 'achievement':
        return Trophy;
      case 'hospital-verification':
        return Award;
      default:
        return Medal;
    }
  };

  const getBadgeColors = (badgeType: string) => {
    switch (badgeType) {
      case 'donor-registration':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-red-500'
        };
      case 'medical-verification':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-500'
        };
      case 'achievement':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-600 dark:text-amber-400',
          icon: 'text-amber-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
          border: 'border-purple-200 dark:border-purple-800',
          text: 'text-purple-600 dark:text-purple-400',
          icon: 'text-purple-500'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            NFT Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            NFT Badges
            <Badge variant="secondary" className="ml-2">
              {badges.length}
            </Badge>
          </CardTitle>
          {badges.length > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Blockchain Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No NFT badges yet</p>
            <p className="text-sm text-muted-foreground">
              Complete your registration and verification to earn your first NFT badge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const IconComponent = getBadgeIcon(badge.badge_type);
              const colors = getBadgeColors(badge.badge_type);
              
              return (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <IconComponent className={`h-5 w-5 ${colors.icon}`} />
                            NFT Badge Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className={`p-6 rounded-lg text-center ${colors.bg}`}>
                            <IconComponent className={`h-12 w-12 ${colors.icon} mx-auto mb-3`} />
                            <h3 className={`font-semibold text-lg ${colors.text}`}>
                              {badge.badge_name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              {badge.description}
                            </p>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Minted:</span>
                              <span className="font-medium">{formatDate(badge.minted_at)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Blockchain TX:</span>
                              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {badge.blockchain_tx_hash.slice(0, 12)}...
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Verification:</span>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Verified
                              </Badge>
                            </div>
                          </div>

                          <Button className="w-full" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Blockchain
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-semibold ${colors.text}`}>
                      {badge.badge_name.replace(/^[^-]+-/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className={`text-xs ${colors.text} border-current`}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        NFT
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(badge.minted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Animated sparkle effect */}
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTBadgeDisplay;