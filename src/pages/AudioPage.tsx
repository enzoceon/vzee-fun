
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AudioData {
  audioURL: string;
  title: string;
  username: string;
  duration?: number;
  file?: File;
}

const AudioPage = () => {
  // Use username parameter which may or may not have the @ prefix
  const { username: rawUsername, title } = useParams<{ username: string; title: string }>();
  const username = rawUsername?.startsWith('@') ? rawUsername.substring(1) : rawUsername;
  
  const [isLoading, setIsLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!username || !title) {
      setExists(false);
      setIsLoading(false);
      return;
    }

    // Update the document title
    document.title = title ? `${title} - vzee.fun` : "Audio - vzee.fun";

    // Find the audio file
    const findAudioFile = () => {
      // First try with the exact username
      try {
        const directStoredAudios = localStorage.getItem(`${username}_audioFiles`);
        if (directStoredAudios) {
          const audioFiles = JSON.parse(directStoredAudios);
          const foundAudio = audioFiles.find((audio: any) => audio.title === title);
          
          if (foundAudio) {
            setExists(true);
            setAudioData({
              audioURL: foundAudio.audioURL,
              title: foundAudio.title,
              username: username,
              file: foundAudio.file
            });
            setIsLoading(false);
            return true;
          }
        }
      } catch (error) {
        console.error("Error checking direct username:", error);
      }
      
      // If not found, try all usernames
      try {
        // Get list of all usernames from localStorage
        const allUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
        
        // Search through all usernames
        for (const user of allUsernames) {
          const storedAudios = localStorage.getItem(`${user}_audioFiles`);
          if (storedAudios) {
            try {
              const audioFiles = JSON.parse(storedAudios);
              const audio = audioFiles.find((a: any) => a.title === title);
              if (audio) {
                setExists(true);
                setAudioData({
                  audioURL: audio.audioURL,
                  title: audio.title,
                  username: user,
                  file: audio.file
                });
                setIsLoading(false);
                return true;
              }
            } catch (error) {
              console.error("Error parsing stored audio data:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error searching all usernames:", error);
      }
      
      // If still not found, check all localStorage keys
      try {
        // Look for any key that might contain audio files
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.endsWith('_audioFiles')) {
            try {
              const audioFiles = JSON.parse(localStorage.getItem(key) || '[]');
              const audio = audioFiles.find((a: any) => a.title === title);
              if (audio) {
                const userFromKey = key.replace('_audioFiles', '');
                setExists(true);
                setAudioData({
                  audioURL: audio.audioURL,
                  title: audio.title,
                  username: userFromKey,
                  file: audio.file
                });
                setIsLoading(false);
                return true;
              }
            } catch (error) {
              console.error(`Error parsing data from key ${key}:`, error);
            }
          }
        }
      } catch (error) {
        console.error("Error scanning localStorage keys:", error);
      }
      
      return false;
    };
    
    // Execute the search function
    const found = findAudioFile();
    
    // If audio wasn't found, set exists to false
    if (!found) {
      setExists(false);
      setIsLoading(false);
    }
  }, [username, title]);
  
  if (isLoading) {
    return <Loading message="Loading audio..." />;
  }
  
  if (!exists || !audioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-premiumRed">Audio Not Found</h1>
        <p className="text-lightGray mb-8">
          The audio you're looking for doesn't exist or has been removed.
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
    <div className="relative">
      <AudioPlayer 
        audioURL={audioData.audioURL} 
        title={audioData.title} 
        username={audioData.username}
        audioFile={audioData.file} // Pass the file object if available
      />
    </div>
  );
};

export default AudioPage;
