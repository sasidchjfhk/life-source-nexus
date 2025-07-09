import { supabase } from "@/integrations/supabase/client";
import { Match } from "@/models/organMatchingData";
import { getBlockchainService } from "./blockchainService";

export interface SupabaseDonor {
  id: string;
  name: string;
  blood_type: string;
  organ: string;
  location?: string;
  availability: boolean;
  created_at: string;
  approval_status?: string;
}

export interface SupabaseRecipient {
  id: string;
  name: string;
  blood_type: string;
  required_organ: string;
  location?: string;
  urgency_level?: number;
  created_at: string;
}

export interface SupabaseMatch {
  id: string;
  donor_id: string;
  recipient_id: string;
  match_score: number;
  status: string;
  matched_at: string;
  blockchain_tx_hash?: string;
}

export class SupabaseDataService {
  
  async getDonors(): Promise<SupabaseDonor[]> {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching donors:', error);
      throw error;
    }
  }

  async getRecipients(): Promise<SupabaseRecipient[]> {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
  }

  async getHospitals(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  }

  async getDoctors(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  async getApprovals(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching approvals:', error);
      throw error;
    }
  }

  async updateApprovalStatus(approvalId: string, status: string, comments?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('approvals')
        .update({ 
          status, 
          comments,
          approved_at: status === 'approved' ? new Date().toISOString() : null 
        })
        .eq('id', approvalId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error;
    }
  }

  async createApproval(entityType: string, entityId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('approvals')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          status: 'pending'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating approval:', error);
      throw error;
    }
  }

  async saveMatch(match: Match, donorId: string, recipientId: string): Promise<string> {
    try {
      // First save to Supabase
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          donor_id: donorId,
          recipient_id: recipientId,
          match_score: match.compatibility,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      const matchId = data.id;

      // Try to log to blockchain if service is available
      let blockchainTxHash: string | null = null;
      try {
        const blockchainService = getBlockchainService();
        if (blockchainService && blockchainService.isInitialized()) {
          blockchainTxHash = await blockchainService.logMatch(
            donorId, 
            recipientId, 
            match.compatibility
          );

          // Update the match with blockchain transaction hash
          await supabase
            .from('matches')
            .update({ blockchain_tx_hash: blockchainTxHash })
            .eq('id', matchId);
        }
      } catch (blockchainError) {
        console.warn('Failed to log to blockchain, but match saved to database:', blockchainError);
      }

      return matchId;
    } catch (error) {
      console.error('Error saving match:', error);
      throw error;
    }
  }

  async getMatches(): Promise<SupabaseMatch[]> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('matched_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  async updateMatchStatus(matchId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  // Convert Supabase data to Match format used by the UI
  convertToMatch(donor: SupabaseDonor, recipient: SupabaseRecipient, compatibility: number): Match {
    return {
      id: `M-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      donor: {
        id: donor.id,
        name: donor.name,
        age: Math.floor(Math.random() * 40) + 20, // Mock age for now
        bloodType: donor.blood_type,
        organ: donor.organ,
        status: donor.availability ? 'Available' : 'Inactive',
        matchScore: compatibility,
        registrationDate: donor.created_at,
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      recipient: {
        id: recipient.id,
        name: recipient.name,
        age: Math.floor(Math.random() * 50) + 15, // Mock age for now
        bloodType: recipient.blood_type,
        organ: recipient.required_organ,
        urgency: recipient.urgency_level?.toString() || "1",
        matchScore: compatibility,
        waitingTime: this.calculateWaitingTime(recipient.created_at),
        location: recipient.location || 'Unknown',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      compatibility,
      reasons: this.generateMatchReasons(donor, recipient, compatibility),
      predicted_success: this.getPredictedSuccess(compatibility),
      predicted_complications: this.getPredictedComplications(compatibility),
      recommendation: this.getRecommendation(compatibility)
    };
  }

  private calculateWaitingTime(createdAt: string): string {
    const waitingDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - waitingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  }

  private generateMatchReasons(donor: SupabaseDonor, recipient: SupabaseRecipient, compatibility: number): string[] {
    const reasons = [];
    
    if (donor.blood_type === recipient.blood_type) {
      reasons.push("Perfect blood type match");
    } else if (this.isBloodTypeCompatible(donor.blood_type, recipient.blood_type)) {
      reasons.push("Blood type compatible");
    }
    
    if (donor.organ === recipient.required_organ) {
      reasons.push("Organ type matches perfectly");
    }
    
    if (compatibility >= 90) {
      reasons.push("Excellent overall compatibility");
    } else if (compatibility >= 80) {
      reasons.push("Good overall compatibility");
    }
    
    if (recipient.urgency_level && recipient.urgency_level >= 8) {
      reasons.push("High urgency - priority matching");
    }
    
    return reasons;
  }

  private isBloodTypeCompatible(donorType: string, recipientType: string): boolean {
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
  }

  private getPredictedSuccess(compatibility: number): string {
    if (compatibility >= 90) return "Very High (>95%)";
    if (compatibility >= 80) return "High (85-95%)";
    if (compatibility >= 70) return "Good (70-85%)";
    if (compatibility >= 60) return "Moderate (60-70%)";
    return "Low (<60%)";
  }

  private getPredictedComplications(compatibility: number): string {
    if (compatibility >= 90) return "Minimal";
    if (compatibility >= 80) return "Low";
    if (compatibility >= 70) return "Moderate";
    return "High";
  }

  private getRecommendation(compatibility: number): string {
    if (compatibility >= 80) return "Highly recommended - proceed with matching";
    if (compatibility >= 70) return "Recommended - good compatibility";
    if (compatibility >= 60) return "Consider - moderate compatibility";
    return "Not recommended - seek alternative donors";
  }

  calculateCompatibilityScore(donor: SupabaseDonor, recipient: SupabaseRecipient): number {
    let score = 0;
    
    // Blood type compatibility (50%)
    if (this.isBloodTypeCompatible(donor.blood_type, recipient.blood_type)) {
      score += donor.blood_type === recipient.blood_type ? 50 : 35;
    }
    
    // Organ type match (40%)
    if (donor.organ === recipient.required_organ) {
      score += 40;
    }
    
    // Urgency factor (10%)
    if (recipient.urgency_level) {
      score += Math.min(recipient.urgency_level, 10);
    } else {
      score += 5;
    }
    
    return Math.min(score, 100);
  }
}

export const supabaseDataService = new SupabaseDataService();