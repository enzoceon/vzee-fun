
import { useParams } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

interface AudioData {
  audioURL: string;
  title: string;
  username: string;
  duration?: number;
}

const AudioPage = () => {
  // Use username parameter which may or may not have the @ prefix
  const { username: rawUsername, title } = useParams<{ username: string; title: string }>();
  const username = rawUsername?.startsWith('@') ? rawUsername.substring(1) : rawUsername;
  
  const [isLoading, setIsLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  
  useEffect(() => {
    if (!username || !title) {
      setExists(false);
      setIsLoading(false);
      return;
    }

    // Update the document title
    document.title = title ? `${title} - vzee.fun` : "Audio - vzee.fun";

    // Check if we have locally stored audio
    const storedAudios = localStorage.getItem(`${username}_audioFiles`);
    
    if (storedAudios) {
      try {
        const audioFiles = JSON.parse(storedAudios);
        const foundAudio = audioFiles.find((audio: any) => audio.title === title);
        
        if (foundAudio) {
          setExists(true);
          setAudioData({
            audioURL: foundAudio.audioURL,
            title: foundAudio.title,
            username: username
          });
        } else {
          setExists(false);
        }
      } catch (error) {
        console.error("Error parsing stored audio data:", error);
        setExists(false);
      }
    } else {
      // No locally stored audio found
      setExists(false);
    }
    
    setIsLoading(false);
  }, [username, title]);
  
  if (isLoading) {
    return <Loading message="Loading audio..." />;
  }
  
  if (!exists || !audioData) {
    // Update title for not found page
    useEffect(() => {
      document.title = "Audio Not Found - vzee.fun";
    }, []);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-premiumRed">Audio Not Found</h1>
        <p className="text-lightGray mb-8">
          The audio you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <AudioPlayer 
        audioURL={audioData.audioURL} 
        title={audioData.title} 
        username={audioData.username} 
      />
    </div>
  );
};

export default AudioPage;
