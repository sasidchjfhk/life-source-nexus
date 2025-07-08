import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Heart, 
  Users, 
  AlertCircle,
  Check,
  Settings,
  Clock,
  MapPin
} from "lucide-react";

interface NotificationSettings {
  email: {
    newMatches: boolean;
    criticalAlerts: boolean;
    systemUpdates: boolean;
    weeklyReports: boolean;
  };
  sms: {
    newMatches: boolean;
    criticalAlerts: boolean;
    emergencyOnly: boolean;
  };
  push: {
    newMatches: boolean;
    criticalAlerts: boolean;
    systemUpdates: boolean;
  };
}

interface NotificationItem {
  id: string;
  type: 'match' | 'critical' | 'system' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const SmartNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newMatches: true,
      criticalAlerts: true,
      systemUpdates: false,
      weeklyReports: true
    },
    sms: {
      newMatches: false,
      criticalAlerts: true,
      emergencyOnly: true
    },
    push: {
      newMatches: true,
      criticalAlerts: true,
      systemUpdates: true
    }
  });
  const [emailAddress, setEmailAddress] = useState("john.doe@example.com");
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    setupNotificationListener();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = () => {
    // Mock notifications - in real app, fetch from server
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'match',
        title: 'New Match Found!',
        message: 'A 95% compatible recipient has been found for your kidney donation.',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'critical',
        title: 'Critical Patient Alert',
        message: 'Urgent: Patient in critical condition requires immediate organ match.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false,
        priority: 'critical'
      },
      {
        id: '3',
        type: 'system',
        title: 'Medical Records Updated',
        message: 'Your HLA typing results have been updated in the system.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'match',
        title: 'Match Status Update',
        message: 'Previous match has been completed successfully. Patient recovering well.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        priority: 'low'
      }
    ];
    
    setNotifications(mockNotifications);
  };

  const setupNotificationListener = () => {
    // Listen for real-time changes in the database
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, (payload) => {
        // Create notification for new matches
        if (payload.eventType === 'INSERT') {
          const newNotification: NotificationItem = {
            id: payload.new.id,
            type: 'match',
            title: 'New Match Found!',
            message: `A ${payload.new.match_score}% compatible match has been discovered.`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: payload.new.match_score >= 90 ? 'high' : 'medium'
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast({
            title: "New Match Found!",
            description: `${payload.new.match_score}% compatibility`,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const sendTestNotification = () => {
    const testNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify your settings.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low'
    };
    
    setNotifications(prev => [testNotification, ...prev]);
    
    toast({
      title: "Test Notification Sent",
      description: "Check your notification preferences work correctly.",
    });
  };

  const updateSettings = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Heart className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Smart Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={sendTestNotification}>
                Send Test
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-3 w-3 mr-1" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            <Badge variant="outline">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Email Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4" />
                  <h4 className="font-medium">Email Notifications</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-matches" className="text-sm">New Matches</Label>
                    <Switch
                      id="email-matches"
                      checked={settings.email.newMatches}
                      onCheckedChange={(value) => updateSettings('email', 'newMatches', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-critical" className="text-sm">Critical Alerts</Label>
                    <Switch
                      id="email-critical"
                      checked={settings.email.criticalAlerts}
                      onCheckedChange={(value) => updateSettings('email', 'criticalAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-system" className="text-sm">System Updates</Label>
                    <Switch
                      id="email-system"
                      checked={settings.email.systemUpdates}
                      onCheckedChange={(value) => updateSettings('email', 'systemUpdates', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reports" className="text-sm">Weekly Reports</Label>
                    <Switch
                      id="email-reports"
                      checked={settings.email.weeklyReports}
                      onCheckedChange={(value) => updateSettings('email', 'weeklyReports', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SMS Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4" />
                  <h4 className="font-medium">SMS Notifications</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-matches" className="text-sm">New Matches</Label>
                    <Switch
                      id="sms-matches"
                      checked={settings.sms.newMatches}
                      onCheckedChange={(value) => updateSettings('sms', 'newMatches', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-critical" className="text-sm">Critical Alerts</Label>
                    <Switch
                      id="sms-critical"
                      checked={settings.sms.criticalAlerts}
                      onCheckedChange={(value) => updateSettings('sms', 'criticalAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-emergency" className="text-sm">Emergency Only</Label>
                    <Switch
                      id="sms-emergency"
                      checked={settings.sms.emergencyOnly}
                      onCheckedChange={(value) => updateSettings('sms', 'emergencyOnly', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-4 w-4" />
                  <h4 className="font-medium">Push Notifications</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-matches" className="text-sm">New Matches</Label>
                    <Switch
                      id="push-matches"
                      checked={settings.push.newMatches}
                      onCheckedChange={(value) => updateSettings('push', 'newMatches', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-critical" className="text-sm">Critical Alerts</Label>
                    <Switch
                      id="push-critical"
                      checked={settings.push.criticalAlerts}
                      onCheckedChange={(value) => updateSettings('push', 'criticalAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-system" className="text-sm">System Updates</Label>
                    <Switch
                      id="push-system"
                      checked={settings.push.systemUpdates}
                      onCheckedChange={(value) => updateSettings('push', 'systemUpdates', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications;