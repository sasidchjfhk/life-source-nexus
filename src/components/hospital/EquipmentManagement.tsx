import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  TrendingUp,
  Wrench,
  Zap,
  Activity
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "operational" | "maintenance" | "out-of-service" | "repair";
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  warrantyExpiry: string;
  utilizationRate: number;
  criticalLevel: "low" | "medium" | "high";
}

const EquipmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const equipment: Equipment[] = [
    {
      id: "EQ-001",
      name: "MRI Scanner - Siemens MAGNETOM Vida",
      type: "Imaging",
      status: "operational",
      location: "Radiology - Room 201",
      lastMaintenance: "2025-03-15",
      nextMaintenance: "2025-06-15",
      serialNumber: "SM-2024-001",
      manufacturer: "Siemens Healthineers",
      purchaseDate: "2023-01-15",
      warrantyExpiry: "2026-01-15",
      utilizationRate: 87,
      criticalLevel: "high"
    },
    {
      id: "EQ-002",
      name: "Ventilator - Philips V680",
      type: "Life Support",
      status: "maintenance",
      location: "ICU - Bed 5",
      lastMaintenance: "2025-04-10",
      nextMaintenance: "2025-04-20",
      serialNumber: "PH-V680-045",
      manufacturer: "Philips Healthcare",
      purchaseDate: "2022-08-20",
      warrantyExpiry: "2025-08-20",
      utilizationRate: 95,
      criticalLevel: "high"
    },
    {
      id: "EQ-003",
      name: "Ultrasound Machine - GE Logiq E10",
      type: "Imaging",
      status: "operational",
      location: "Emergency Department",
      lastMaintenance: "2025-02-28",
      nextMaintenance: "2025-05-28",
      serialNumber: "GE-L10-123",
      manufacturer: "GE Healthcare",
      purchaseDate: "2023-06-10",
      warrantyExpiry: "2026-06-10",
      utilizationRate: 72,
      criticalLevel: "medium"
    },
    {
      id: "EQ-004",
      name: "Dialysis Machine - Fresenius 5008S",
      type: "Treatment",
      status: "out-of-service",
      location: "Nephrology Unit",
      lastMaintenance: "2025-04-01",
      nextMaintenance: "2025-04-25",
      serialNumber: "FS-5008-067",
      manufacturer: "Fresenius Medical Care",
      purchaseDate: "2021-11-15",
      warrantyExpiry: "2024-11-15",
      utilizationRate: 0,
      criticalLevel: "high"
    },
    {
      id: "EQ-005",
      name: "Cardiac Monitor - Philips IntelliVue MX800",
      type: "Monitoring",
      status: "operational",
      location: "Cardiac Care Unit",
      lastMaintenance: "2025-03-20",
      nextMaintenance: "2025-06-20",
      serialNumber: "PH-MX800-234",
      manufacturer: "Philips Healthcare",
      purchaseDate: "2022-12-05",
      warrantyExpiry: "2025-12-05",
      utilizationRate: 89,
      criticalLevel: "high"
    },
    {
      id: "EQ-006",
      name: "Anesthesia Machine - Draeger Perseus A500",
      type: "Surgery",
      status: "repair",
      location: "Operating Room 3",
      lastMaintenance: "2025-03-30",
      nextMaintenance: "2025-04-30",
      serialNumber: "DR-PA500-089",
      manufacturer: "Draeger Medical",
      purchaseDate: "2023-03-10",
      warrantyExpiry: "2026-03-10",
      utilizationRate: 0,
      criticalLevel: "high"
    }
  ];

  const equipmentTypes = ["all", "Imaging", "Life Support", "Treatment", "Monitoring", "Surgery"];
  const statusOptions = ["all", "operational", "maintenance", "out-of-service", "repair"];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-600">Operational</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-600">Maintenance</Badge>;
      case "out-of-service":
        return <Badge variant="destructive">Out of Service</Badge>;
      case "repair":
        return <Badge className="bg-orange-600">Under Repair</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCriticalBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600 text-xs">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-green-600 text-xs">Low Priority</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const scheduleMaintenace = (equipmentId: string) => {
    toast({
      title: "Maintenance Scheduled",
      description: `Maintenance has been scheduled for equipment ${equipmentId}`,
    });
  };

  const updateStatus = (equipmentId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Equipment ${equipmentId} status updated to ${newStatus}`,
    });
  };

  // Calculate statistics
  const totalEquipment = equipment.length;
  const operationalCount = equipment.filter(eq => eq.status === "operational").length;
  const maintenanceCount = equipment.filter(eq => eq.status === "maintenance" || eq.status === "repair").length;
  const outOfServiceCount = equipment.filter(eq => eq.status === "out-of-service").length;
  const avgUtilization = Math.round(equipment.reduce((sum, eq) => sum + eq.utilizationRate, 0) / totalEquipment);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-primary" />
            Equipment Management
          </h2>
          <p className="text-muted-foreground">Monitor and manage hospital equipment</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <p className="text-xs text-muted-foreground">Registered devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalCount}</div>
            <p className="text-xs text-muted-foreground">Working properly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground">Being serviced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgUtilization}%</div>
            <p className="text-xs text-muted-foreground">Equipment usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equipment Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
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

      {/* Equipment List */}
      <div className="grid gap-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {getStatusBadge(item.status)}
                    {getCriticalBadge(item.criticalLevel)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID:</span> {item.id}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span> {item.type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span> {item.location}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Utilization:</span> {item.utilizationRate}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => scheduleMaintenace(item.id)}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Last Maintenance:</span>
                    <span>{item.lastMaintenance}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Next Maintenance:</span>
                    <span className={new Date(item.nextMaintenance) < new Date() ? "text-red-600 font-medium" : ""}>
                      {item.nextMaintenance}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Manufacturer:</span>
                    <span>{item.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Warranty Expires:</span>
                    <span className={new Date(item.warrantyExpiry) < new Date() ? "text-red-600 font-medium" : ""}>
                      {item.warrantyExpiry}
                    </span>
                  </div>
                </div>
                
                {/* Utilization Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Utilization Rate</span>
                    <span className="text-xs font-medium">{item.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.utilizationRate > 90 ? 'bg-red-500' :
                        item.utilizationRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${item.utilizationRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No equipment found matching your criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipmentManagement;