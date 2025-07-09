import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabaseDataService } from "@/services/supabaseDataService";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Heart, 
  Hospital, 
  UserCheck,
  Activity,
  AlertCircle
} from "lucide-react";

interface ApprovalItem {
  id: string;
  entity_type: string;
  entity_id: string;
  status: string;
  created_at: string;
  comments?: string;
  entity_data?: any;
}

const AdminApprovalPanel = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [comments, setComments] = useState("");

  useEffect(() => {
    loadApprovals();
    setupRealTimeUpdates();
  }, []);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const approvalsData = await supabaseDataService.getApprovals();
      
      // Fetch entity data for each approval
      const enrichedApprovals = await Promise.all(
        approvalsData.map(async (approval) => {
          let entityData = null;
          try {
            if (approval.entity_type === 'donor') {
              const { data, error } = await supabase.from('donors').select('*').eq('id', approval.entity_id).single();
              if (!error) entityData = data;
            } else if (approval.entity_type === 'recipient') {
              const { data, error } = await supabase.from('recipients').select('*').eq('id', approval.entity_id).single();
              if (!error) entityData = data;
            } else if (approval.entity_type === 'hospital') {
              const { data, error } = await supabase.from('hospitals').select('*').eq('id', approval.entity_id).single();
              if (!error) entityData = data;
            } else if (approval.entity_type === 'doctor') {
              const { data, error } = await supabase.from('doctors').select('*').eq('id', approval.entity_id).single();
              if (!error) entityData = data;
            }
          } catch (err) {
            console.warn('Could not fetch entity data:', err);
          }
          
          return {
            ...approval,
            entity_data: entityData
          };
        })
      );
      
      setApprovals(enrichedApprovals);
    } catch (error) {
      console.error('Error loading approvals:', error);
      toast({
        title: "Error Loading Approvals",
        description: "Failed to load approval data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('approval-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'approvals'
      }, () => {
        loadApprovals();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'donors'
      }, () => {
        loadApprovals();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recipients'
      }, () => {
        loadApprovals();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hospitals'
      }, () => {
        loadApprovals();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors'
      }, () => {
        loadApprovals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApproval = async (approvalId: string, status: 'approved' | 'rejected') => {
    try {
      await supabaseDataService.updateApprovalStatus(approvalId, status, comments);
      
      // Update the entity's approval status
      const approval = approvals.find(a => a.id === approvalId);
      if (approval) {
        if (approval.entity_type === 'donor') {
          await supabase.from('donors').update({ approval_status: status }).eq('id', approval.entity_id);
        } else if (approval.entity_type === 'recipient') {
          await supabase.from('recipients').update({ approval_status: status }).eq('id', approval.entity_id);
        } else if (approval.entity_type === 'hospital') {
          await supabase.from('hospitals').update({ approval_status: status }).eq('id', approval.entity_id);
        } else if (approval.entity_type === 'doctor') {
          await supabase.from('doctors').update({ approval_status: status }).eq('id', approval.entity_id);
        }
      }
      
      toast({
        title: status === 'approved' ? "Application Approved" : "Application Rejected",
        description: `The ${approval?.entity_type} application has been ${status}.`,
      });
      
      setSelectedItem(null);
      setComments("");
      loadApprovals();
    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'donor':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'recipient':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'hospital':
        return <Hospital className="h-4 w-4 text-green-500" />;
      case 'doctor':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const approvedApprovals = approvals.filter(a => a.status === 'approved');
  const rejectedApprovals = approvals.filter(a => a.status === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Applications rejected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvals.length}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedApprovals.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedApprovals.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">No Pending Approvals</h3>
                <p className="text-muted-foreground">All applications have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map((approval) => (
              <Card key={approval.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIconForType(approval.entity_type)}
                      <div>
                        <CardTitle className="capitalize">
                          {approval.entity_type} Application
                        </CardTitle>
                        <CardDescription>
                          Submitted {new Date(approval.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {approval.entity_data && (
                    <div className="grid gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {approval.entity_data.name?.split(' ').map((n: string) => n[0]).join('') || 'NA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{approval.entity_data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {approval.entity_data.email || approval.entity_data.contact_person}
                          </p>
                        </div>
                      </div>
                      
                      {approval.entity_type === 'donor' && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Blood Type: <span className="font-medium">{approval.entity_data.blood_type}</span></div>
                          <div>Organ: <span className="font-medium">{approval.entity_data.organ}</span></div>
                          <div>Location: <span className="font-medium">{approval.entity_data.location || 'Not specified'}</span></div>
                        </div>
                      )}
                      
                      {approval.entity_type === 'recipient' && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Blood Type: <span className="font-medium">{approval.entity_data.blood_type}</span></div>
                          <div>Required Organ: <span className="font-medium">{approval.entity_data.required_organ}</span></div>
                          <div>Urgency: <span className="font-medium">{approval.entity_data.urgency_level}/10</span></div>
                          <div>Location: <span className="font-medium">{approval.entity_data.location || 'Not specified'}</span></div>
                        </div>
                      )}
                      
                      {approval.entity_type === 'hospital' && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Type: <span className="font-medium">{approval.entity_data.hospital_type}</span></div>
                          <div>Capacity: <span className="font-medium">{approval.entity_data.bed_capacity} beds</span></div>
                          <div>License: <span className="font-medium">{approval.entity_data.license_number}</span></div>
                          <div>Contact: <span className="font-medium">{approval.entity_data.phone}</span></div>
                        </div>
                      )}
                      
                      {approval.entity_type === 'doctor' && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Specialization: <span className="font-medium">{approval.entity_data.specialization}</span></div>
                          <div>Experience: <span className="font-medium">{approval.entity_data.years_of_experience} years</span></div>
                          <div>License: <span className="font-medium">{approval.entity_data.license_number}</span></div>
                          <div>Contact: <span className="font-medium">{approval.entity_data.phone}</span></div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedItem(approval)}
                      variant="outline"
                      size="sm"
                    >
                      Review
                    </Button>
                    <Button
                      onClick={() => handleApproval(approval.id, 'approved')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproval(approval.id, 'rejected')}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {approvedApprovals.map((approval) => (
            <Card key={approval.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIconForType(approval.entity_type)}
                    <div>
                      <CardTitle className="capitalize">
                        {approval.entity_type} - {approval.entity_data?.name || 'Unknown'}
                      </CardTitle>
                      <CardDescription>
                        Approved {new Date(approval.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {rejectedApprovals.map((approval) => (
            <Card key={approval.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIconForType(approval.entity_type)}
                    <div>
                      <CardTitle className="capitalize">
                        {approval.entity_type} - {approval.entity_data?.name || 'Unknown'}
                      </CardTitle>
                      <CardDescription>
                        Rejected {new Date(approval.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Rejected
                  </Badge>
                </div>
              </CardHeader>
              {approval.comments && (
                <CardContent>
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    <p className="text-sm">{approval.comments}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedItem && (
        <Card className="fixed inset-4 z-50 bg-background border-2 shadow-2xl">
          <CardHeader>
            <CardTitle className="capitalize">
              Review {selectedItem.entity_type} Application
            </CardTitle>
            <CardDescription>
              Application ID: {selectedItem.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItem.entity_data && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <h4 className="font-semibold">Application Details</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
                    {JSON.stringify(selectedItem.entity_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Add any comments or feedback..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedItem(null);
                  setComments("");
                }}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApproval(selectedItem.id, 'rejected')}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApproval(selectedItem.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminApprovalPanel;