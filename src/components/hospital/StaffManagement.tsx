import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  UserCog, 
  Search, 
  UserPlus, 
  Calendar, 
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Users,
  Activity,
  ShieldCheck
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "shift-end" | "emergency-call";
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  rating: number;
  shift: "morning" | "evening" | "night" | "rotating";
  currentLocation: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  qualifications: string[];
  joinDate: string;
  patientLoad: number;
  completedSurgeries?: number;
  successRate?: number;
}

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const staff: StaffMember[] = [
    {
      id: "DOC-001",
      name: "Dr. Sarah Johnson",
      role: "Chief of Surgery",
      department: "Surgery",
      status: "active",
      email: "s.johnson@hospital.com",
      phone: "+1 (555) 123-4567",
      specialization: ["Cardiac Surgery", "Transplant Surgery"],
      experience: 15,
      rating: 4.9,
      shift: "morning",
      currentLocation: "Operating Room 2",
      emergencyContact: {
        name: "Michael Johnson",
        phone: "+1 (555) 123-4568",
        relation: "Spouse"
      },
      qualifications: ["MD", "Board Certified Surgeon", "Fellowship in Cardiac Surgery"],
      joinDate: "2018-03-15",
      patientLoad: 8,
      completedSurgeries: 1247,
      successRate: 98.5
    },
    {
      id: "DOC-002",
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      department: "Cardiology",
      status: "active",
      email: "m.chen@hospital.com",
      phone: "+1 (555) 234-5678",
      specialization: ["Interventional Cardiology", "Heart Failure"],
      experience: 12,
      rating: 4.8,
      shift: "evening",
      currentLocation: "Cardiac Cath Lab",
      emergencyContact: {
        name: "Lisa Chen",
        phone: "+1 (555) 234-5679",
        relation: "Spouse"
      },
      qualifications: ["MD", "Board Certified Cardiologist", "Fellowship in Interventional Cardiology"],
      joinDate: "2019-08-20",
      patientLoad: 15,
      completedSurgeries: 456,
      successRate: 96.8
    },
    {
      id: "NUR-001",
      name: "Emily Rodriguez",
      role: "Charge Nurse",
      department: "ICU",
      status: "on-leave",
      email: "e.rodriguez@hospital.com",
      phone: "+1 (555) 345-6789",
      specialization: ["Critical Care", "Emergency Medicine"],
      experience: 8,
      rating: 4.7,
      shift: "night",
      currentLocation: "Off Duty",
      emergencyContact: {
        name: "Carlos Rodriguez",
        phone: "+1 (555) 345-6790",
        relation: "Brother"
      },
      qualifications: ["RN", "BSN", "Critical Care Certification"],
      joinDate: "2020-01-10",
      patientLoad: 6
    },
    {
      id: "DOC-003",
      name: "Dr. Lisa Thompson",
      role: "Emergency Physician",
      department: "Emergency",
      status: "emergency-call",
      email: "l.thompson@hospital.com",
      phone: "+1 (555) 456-7890",
      specialization: ["Emergency Medicine", "Trauma Care"],
      experience: 10,
      rating: 4.6,
      shift: "rotating",
      currentLocation: "Emergency Room",
      emergencyContact: {
        name: "David Thompson",
        phone: "+1 (555) 456-7891",
        relation: "Spouse"
      },
      qualifications: ["MD", "Board Certified Emergency Medicine", "ACLS Certified"],
      joinDate: "2019-06-15",
      patientLoad: 12,
      completedSurgeries: 89,
      successRate: 94.2
    },
    {
      id: "TEC-001",
      name: "James Wilson",
      role: "Radiology Technician",
      department: "Radiology",
      status: "shift-end",
      email: "j.wilson@hospital.com",
      phone: "+1 (555) 567-8901",
      specialization: ["MRI", "CT Scan", "X-Ray"],
      experience: 6,
      rating: 4.5,
      shift: "morning",
      currentLocation: "Locker Room",
      emergencyContact: {
        name: "Mary Wilson",
        phone: "+1 (555) 567-8902",
        relation: "Mother"
      },
      qualifications: ["Associate Degree in Radiologic Technology", "ARRT Certified"],
      joinDate: "2021-02-01",
      patientLoad: 25
    }
  ];

  const departments = ["all", "Surgery", "Cardiology", "ICU", "Emergency", "Radiology", "Oncology", "Pediatrics"];
  const statusOptions = ["all", "active", "on-leave", "shift-end", "emergency-call"];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "on-leave":
        return <Badge className="bg-gray-600">On Leave</Badge>;
      case "shift-end":
        return <Badge className="bg-blue-600">Shift Ended</Badge>;
      case "emergency-call":
        return <Badge variant="destructive">Emergency Call</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getShiftBadge = (shift: string) => {
    switch (shift) {
      case "morning":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Morning</Badge>;
      case "evening":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Evening</Badge>;
      case "night":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Night</Badge>;
      case "rotating":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Rotating</Badge>;
      default:
        return <Badge variant="outline">{shift}</Badge>;
    }
  };

  const sendMessage = (staffId: string) => {
    toast({
      title: "Message Sent",
      description: `Message sent to staff member ${staffId}`,
    });
  };

  const scheduleShift = (staffId: string) => {
    toast({
      title: "Shift Scheduled",
      description: `Shift has been scheduled for staff member ${staffId}`,
    });
  };

  // Calculate statistics
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === "active").length;
  const onLeaveStaff = staff.filter(s => s.status === "on-leave").length;
  const avgRating = Math.round((staff.reduce((sum, s) => sum + s.rating, 0) / totalStaff) * 10) / 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="h-7 w-7 text-primary" />
            Staff Management
          </h2>
          <p className="text-muted-foreground">Manage hospital staff and schedules</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">All staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Currently Active</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStaff}</div>
            <p className="text-xs text-muted-foreground">On duty now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{onLeaveStaff}</div>
            <p className="text-xs text-muted-foreground">Not available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{avgRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staff Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid gap-4">
        {filteredStaff.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    {getStatusBadge(member.status)}
                    {getShiftBadge(member.shift)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID:</span> {member.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Role:</span> {member.role}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span> {member.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Rating:</span> 
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{member.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedStaff(member)}>
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{member.name} - Profile</DialogTitle>
                      </DialogHeader>
                      {selectedStaff && (
                        <Tabs defaultValue="overview" className="mt-4">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="font-semibold">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStaff.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStaff.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStaff.currentLocation}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold">Emergency Contact</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Name:</span> {selectedStaff.emergencyContact.name}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Phone:</span> {selectedStaff.emergencyContact.phone}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Relation:</span> {selectedStaff.emergencyContact.relation}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-semibold">Specializations</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedStaff.specialization.map((spec, index) => (
                                  <Badge key={index} variant="secondary">{spec}</Badge>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="qualifications" className="space-y-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                Qualifications & Certifications
                              </h4>
                              <div className="space-y-2">
                                {selectedStaff.qualifications.map((qual, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                    <Award className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm">{qual}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Years of Experience:</span>
                                <p className="text-lg font-semibold">{selectedStaff.experience} years</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Join Date:</span>
                                <p className="text-lg font-semibold">{selectedStaff.joinDate}</p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="performance" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Current Patient Load:</span>
                                <p className="text-2xl font-bold text-blue-600">{selectedStaff.patientLoad}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Overall Rating:</span>
                                <div className="flex items-center gap-1">
                                  <p className="text-2xl font-bold text-yellow-600">{selectedStaff.rating}</p>
                                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              {selectedStaff.completedSurgeries && (
                                <>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Completed Surgeries:</span>
                                    <p className="text-2xl font-bold text-green-600">{selectedStaff.completedSurgeries}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Success Rate:</span>
                                    <p className="text-2xl font-bold text-green-600">{selectedStaff.successRate}%</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" variant="outline" onClick={() => sendMessage(member.id)}>
                    <Mail className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => scheduleShift(member.id)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Experience:</span>
                    <span>{member.experience} years</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Current Location:</span>
                    <span>{member.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Patient Load:</span>
                    <span>{member.patientLoad} patients</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Join Date:</span>
                    <span>{member.joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No staff members found matching your criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffManagement;