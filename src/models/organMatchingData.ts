
// Mock data for organ matching
export const mockRecipients = [
  { 
    id: "R-001", 
    name: "Emma Thompson", 
    age: 42, 
    bloodType: "O+", 
    organ: "Kidney", 
    urgency: "High",
    matchScore: 89,
    waitingTime: "8 months",
    location: "Memorial Hospital",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "R-002", 
    name: "James Wilson", 
    age: 35, 
    bloodType: "A-", 
    organ: "Liver", 
    urgency: "Medium",
    matchScore: 78,
    waitingTime: "5 months",
    location: "Central Medical",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "R-003", 
    name: "Sarah Johnson", 
    age: 29, 
    bloodType: "B+", 
    organ: "Heart", 
    urgency: "Critical",
    matchScore: 92,
    waitingTime: "3 months",
    location: "St. Mary's Hospital",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

export const mockDonors = [
  { 
    id: "D-001", 
    name: "Michael Brown", 
    age: 48, 
    bloodType: "O+", 
    organ: "Kidney", 
    status: "Available",
    matchScore: 85,
    registrationDate: "2025-01-15",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "D-002", 
    name: "Jessica Lee", 
    age: 39, 
    bloodType: "A+", 
    organ: "Liver", 
    status: "Available",
    matchScore: 76,
    registrationDate: "2025-02-08",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "D-003", 
    name: "David Miller", 
    age: 52, 
    bloodType: "B-", 
    organ: "Heart", 
    status: "Available",
    matchScore: 91,
    registrationDate: "2025-03-22",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

// Types for organ matching data
export interface Donor {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  organ: string;
  status: string;
  matchScore: number;
  registrationDate: string;
  image: string;
}

export interface Recipient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  organ: string;
  urgency: string;
  matchScore: number;
  waitingTime: string;
  location: string;
  image: string;
}

export interface Match {
  id: string;
  donor: Donor;
  recipient: Recipient;
  compatibility: number;
  reasons: string[];
  predicted_success: string;
  predicted_complications: string;
  recommendation: string;
}
