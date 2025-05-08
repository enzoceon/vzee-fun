
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User } from "lucide-react";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioItem from "@/components/AudioItem";
import Loading from "@/components/Loading";

interface AudioFile {
  title: string;
  file: File;
  audioURL: string;
  createdAt: number;
}

interface UserProfile {
  username: string;
  name?: string;
  picture?: string;
  email?: string;
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const cleanUsername = username?.startsWith('@') ? username.substring(1) : username;
  
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!cleanUsername) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    // Update document title
    document.title = `@${cleanUsername} - vzee.fun`;

    // Try to find this user in local storage
    const usernameMap = JSON.parse(localStorage.getItem('vzeeUsernameMap') || '{}');
    const emailsToUsernames = Object.entries(usernameMap);
    
    let foundEmail = '';
    let foundUsername = '';
    
    for (const [email, uname] of emailsToUsernames) {
      if (uname === cleanUsername) {
        foundEmail = email;
        foundUsername = uname as string;
        break;
      }
    }
    
    if (!foundUsername) {
      // Check the global username list as a fallback
      const allUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
      if (allUsernames.includes(cleanUsername)) {
        foundUsername = cleanUsername;
      } else {
        setNotFound(true);
        setLoading(false);
        return;
      }
    }
    
    // Set up profile information
    setUserProfile({
      username: foundUsername
    });
    
    // Look for any stored user data that matches this email
    const allUsers = localStorage.getItem('vzeeAllUsers');
    if (allUsers && foundEmail) {
      try {
        const users = JSON.parse(allUsers);
        const foundUser = users[foundEmail];
        if (foundUser) {
          setUserProfile(prev => ({
            ...prev!,
            name: foundUser.name,
            picture: foundUser.picture,
            email: foundEmail
          }));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load audio files for this user
    const savedAudioFiles = localStorage.getItem(`${foundUsername}_audioFiles`);
    if (savedAudioFiles) {
      try {
        const parsedFiles = JSON.parse(savedAudioFiles);
        setAudioFiles(parsedFiles);
      } catch (error) {
        console.error('Error parsing audio files:', error);
      }
    }
    
    setLoading(false);
  }, [cleanUsername]);

  const handleDeleteAudio = (title: string) => {
    if (!userProfile?.username) return;
    
    // Filter out the deleted audio file
    const updatedAudioFiles = audioFiles.filter(file => file.title !== title);
    setAudioFiles(updatedAudioFiles);
    
    // Update localStorage
    localStorage.setItem(`${userProfile.username}_audioFiles`, JSON.stringify(updatedAudioFiles));
  };

  if (loading) {
    return <Loading message="Loading profile..." />;
  }
  
  if (notFound) {
    return (
      <div className="min-h-screen bg-darkBlack text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4 text-premiumRed">Profile Not Found</h1>
        <p className="text-lightGray mb-6">The user you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="bg-premiumRed hover:bg-premiumRed/90 text-white">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBlack text-white">
      <div className="w-full bg-gradient-to-b from-zinc-900 to-darkBlack pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center">
            {userProfile?.picture ? (
              <img 
                src={userProfile.picture} 
                alt={userProfile.username} 
                className="w-24 h-24 rounded-full border-4 border-premiumRed mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-premiumRed mb-4">
                <User className="w-12 h-12 text-lightGray" />
              </div>
            )}
            
            <h1 className="text-2xl font-bold mb-1">
              {userProfile?.name || userProfile?.username || 'User'}
            </h1>
            
            <p className="text-lightGray mb-4 flex items-center gap-1">
              @{userProfile?.username}
            </p>
            
            <a 
              href="https://www.paypal.me/enzoceon" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-2"
            >
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white gap-2 px-6"
              >
                <HeartHandshake className="w-5 h-5" /> Support Us
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          Audio Files
        </h2>
        
        {audioFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioFiles.map((audio, index) => (
              <AudioItem
                key={index}
                title={audio.title}
                username={userProfile?.username || ''}
                audioFile={audio.file}
                audioURL={audio.audioURL}
                onDelete={handleDeleteAudio}
              />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/50 p-8 rounded-lg text-center">
            <p className="text-lightGray opacity-70">No audio files found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
