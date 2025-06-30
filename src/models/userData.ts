
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  profileImage?: string;
  walletAddress?: string;
}

export interface DonorProfile extends BaseUser {
  type: 'donor';
  bloodType: string;
  age: number;
  weight: number;
  height: number;
  medicalHistory: string[];
  registeredOrgans: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive: boolean;
  nftBadges: string[];
  matchingPreferences: {
    geographicLimit: number;
    urgencyOnly: boolean;
    anonymousMatching: boolean;
  };
}

export interface PatientProfile extends BaseUser {
  type: 'patient';
  bloodType: string;
  age: number;
  medicalCondition: string;
  requiredOrgan: string;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  waitingListDate: string;
  hospitalId: string;
  doctorId: string;
  medicalHistory: string[];
  currentMedications: string[];
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
  matchScore?: number;
}

export interface DoctorProfile extends BaseUser {
  type: 'doctor';
  specialization: string[];
  hospitalId: string;
  licenseNumber: string;
  yearsOfExperience: number;
  certifications: string[];
  patientsCount: number;
  transplantExperience: number;
  rating: number;
  bio: string;
}

export interface HospitalProfile extends BaseUser {
  type: 'hospital';
  hospitalName: string;
  hospitalType: string;
  servicesOffered: string[];
  capacity: number;
  transplantCertifications: string[];
  accreditations: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
  isVerified: boolean;
  rating: number;
  totalTransplants: number;
  successRate: number;
}

export type UserProfile = DonorProfile | PatientProfile | DoctorProfile | HospitalProfile;

export interface RegistrationData {
  donors: DonorProfile[];
  patients: PatientProfile[];
  doctors: DoctorProfile[];
  hospitals: HospitalProfile[];
  matches: Match[];
  statistics: {
    totalDonors: number;
    totalPatients: number;
    totalMatches: number;
    successfulTransplants: number;
  };
}
