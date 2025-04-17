
import { mockDonors, mockRecipients, Match } from "@/models/organMatchingData";

export const generateMatches = (): Match[] => {
  const generatedMatches = [];
  for (let i = 0; i < mockDonors.length; i++) {
    const donor = mockDonors[i];
    const recipient = mockRecipients[i];
    
    // Calculate a compatibility score based on various factors
    const bloodTypeCompatibility = donor.bloodType.charAt(0) === recipient.bloodType.charAt(0) || 
                                  donor.bloodType.charAt(0) === 'O' ? 100 : 60;
    
    const organsMatch = donor.organ === recipient.organ ? 100 : 0;
    
    // Overall compatibility score
    const compatibility = Math.round((bloodTypeCompatibility + organsMatch) / 2);
    
    generatedMatches.push({
      id: `M-00${i+1}`,
      donor,
      recipient,
      compatibility,
      reasons: [
        compatibility > 80 ? "Blood type highly compatible" : "Blood type compatibility challenges",
        donor.organ === recipient.organ ? "Organ type matches perfectly" : "Organ type mismatch",
        Math.abs(donor.age - recipient.age) < 10 ? "Age difference within optimal range" : "Significant age difference",
      ],
      predicted_success: compatibility > 80 ? "High (>90%)" : compatibility > 60 ? "Medium (70-80%)" : "Low (<60%)",
      predicted_complications: compatibility > 80 ? "Minimal" : "Moderate",
      recommendation: compatibility > 75 ? "Proceed with match" : "Consider alternative donors"
    });
  }
  
  return generatedMatches;
};
