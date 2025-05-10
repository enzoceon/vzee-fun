
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import AudioItem from "@/components/AudioItem";
import Loading from "@/components/Loading";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  username: string;
  display_name?: string;
  picture_url?: string;
}

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at?: string;
}

const ProfilePage = () => {
  const { username: rawUsername } = useParams<{ username: string }>();
  // Fix username parsing - remove @ if present
  const username = rawUsername?.startsWith('@') ? rawUsername.substring(1) : rawUsername;
  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Update document title
    document.title = username ? `@${username} - vzee.fun` : "Profile - vzee.fun";
    
    if (!username) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        console.log("Loading profile for:", username);
        
        // Fetch user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('username, display_name, picture_url')
          .eq('username', username)
          .maybeSingle();
        
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        console.log("Profile data:", profileData);
        
        if (!profileData) {
          console.log("No profile found for username:", username);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        // Profile found in Supabase
        setProfile({
          username: profileData.username,
          display_name: profileData.display_name,
          picture_url: profileData.picture_url
        });
        
        // Fetch audio files from Supabase
        const { data: audioData, error: audioError } = await supabase
          .from('audio_uploads')
          .select('id, title, audio_url, created_at')
          .eq('username', username)
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error("Error fetching audio files:", audioError);
          setAudioFiles([]);
        } else {
          console.log("Audio files:", audioData);
          setAudioFiles(audioData || []);
        }
        
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [username]);
  
  if (isLoading) {
    return <Loading message="Loading profile..." />;
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-premiumRed">Profile Not Found</h1>
        <p className="text-lightGray mb-8">
          The profile you're looking for doesn't exist.
        </p>
        <Button 
          className="bg-premiumRed hover:bg-premiumRed/90 text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-darkBlack text-white animate-fade-in">
      <div className="max-w-4xl mx-auto p-4">
        <Button 
          variant="ghost" 
          className="text-lightGray mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex flex-col items-center mb-10">
          {profile?.picture_url ? (
            <img 
              src={profile.picture_url} 
              alt={`${profile.username}'s profile`} 
              className="w-20 h-20 rounded-full mb-4 border-2 border-premiumRed"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-premiumRed mb-4">
              <User className="w-10 h-10 text-lightGray" />
            </div>
          )}
          
          {profile?.display_name && (
            <h1 className="text-2xl font-bold mb-1">{profile.display_name}</h1>
          )}
          
          <p className="text-lg font-medium text-premiumRed">@{profile?.username}</p>
        </div>
        
        <h2 className="text-xl font-semibold mb-6 text-center">Audio Files</h2>
        
        {audioFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioFiles.map((audio) => (
              <AudioItem
                key={audio.id}
                title={audio.title}
                username={username || ""}
                audioURL={audio.audio_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-muted bg-opacity-20 rounded-lg">
            <p className="text-lightGray mb-4">No audio files shared yet</p>
            <p className="text-sm text-muted-foreground">
              Why not come and visit for dedicated custom links like https://vzee.fun/@{profile?.username}/title
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
