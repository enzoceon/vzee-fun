
import { useParams } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

const AudioPage = () => {
  const { username, title } = useParams<{ username: string; title: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [exists, setExists] = useState(true);
  
  useEffect(() => {
    // Simulate checking if the audio exists
    setTimeout(() => {
      // In a real app, we would make an API call to check if the audio exists
      const audioExists = Math.random() > 0.1; // 90% chance it exists
      setExists(audioExists);
      setIsLoading(false);
    }, 1000);
  }, [username, title]);
  
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
        <a 
          href="/" 
          className="bg-premiumRed text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-200"
        >
          Go to vzee.fun
        </a>
      </div>
    );
  }
  
  return <AudioPlayer />;
};

export default AudioPage;
