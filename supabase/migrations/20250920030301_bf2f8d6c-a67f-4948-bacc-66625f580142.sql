-- Add NFT-related columns to donors table
ALTER TABLE public.donors 
ADD COLUMN IF NOT EXISTS nft_badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS nft_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Add NFT-related columns to recipients table  
ALTER TABLE public.recipients
ADD COLUMN IF NOT EXISTS nft_badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS nft_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Create NFT badges table
CREATE TABLE IF NOT EXISTS public.nft_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('donor', 'recipient', 'doctor', 'hospital')),
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  blockchain_tx_hash TEXT,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on nft_badges table
ALTER TABLE public.nft_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for nft_badges table
CREATE POLICY "Enable read access for all users on nft_badges" 
ON public.nft_badges 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users on nft_badges" 
ON public.nft_badges 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users on nft_badges" 
ON public.nft_badges 
FOR UPDATE 
USING (true);

-- Function to mint NFT badge for donors
CREATE OR REPLACE FUNCTION public.mint_donor_nft_badge(
  donor_id UUID,
  badge_type TEXT,
  badge_name TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_badge_name TEXT;
  tx_hash TEXT;
  badge_id UUID;
BEGIN
  -- Generate badge name if not provided
  IF badge_name IS NULL THEN
    generated_badge_name := badge_type || '-' || donor_id::TEXT || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
  ELSE
    generated_badge_name := badge_name;
  END IF;
  
  -- Generate mock blockchain transaction hash
  tx_hash := 'tx_' || substr(md5(random()::text), 1, 64);
  
  -- Insert NFT badge record
  INSERT INTO public.nft_badges (
    user_id,
    user_type,
    badge_type,
    badge_name,
    description,
    blockchain_tx_hash,
    metadata
  ) VALUES (
    donor_id,
    'donor',
    badge_type,
    generated_badge_name,
    CASE 
      WHEN badge_type = 'donor-registration' THEN 'Blockchain-certified organ donor registration'
      WHEN badge_type = 'medical-verification' THEN 'Medical screening and verification completed'
      WHEN badge_type = 'achievement' THEN 'Special achievement recognition'
      ELSE 'NFT Badge achievement'
    END,
    tx_hash,
    jsonb_build_object(
      'minted_by', 'system',
      'badge_level', 'standard',
      'verification_status', 'verified'
    )
  ) RETURNING id INTO badge_id;
  
  -- Update donor's NFT count and badges array
  UPDATE public.donors 
  SET 
    nft_count = nft_count + 1,
    nft_badges = COALESCE(nft_badges, '[]'::jsonb) || jsonb_build_object(
      'badge_id', badge_id,
      'badge_type', badge_type,
      'badge_name', generated_badge_name,
      'minted_at', NOW()
    )
  WHERE id = donor_id;
  
  RETURN generated_badge_name;
END;
$$;

-- Function to auto-mint NFT badge when donor is approved
CREATE OR REPLACE FUNCTION public.auto_mint_donor_registration_badge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if approval status changed to 'approved'
  IF NEW.approval_status = 'approved' AND (OLD.approval_status IS NULL OR OLD.approval_status != 'approved') THEN
    -- Mint registration badge
    PERFORM public.mint_donor_nft_badge(
      NEW.id,
      'donor-registration',
      'donor-registration-' || NEW.id::TEXT
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-minting registration badge
CREATE TRIGGER trigger_auto_mint_donor_registration_badge
  AFTER UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_mint_donor_registration_badge();

-- Add updated_at trigger for nft_badges table
CREATE TRIGGER update_nft_badges_updated_at
  BEFORE UPDATE ON public.nft_badges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();