-- Create the note_shares table for public note sharing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.note_shares (
  share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one share per note per user
  UNIQUE(note_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_note_shares_note_id ON public.note_shares(note_id);
CREATE INDEX IF NOT EXISTS idx_note_shares_user_id ON public.note_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_note_shares_share_id_revoked ON public.note_shares(share_id, revoked);

-- Enable RLS
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for note_shares
-- 1. Users can view their own shares
DROP POLICY IF EXISTS "Users can view their own note shares" ON public.note_shares;
CREATE POLICY "Users can view their own note shares" ON public.note_shares
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Users can insert their own shares
DROP POLICY IF EXISTS "Users can create their own note shares" ON public.note_shares;
CREATE POLICY "Users can create their own note shares" ON public.note_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own shares
DROP POLICY IF EXISTS "Users can update their own note shares" ON public.note_shares;
CREATE POLICY "Users can update their own note shares" ON public.note_shares
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Users can delete their own shares
DROP POLICY IF EXISTS "Users can delete their own note shares" ON public.note_shares;
CREATE POLICY "Users can delete their own note shares" ON public.note_shares
  FOR DELETE USING (auth.uid() = user_id);

-- Create the RPC function to fetch shared notes securely
-- This function runs with SECURITY DEFINER, so it bypasses RLS but we control exactly what data is exposed
CREATE OR REPLACE FUNCTION public.fetch_shared_note(p_share_id UUID)
RETURNS TABLE(
  share_id UUID,
  note_id UUID,
  user_id UUID,
  revoked BOOLEAN,
  created_at TIMESTAMPTZ,
  note_title TEXT,
  note_content JSONB,
  note_color TEXT,
  note_created_at TIMESTAMPTZ,
  note_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ns.share_id,
    ns.note_id,
    ns.user_id,
    ns.revoked,
    ns.created_at,
    n.title,
    n.content,
    n.color,
    n.created_at,
    n.updated_at
  FROM public.note_shares ns
  JOIN public.notes n ON ns.note_id = n.id
  WHERE ns.share_id = p_share_id;
  
  -- If no rows found, the function will return an empty result set
  -- The calling code should handle this case
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.fetch_shared_note(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_shared_note(UUID) TO anon;

-- Create updated_at trigger for note_shares
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_note_shares_updated_at ON public.note_shares;
CREATE TRIGGER handle_note_shares_updated_at
  BEFORE UPDATE ON public.note_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
