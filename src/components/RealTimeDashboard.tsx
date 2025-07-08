import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Activity, 
  Users, 
  Heart, 
  TrendingUp, 
  Clock,
  MapPin,
  AlertCircle
} from "lucide-react";

interface DashboardStats {
  totalDonors: number;
  totalRecipients: number;
  activeMatches: number;
  successfulTransplants: number;
  criticalPatients: number;
  recentActivity: Array<{
    id: string;
    type: 'donor' | 'recipient' | 'match';
    message: string;
    timestamp: string;
  }>;
}

const RealTimeDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalRecipients: 0,
    activeMatches: 0,
    successfulTransplants: 0,
    criticalPatients: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    setupRealTimeUpdates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [donorsRes, recipientsRes, matchesRes] = await Promise.all([
        supabase.from('donors').select('*'),
        supabase.from('recipients').select('*'),
        supabase.from('matches').select('*')
      ]);

      const donors = donorsRes.data || [];
      const recipients = recipientsRes.data || [];
      const matches = matchesRes.data || [];

      setStats({
        totalDonors: donors.length,
        totalRecipients: recipients.length,
        activeMatches: matches.filter(m => m.status === 'pending').length,
        successfulTransplants: matches.filter(m => m.status === 'completed').length,
        criticalPatients: recipients.filter(r => (r.urgency_level || 0) >= 8).length,
        recentActivity: [
          ...donors.slice(-3).map(d => ({
            id: d.id,
            type: 'donor' as const,
            message: `New donor registered: ${d.name}`,
            timestamp: d.created_at || new Date().toISOString()
          })),
          ...recipients.slice(-3).map(r => ({
            id: r.id,
            type: 'recipient' as const,
            message: `New recipient registered: ${r.name}`,
            timestamp: r.created_at || new Date().toISOString()
          })),
          ...matches.slice(-2).map(m => ({
            id: m.id,
            type: 'match' as const,
            message: `New match found with ${m.match_score}% compatibility`,
            timestamp: m.matched_at || new Date().toISOString()
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donors'
      }, () => fetchDashboardData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recipients'
      }, () => fetchDashboardData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDonors}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Active and registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecipients}</div>
            <p className="text-xs text-muted-foreground">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              {stats.criticalPatients} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMatches}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Transplants</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulTransplants}</div>
            <p className="text-xs text-muted-foreground">
              <Heart className="inline h-3 w-3 mr-1" />
              Lives saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity Feed
            <Badge variant="outline" className="ml-auto animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className={`p-1.5 rounded-full ${
                  activity.type === 'donor' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'recipient' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {activity.type === 'donor' ? <Users className="h-3 w-3" /> :
                   activity.type === 'recipient' ? <Heart className="h-3 w-3" /> :
                   <Activity className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Database Connection</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Healthy
              </Badge>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Matching Algorithm</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Active
              </Badge>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Real-time Updates</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Connected
              </Badge>
            </div>
            <Progress value={98} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDashboard;