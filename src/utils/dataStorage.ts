
import { UserProfile, RegistrationData, DonorProfile, PatientProfile, DoctorProfile, HospitalProfile } from '@/models/userData';
import { Match, Donor, Recipient } from '@/models/organMatchingData';

const STORAGE_KEY = 'lifesource_data';

// Initialize default data structure
const defaultData: RegistrationData = {
  donors: [],
  patients: [],
  doctors: [],
  hospitals: [],
  matches: [],
  statistics: {
    totalDonors: 0,
    totalPatients: 0,
    totalMatches: 0,
    successfulTransplants: 0
  }
};

// Storage utility functions
export const getStoredData = (): RegistrationData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error('Error loading data from storage:', error);
    return defaultData;
  }
};

export const saveData = (data: RegistrationData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to storage:', error);
  }
};

// User registration functions
export const registerDonor = (donor: DonorProfile): boolean => {
  try {
    const data = getStoredData();
    data.donors.push(donor);
    data.statistics.totalDonors = data.donors.length;
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error registering donor:', error);
    return false;
  }
};

export const registerPatient = (patient: PatientProfile): boolean => {
  try {
    const data = getStoredData();
    data.patients.push(patient);
    data.statistics.totalPatients = data.patients.length;
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error registering patient:', error);
    return false;
  }
};

export const registerDoctor = (doctor: DoctorProfile): boolean => {
  try {
    const data = getStoredData();
    data.doctors.push(doctor);
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error registering doctor:', error);
    return false;
  }
};

export const registerHospital = (hospital: HospitalProfile): boolean => {
  try {
    const data = getStoredData();
    data.hospitals.push(hospital);
    saveData(data);
    return true;
  } catch (error) {
    console.error('Error registering hospital:', error);
    return false;
  }
};

// Data retrieval functions
export const getUserById = (id: string): UserProfile | null => {
  const data = getStoredData();
  const allUsers = [...data.donors, ...data.patients, ...data.doctors, ...data.hospitals];
  return allUsers.find(user => user.id === id) || null;
};

export const getUsersByType = (type: 'donor' | 'patient' | 'doctor' | 'hospital'): UserProfile[] => {
  const data = getStoredData();
  return data[type === 'donor' ? 'donors' : 
               type === 'patient' ? 'patients' : 
               type === 'doctor' ? 'doctors' : 'hospitals'] as UserProfile[];
};

export const findUserByEmail = (email: string): UserProfile | null => {
  const data = getStoredData();
  const allUsers = [...data.donors, ...data.patients, ...data.doctors, ...data.hospitals];
  return allUsers.find(user => user.email === email) || null;
};

// Matching functions
export const saveMatch = (match: Match): void => {
  const data = getStoredData();
  data.matches.push(match);
  data.statistics.totalMatches = data.matches.length;
  saveData(data);
};

export const getMatchesForUser = (userId: string): Match[] => {
  const data = getStoredData();
  return data.matches.filter(match => 
    match.donor.id === userId || match.recipient.id === userId
  );
};

// Advanced matching algorithm
export const findCompatibleMatches = (patientId: string): Match[] => {
  const data = getStoredData();
  const patient = data.patients.find(p => p.id === patientId);
  
  if (!patient) return [];

  const compatibleDonors = data.donors.filter(donor => {
    // Blood type compatibility
    const bloodCompatible = isBloodTypeCompatible(donor.bloodType, patient.bloodType);
    
    // Organ availability
    const organAvailable = donor.registeredOrgans.includes(patient.requiredOrgan);
    
    // Age compatibility (within 15 years)
    const ageCompatible = Math.abs(donor.age - patient.age) <= 15;
    
    return bloodCompatible && organAvailable && ageCompatible && donor.isActive;
  });

  return compatibleDonors.map(donor => ({
    id: `M-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    donor: {
      id: donor.id,
      name: donor.name,
      age: donor.age,
      bloodType: donor.bloodType,
      organ: donor.registeredOrgans[0] || 'Unknown',
      status: donor.isActive ? 'Available' : 'Inactive',
      matchScore: calculateCompatibilityScore(donor, patient),
      registrationDate: donor.registrationDate,
      image: donor.profileImage || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    } as Donor,
    recipient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      bloodType: patient.bloodType,
      organ: patient.requiredOrgan,
      urgency: patient.urgencyLevel,
      matchScore: calculateCompatibilityScore(donor, patient),
      waitingTime: calculateWaitingTime(patient.waitingListDate),
      location: patient.hospitalId,
      image: patient.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    } as Recipient,
    compatibility: calculateCompatibilityScore(donor, patient),
    reasons: generateMatchReasons(donor, patient),
    predicted_success: getPredictedSuccess(donor, patient),
    predicted_complications: getPredictedComplications(donor, patient),
    recommendation: getRecommendation(donor, patient)
  }));
};

// Helper functions
const isBloodTypeCompatible = (donorType: string, recipientType: string): boolean => {
  const compatibilityMap: Record<string, string[]> = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };
  
  return compatibilityMap[donorType]?.includes(recipientType) || false;
};

const calculateCompatibilityScore = (donor: DonorProfile, patient: PatientProfile): number => {
  let score = 0;
  
  // Blood type compatibility (40%)
  if (isBloodTypeCompatible(donor.bloodType, patient.bloodType)) {
    score += donor.bloodType === patient.bloodType ? 40 : 30;
  }
  
  // Age compatibility (20%)
  const ageDiff = Math.abs(donor.age - patient.age);
  if (ageDiff <= 5) score += 20;
  else if (ageDiff <= 10) score += 15;
  else if (ageDiff <= 15) score += 10;
  
  // Urgency factor (20%)
  if (patient.urgencyLevel === 'Critical') score += 20;
  else if (patient.urgencyLevel === 'High') score += 15;
  else if (patient.urgencyLevel === 'Medium') score += 10;
  else score += 5;
  
  // Medical history compatibility (20%)
  const commonConditions = donor.medicalHistory.filter(condition => 
    patient.medicalHistory.includes(condition)
  );
  if (commonConditions.length === 0) score += 20;
  else if (commonConditions.length <= 2) score += 10;
  
  return Math.min(score, 100);
};

const generateMatchReasons = (donor: DonorProfile, patient: PatientProfile): string[] => {
  const reasons = [];
  
  if (donor.bloodType === patient.bloodType) {
    reasons.push("Perfect blood type match");
  } else if (isBloodTypeCompatible(donor.bloodType, patient.bloodType)) {
    reasons.push("Blood type compatible");
  }
  
  const ageDiff = Math.abs(donor.age - patient.age);
  if (ageDiff <= 5) {
    reasons.push("Excellent age compatibility");
  } else if (ageDiff <= 10) {
    reasons.push("Good age compatibility");
  }
  
  if (patient.urgencyLevel === 'Critical') {
    reasons.push("Critical urgency - priority matching");
  }
  
  if (donor.medicalHistory.length === 0) {
    reasons.push("Clean medical history");
  }
  
  return reasons;
};

const getPredictedSuccess = (donor: DonorProfile, patient: PatientProfile): string => {
  const score = calculateCompatibilityScore(donor, patient);
  if (score >= 90) return "Very High (>95%)";
  if (score >= 80) return "High (85-95%)";
  if (score >= 70) return "Good (70-85%)";
  if (score >= 60) return "Moderate (60-70%)";
  return "Low (<60%)";
};

const getPredictedComplications = (donor: DonorProfile, patient: PatientProfile): string => {
  const score = calculateCompatibilityScore(donor, patient);
  if (score >= 90) return "Minimal";
  if (score >= 80) return "Low";
  if (score >= 70) return "Moderate";
  return "High";
};

const getRecommendation = (donor: DonorProfile, patient: PatientProfile): string => {
  const score = calculateCompatibilityScore(donor, patient);
  if (score >= 80) return "Highly recommended - proceed with matching";
  if (score >= 70) return "Recommended - good compatibility";
  if (score >= 60) return "Consider - moderate compatibility";
  return "Not recommended - seek alternative donors";
};

const calculateWaitingTime = (waitingListDate: string): string => {
  const waitingDate = new Date(waitingListDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - waitingDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
  return `${Math.floor(diffDays / 365)} years`;
};

// Statistics and analytics
export const getStatistics = () => {
  const data = getStoredData();
  return {
    ...data.statistics,
    activeMatches: data.matches.filter(match => match.compatibility >= 70).length,
    criticalPatients: data.patients.filter(p => p.urgencyLevel === 'Critical').length,
    verifiedHospitals: data.hospitals.filter(h => h.isVerified).length,
    organTypes: data.donors.reduce((acc, donor) => {
      donor.registeredOrgans.forEach(organ => {
        acc[organ] = (acc[organ] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>)
  };
};
