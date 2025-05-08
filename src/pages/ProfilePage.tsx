
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import AudioItem from "@/components/AudioItem";
import Loading from "@/components/Loading";
import { getEmailUsernameMap } from "@/lib/googleAuth";

interface AudioFile {
  title: string;
  file: File;
  audioURL: string;
  createdAt: number;
}

export default function ProfilePage() {
  const { username: rawUsername } = useParams<{ username: string }>();
  // Clean up username parameter (remove @ if present)
  const username = rawUsername?.startsWith('@') ? rawUsername.substring(1) : rawUsername;
  
  const [isLoading, setIsLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      if (!username) {
        setUserExists(false);
        setIsLoading(false);
        return;
      }
      
      // Update the document title
      document.title = `@${username} - vzee.fun`;
      
      // Check if this username exists in our system
      const usernameMappings = getEmailUsernameMap();
      const allUsernames = Object.values(usernameMappings);
      const usernameExists = allUsernames.includes(username);
      
      if (!usernameExists) {
        // Also check in the global usernames list
        const globalUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
        if (!globalUsernames.includes(username)) {
          setUserExists(false);
          setIsLoading(false);
          return;
        }
      }
      
      setUserExists(true);
      
      // Get user's email from the username
      const userEmail = Object.keys(usernameMappings).find(
        email => usernameMappings[email] === username
      );
      
      // Get user profile information if available
      if (userEmail) {
        const allUsers = JSON.parse(localStorage.getItem('vzeeAllUsers') || '{}');
        if (allUsers[userEmail]) {
          setDisplayName(allUsers[userEmail].name || username);
          setProfilePic(allUsers[userEmail].picture || null);
        }
      }
      
      // Load audio files for this user
      try {
        const storedAudioFiles = localStorage.getItem(`${username}_audioFiles`);
        if (storedAudioFiles) {
          const parsedFiles = JSON.parse(storedAudioFiles);
          setAudioFiles(parsedFiles);
        }
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
      
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, [username]);
  
  if (isLoading) {
    return <Loading message="Loading profile..." />;
  }
  
  if (!userExists) {
    return (
      <div className="min-h-screen bg-darkBlack text-white p-4 md:p-8 flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-premiumRed">User Not Found</h1>
          <p className="text-lightGray mb-6">
            The user profile you're looking for doesn't exist.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-premiumRed hover:bg-premiumRed/90 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-darkBlack text-white animate-fade-in">
      <header className="h-40 bg-gradient-to-r from-premiumRed to-red-700 relative">
        <div className="absolute top-4 left-4">
          <Button 
            variant="ghost" 
            className="text-white bg-black/40 hover:bg-black/60" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-20">
        <div className="relative -mt-16 mb-8 flex flex-col items-center">
          {profilePic ? (
            <img 
              src={profilePic} 
              alt={username}
              className="w-32 h-32 rounded-full border-4 border-darkBlack object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-darkBlack">
              <User className="w-12 h-12 text-zinc-400" />
            </div>
          )}
          
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold">@{username}</h1>
            {displayName && displayName !== username && (
              <p className="text-lightGray opacity-70 mt-1">{displayName}</p>
            )}
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6">Audio Files</h2>
          
          {audioFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioFiles.map((audio, index) => (
                <AudioItem
                  key={index}
                  title={audio.title}
                  username={username}
                  audioFile={audio.file}
                  audioURL={audio.audioURL}
                />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/50 rounded-lg p-10 text-center">
              <p className="text-zinc-400">No audio files uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
