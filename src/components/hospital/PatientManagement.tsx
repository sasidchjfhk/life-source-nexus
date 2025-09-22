import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  UserPlus, 
  Calendar, 
  FileText, 
  Heart,
  Clock,
  AlertTriangle,
  Activity,
  Pill,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  condition: string;
  status: "stable" | "critical" | "recovering" | "emergency";
  room: string;
  doctor: string;
  admissionDate: string;
  lastVitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
  medications: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const patients: Patient[] = [
    {
      id: "P-001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      condition: "Kidney Failure",
      status: "critical",
      room: "ICU-201",
      doctor: "Dr. Sarah Johnson",
      admissionDate: "2025-04-10",
      lastVitals: {
        heartRate: 95,
        bloodPressure: "140/90",
        temperature: 99.2,
        oxygenSat: 96
      },
      medications: ["Lisinopril", "Furosemide", "Metoprolol"],
      allergies: ["Penicillin", "Latex"],
      emergencyContact: {
        name: "Mary Smith",
        phone: "+1 (555) 123-4567",
        relation: "Spouse"
      }
    },
    {
      id: "P-002",
      name: "Emma Davis",
      age: 32,
      gender: "Female",
      bloodType: "A-",
      condition: "Heart Transplant Recovery",
      status: "recovering",
      room: "Room-315",
      doctor: "Dr. Michael Chen",
      admissionDate: "2025-04-15",
      lastVitals: {
        heartRate: 78,
        bloodPressure: "120/80",
        temperature: 98.6,
        oxygenSat: 99
      },
      medications: ["Tacrolimus", "Mycophenolate", "Prednisone"],
      allergies: ["None known"],
      emergencyContact: {
        name: "Robert Davis",
        phone: "+1 (555) 987-6543",
        relation: "Father"
      }
    },
    {
      id: "P-003",
      name: "Carlos Rodriguez",
      age: 28,
      gender: "Male",
      bloodType: "B+",
      condition: "Liver Disease",
      status: "stable",
      room: "Room-210",
      doctor: "Dr. Lisa Thompson",
      admissionDate: "2025-04-12",
      lastVitals: {
        heartRate: 72,
        bloodPressure: "118/75",
        temperature: 98.4,
        oxygenSat: 98
      },
      medications: ["Lactulose", "Rifaximin", "Spironolactone"],
      allergies: ["Shellfish"],
      emergencyContact: {
        name: "Maria Rodriguez",
        phone: "+1 (555) 456-7890",
        relation: "Sister"
      }
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "emergency":
        return <Badge className="bg-red-600">Emergency</Badge>;
      case "stable":
        return <Badge className="bg-green-600">Stable</Badge>;
      case "recovering":
        return <Badge className="bg-blue-600">Recovering</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdateVitals = () => {
    toast({
      title: "Vitals Updated",
      description: "Patient vitals have been recorded successfully.",
    });
  };

  const handleAddMedication = () => {
    toast({
      title: "Medication Added",
      description: "New medication has been added to patient record.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Patient Management
          </h2>
          <p className="text-muted-foreground">Manage patient records and care</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Admit New Patient
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Patients</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:border-primary transition-colors ${
                    selectedPatient?.id === patient.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">{patient.id}</p>
                    </div>
                    {getStatusBadge(patient.status)}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span>{patient.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="text-xs">{patient.doctor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedPatient.name}</CardTitle>
                    <CardDescription>Patient ID: {selectedPatient.id}</CardDescription>
                  </div>
                  {getStatusBadge(selectedPatient.status)}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="vitals">Vitals</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="records">Records</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age:</span>
                            <span>{selectedPatient.age} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gender:</span>
                            <span>{selectedPatient.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blood Type:</span>
                            <span>{selectedPatient.bloodType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room:</span>
                            <span>{selectedPatient.room}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Admitted:</span>
                            <span>{selectedPatient.admissionDate}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Emergency Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span>{selectedPatient.emergencyContact.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Relation:</span>
                            <span>{selectedPatient.emergencyContact.relation}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{selectedPatient.emergencyContact.phone}</span>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Medical Condition & Allergies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Primary Condition:</span>
                            <p className="text-sm mt-1 p-2 bg-secondary rounded">{selectedPatient.condition}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Known Allergies:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedPatient.allergies.map((allergy, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="vitals" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-red-500" />
                            Latest Vitals
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Heart Rate:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{selectedPatient.lastVitals.heartRate} BPM</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blood Pressure:</span>
                            <span className="font-mono">{selectedPatient.lastVitals.bloodPressure} mmHg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Temperature:</span>
                            <span className="font-mono">{selectedPatient.lastVitals.temperature}°F</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Oxygen Sat:</span>
                            <span className="font-mono">{selectedPatient.lastVitals.oxygenSat}%</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Update Vitals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Heart Rate" />
                            <Input placeholder="BP (120/80)" />
                            <Input placeholder="Temperature" />
                            <Input placeholder="O2 Sat %" />
                          </div>
                          <Button onClick={handleUpdateVitals} className="w-full" size="sm">
                            Record Vitals
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Pill className="h-4 w-4 text-blue-500" />
                            Current Medications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedPatient.medications.map((medication, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{medication}</span>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline" className="h-6 text-xs">
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-6 text-xs text-red-600">
                                    Stop
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Add Medication</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Input placeholder="Medication name" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Dosage" />
                            <Input placeholder="Frequency" />
                          </div>
                          <Button onClick={handleAddMedication} className="w-full" size="sm">
                            Add Medication
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="records" className="space-y-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            Medical Records
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <h4 className="text-sm font-medium">Lab Results - Blood Work</h4>
                                <p className="text-xs text-muted-foreground">April 15, 2025</p>
                              </div>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <h4 className="text-sm font-medium">X-Ray - Chest</h4>
                                <p className="text-xs text-muted-foreground">April 14, 2025</p>
                              </div>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <h4 className="text-sm font-medium">CT Scan - Abdomen</h4>
                                <p className="text-xs text-muted-foreground">April 12, 2025</p>
                              </div>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium">No Patient Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a patient from the list to view their details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;