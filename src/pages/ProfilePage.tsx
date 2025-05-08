
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import AudioItem from "@/components/AudioItem";
import Loading from "@/components/Loading";

interface UserProfile {
  username: string;
  name?: string;
  picture?: string;
}

interface AudioFile {
  title: string;
  file: File;
  audioURL: string;
  blobData?: string;
  createdAt: number;
}

const ProfilePage = () => {
  const { username: rawUsername } = useParams<{ username: string }>();
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

    const loadProfile = () => {
      try {
        // Get user profile info from all users map in localStorage
        const allUsers = JSON.parse(localStorage.getItem('vzeeAllUsers') || '{}');
        const usernameMappings = JSON.parse(localStorage.getItem('vzeeUsernameMap') || '{}');
        
        // Find the email associated with this username
        let userEmail = null;
        for (const [email, mappedUsername] of Object.entries(usernameMappings)) {
          if (mappedUsername === username) {
            userEmail = email;
            break;
          }
        }
        
        let userProfile: UserProfile = { username };
        
        // If we found their email, get their profile info
        if (userEmail && allUsers[userEmail]) {
          userProfile = {
            ...userProfile,
            name: allUsers[userEmail].name,
            picture: allUsers[userEmail].picture
          };
        }
        
        setProfile(userProfile);
        
        // Load audio files
        const storedAudios = localStorage.getItem(`${username}_audioFiles`);
        if (storedAudios) {
          const audioFiles = JSON.parse(storedAudios);
          setAudioFiles(audioFiles);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
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
          {profile.picture ? (
            <img 
              src={profile.picture} 
              alt={`${profile.username}'s profile`} 
              className="w-20 h-20 rounded-full mb-4 border-2 border-premiumRed"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-premiumRed mb-4">
              <User className="w-10 h-10 text-lightGray" />
            </div>
          )}
          
          {profile.name && (
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
          )}
          
          <p className="text-lg font-medium text-premiumRed">@{profile.username}</p>
        </div>
        
        <h2 className="text-xl font-semibold mb-6 text-center">Audio Files</h2>
        
        {audioFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioFiles.map((audio, index) => (
              <AudioItem
                key={index}
                title={audio.title}
                username={username || ""}
                audioFile={audio.file}
                audioURL={audio.audioURL}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-muted bg-opacity-20 rounded-lg">
            <p className="text-lightGray">No audio files shared yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
