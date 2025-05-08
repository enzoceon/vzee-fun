
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

interface AudioData {
  audioURL: string;
  title: string;
  username: string;
  duration?: number;
}

const AudioPage = () => {
  const { username, title } = useParams<{ username: string; title: string }>();
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
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <Loading message="Loading audio..." />;
  }
  
  if (!exists || !audioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white p-4 text-center">
        <Helmet>
          <title>Audio Not Found - vzee.fun</title>
          <meta name="description" content="The audio you're looking for doesn't exist or has been removed." />
        </Helmet>
        <h1 className="text-3xl font-bold mb-4 text-premiumRed">Audio Not Found</h1>
        <p className="text-lightGray mb-8">
          The audio you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          onClick={handleBack}
          className="bg-premiumRed text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-10 text-white bg-black/30 hover:bg-black/50"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      <AudioPlayer 
        audioURL={audioData.audioURL} 
        title={audioData.title} 
        username={audioData.username} 
      />
    </div>
  );
};

export default AudioPage;
