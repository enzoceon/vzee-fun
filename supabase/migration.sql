
-- Enable Row Level Security for user_profiles
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for audio_uploads
ALTER TABLE IF EXISTS public.audio_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles: Anyone can insert
CREATE POLICY IF NOT EXISTS "Anyone can insert user profiles" 
  ON public.user_profiles 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for user_profiles: Anyone can view profiles
CREATE POLICY IF NOT EXISTS "Anyone can view profiles" 
  ON public.user_profiles 
  FOR SELECT 
  TO anon, authenticated
  USING (true);
  
-- Create policy for user_profiles: Users can update their own profiles by username
CREATE POLICY IF NOT EXISTS "Users can update their own profiles" 
  ON public.user_profiles 
  FOR UPDATE 
  TO anon, authenticated
  USING (true);

-- Create policy for audio_uploads: Anyone can insert
CREATE POLICY IF NOT EXISTS "Anyone can insert audio uploads" 
  ON public.audio_uploads 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for audio_uploads: Anyone can view audio
CREATE POLICY IF NOT EXISTS "Anyone can view audio" 
  ON public.audio_uploads 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create policy for audio_uploads: Users can update and delete by username
CREATE POLICY IF NOT EXISTS "Users can update and delete by username" 
  ON public.audio_uploads 
  FOR ALL
  TO anon, authenticated
  USING (true);
