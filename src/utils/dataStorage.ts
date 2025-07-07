
import { UserProfile, RegistrationData, DonorProfile, PatientProfile, DoctorProfile, HospitalProfile } from '@/models/userData';
import { Match, Donor, Recipient } from '@/models/organMatchingData';
import { supabase } from '@/integrations/supabase/client';
import { supabaseDataService } from '@/services/supabaseDataService';

// Legacy function for backward compatibility - now uses Supabase
export const getStoredData = async (): Promise<RegistrationData> => {
  try {
    const [donors, recipients, matches] = await Promise.all([
      supabaseDataService.getDonors(),
      supabaseDataService.getRecipients(),
      supabaseDataService.getMatches()
    ]);

    // Convert Supabase data to legacy format
    const donorProfiles: DonorProfile[] = donors.map(donor => ({
      id: donor.id,
      name: donor.name,
      email: `${donor.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1-555-0000',
      address: donor.location || 'Unknown',
      registrationDate: new Date(donor.created_at || Date.now()).toISOString(),
      type: 'donor' as const,
      bloodType: donor.blood_type,
      age: Math.floor(Math.random() * 40) + 20,
      weight: Math.floor(Math.random() * 50) + 50,
      height: Math.floor(Math.random() * 40) + 150,
      medicalHistory: [],
      registeredOrgans: [donor.organ],
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1-555-0000',
        relationship: 'Family'
      },
      isActive: donor.availability || false,
      nftBadges: [],
      matchingPreferences: {
        geographicLimit: 100,
        urgencyOnly: false,
        anonymousMatching: false
      }
    }));

    const patientProfiles: PatientProfile[] = recipients.map(recipient => ({
      id: recipient.id,
      name: recipient.name,
      email: `${recipient.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1-555-0000',
      address: recipient.location || 'Unknown',
      registrationDate: new Date(recipient.created_at || Date.now()).toISOString(),
      type: 'patient' as const,
      bloodType: recipient.blood_type,
      age: Math.floor(Math.random() * 50) + 15,
      medicalCondition: 'Organ Failure',
      requiredOrgan: recipient.required_organ,
      urgencyLevel: recipient.urgency_level >= 8 ? 'Critical' : recipient.urgency_level >= 6 ? 'High' : recipient.urgency_level >= 4 ? 'Medium' : 'Low',
      waitingListDate: new Date(recipient.created_at || Date.now()).toISOString(),
      hospitalId: 'H-001',
      doctorId: 'D-001',
      medicalHistory: [],
      currentMedications: [],
      insuranceInfo: {
        provider: 'Health Insurance',
        policyNumber: 'POL-' + Math.random().toString(36).substr(2, 9)
      }
    }));

    return {
      donors: donorProfiles,
      patients: patientProfiles,
      doctors: [],
      hospitals: [],
      matches: matches.map(match => ({
        id: match.id,
        donor: {
          id: match.donor_id || '',
          name: 'Donor',
          age: 0,
          bloodType: '',
          organ: '',
          status: 'Available',
          matchScore: match.match_score || 0,
          registrationDate: '',
          image: ''
        },
        recipient: {
          id: match.recipient_id || '',
          name: 'Recipient',
          age: 0,
          bloodType: '',
          organ: '',
          urgency: 'Medium',
          matchScore: match.match_score || 0,
          waitingTime: '',
          location: '',
          image: ''
        },
        compatibility: match.match_score || 0,
        reasons: [],
        predicted_success: 'Good',
        predicted_complications: 'Low',
        recommendation: 'Proceed'
      })),
      statistics: {
        totalDonors: donors.length,
        totalPatients: recipients.length,
        totalMatches: matches.length,
        successfulTransplants: matches.filter(m => m.status === 'completed').length
      }
    };
  } catch (error) {
    console.error('Error loading data from Supabase:', error);
    return {
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
  }
};

export const saveData = (data: RegistrationData): void => {
  // This function is deprecated - use Supabase directly
  console.warn('saveData is deprecated. Use Supabase services directly.');
};

// User registration functions - now use Supabase
export const registerDonor = async (donor: DonorProfile): Promise<boolean> => {
  try {
    await supabase.from('donors').insert({
      name: donor.name,
      blood_type: donor.bloodType,
      organ: donor.registeredOrgans[0] || 'Unknown',
      location: donor.address,
      availability: donor.isActive
    });
    return true;
  } catch (error) {
    console.error('Error registering donor:', error);
    return false;
  }
};

export const registerPatient = async (patient: PatientProfile): Promise<boolean> => {
  try {
    await supabase.from('recipients').insert({
      name: patient.name,
      blood_type: patient.bloodType,
      required_organ: patient.requiredOrgan,
      location: patient.address,
      urgency_level: patient.urgencyLevel === 'Critical' ? 10 : 
                     patient.urgencyLevel === 'High' ? 8 : 
                     patient.urgencyLevel === 'Medium' ? 6 : 4
    });
    return true;
  } catch (error) {
    console.error('Error registering patient:', error);
    return false;
  }
};

export const registerDoctor = async (doctor: DoctorProfile): Promise<boolean> => {
  // This would require a doctors table in Supabase
  console.warn('Doctor registration not implemented - requires doctors table');
  return false;
};

export const registerHospital = async (hospital: HospitalProfile): Promise<boolean> => {
  // This would require a hospitals table in Supabase
  console.warn('Hospital registration not implemented - requires hospitals table');
  return false;
};

// Data retrieval functions - now use Supabase
export const getUserById = async (id: string): Promise<UserProfile | null> => {
  try {
    const data = await getStoredData();
    const allUsers = [...data.donors, ...data.patients, ...data.doctors, ...data.hospitals];
    return allUsers.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const getUsersByType = async (type: 'donor' | 'patient' | 'doctor' | 'hospital'): Promise<UserProfile[]> => {
  try {
    const data = await getStoredData();
    return data[type === 'donor' ? 'donors' : 
                 type === 'patient' ? 'patients' : 
                 type === 'doctor' ? 'doctors' : 'hospitals'] as UserProfile[];
  } catch (error) {
    console.error('Error getting users by type:', error);
    return [];
  }
};

export const findUserByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    const data = await getStoredData();
    const allUsers = [...data.donors, ...data.patients, ...data.doctors, ...data.hospitals];
    return allUsers.find(user => user.email === email) || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
};

// Matching functions - deprecated, use Supabase directly
export const saveMatch = async (match: Match): Promise<void> => {
  console.warn('saveMatch is deprecated. Use supabaseDataService directly.');
};

export const getMatchesForUser = async (userId: string): Promise<Match[]> => {
  try {
    const data = await getStoredData();
    return data.matches.filter(match => 
      match.donor.id === userId || match.recipient.id === userId
    );
  } catch (error) {
    console.error('Error getting matches for user:', error);
    return [];
  }
};

// Advanced matching algorithm - deprecated
export const findCompatibleMatches = async (patientId: string): Promise<Match[]> => {
  try {
    const data = await getStoredData();
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

// Statistics and analytics - now use Supabase
export const getStatistics = async () => {
  try {
    const data = await getStoredData();
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
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalDonors: 0,
      totalPatients: 0,
      totalMatches: 0,
      successfulTransplants: 0,
      activeMatches: 0,
      criticalPatients: 0,
      verifiedHospitals: 0,
      organTypes: {}
    };
  }
};
