
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  UserCog, 
  User, 
  Search, 
  PlusCircle, 
  Pencil,
  Filter,
  UserPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  department: string;
  status: "Active" | "On Leave" | "Suspended";
  verified: boolean;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  waitingFor?: string;
  status: "Waiting" | "Matched" | "Post-Op" | "Recovered";
  urgency: "Low" | "Medium" | "High" | "Critical";
}

const MedicalStaffDirectory = () => {
  const [activeTab, setActiveTab] = useState("staff");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock staff data
  const [staffData] = useState<StaffMember[]>([
    { id: "DR-001", name: "Dr. Emily Chen", role: "Doctor", specialty: "Transplant Surgery", department: "Surgery", status: "Active", verified: true },
    { id: "DR-002", name: "Dr. Robert Wilson", role: "Doctor", specialty: "Nephrology", department: "Internal Medicine", status: "Active", verified: true },
    { id: "DR-003", name: "Dr. Sarah Johnson", role: "Doctor", specialty: "Cardiology", department: "Cardiology", status: "On Leave", verified: true },
    { id: "NR-001", name: "Nancy Rodriguez", role: "Nurse", specialty: "Post-Op Care", department: "Surgery", status: "Active", verified: true },
    { id: "NR-002", name: "Michael Thompson", role: "Nurse", specialty: "Intensive Care", department: "ICU", status: "Active", verified: false },
  ]);
  
  // Mock patient data
  const [patientData] = useState<Patient[]>([
    { id: "PT-001", name: "John Smith", age: 42, bloodType: "O+", waitingFor: "Kidney", status: "Waiting", urgency: "High" },
    { id: "PT-002", name: "Maria Garcia", age: 28, bloodType: "AB-", status: "Matched", urgency: "Medium" },
    { id: "PT-003", name: "David Lee", age: 56, bloodType: "A+", waitingFor: "Heart", status: "Waiting", urgency: "Critical" },
    { id: "PT-004", name: "Susan Brown", age: 34, bloodType: "B+", status: "Post-Op", urgency: "Low" },
    { id: "PT-005", name: "James Williams", age: 48, bloodType: "O-", waitingFor: "Liver", status: "Waiting", urgency: "High" },
  ]);
  
  const getStaffStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "On Leave":
        return <Badge className="bg-yellow-500">On Leave</Badge>;
      case "Suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPatientUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-500">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };
  
  const getPatientStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Badge variant="outline">Waiting</Badge>;
      case "Matched":
        return <Badge className="bg-blue-500">Matched</Badge>;
      case "Post-Op":
        return <Badge className="bg-purple-500">Post-Op</Badge>;
      case "Recovered":
        return <Badge className="bg-green-500">Recovered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredStaff = staffData.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPatients = patientData.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.waitingFor && patient.waitingFor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    patient.bloodType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <span>Medical Directory</span>
            </CardTitle>
            <CardDescription>Manage medical staff and patient records</CardDescription>
          </div>
          <div className="mt-2 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  {activeTab === "staff" ? "Add Staff" : "Add Patient"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "staff" ? "Add New Staff Member" : "Add New Patient"}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-muted-foreground">Form implementation would go here</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="staff" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="staff" className="gap-1">
                <UserCog className="h-4 w-4" />
                <span>Medical Staff</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-1">
                <User className="h-4 w-4" />
                <span>Patients</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-auto md:min-w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={activeTab === "staff" ? "Search staff..." : "Search patients..."} 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="staff" className="space-y-4 mt-2">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No staff members found</div>
            ) : (
              filteredStaff.map((staff) => (
                <Card key={staff.id}>
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{staff.name}</span>
                        <Badge variant="outline">{staff.role}</Badge>
                        {getStaffStatusBadge(staff.status)}
                        {staff.verified && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 mt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">ID: </span>
                          <span>{staff.id}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Specialty: </span>
                          <span>{staff.specialty}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Department: </span>
                          <span>{staff.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-4 mt-2">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No patients found</div>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{patient.name}</span>
                        {getPatientStatusBadge(patient.status)}
                        {patient.status === "Waiting" && patient.urgency && getPatientUrgencyBadge(patient.urgency)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-1 mt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">ID: </span>
                          <span>{patient.id}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Age: </span>
                          <span>{patient.age}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Blood Type: </span>
                          <span>{patient.bloodType}</span>
                        </div>
                        {patient.waitingFor && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Waiting For: </span>
                            <span>{patient.waitingFor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" className="gap-1">
                        <UserPlus className="h-4 w-4" />
                        Match
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalStaffDirectory;
