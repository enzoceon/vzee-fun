
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AudioPage = () => {
  const { username, title } = useParams<{ username: string; title: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [exists, setExists] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate checking if the audio exists
    setTimeout(() => {
      // In a real app, we would make an API call to check if the audio exists
      const audioExists = Math.random() > 0.1; // 90% chance it exists
      setExists(audioExists);
      setIsLoading(false);
    }, 1000);
  }, [username, title]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <Loading message="Loading audio..." />;
  }
  
  if (!exists) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white p-4 text-center">
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
      <AudioPlayer />
    </div>
  );
};

export default AudioPage;
