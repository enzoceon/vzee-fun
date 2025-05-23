
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import Loading from "@/components/Loading";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";
import { toast } from "sonner";

interface AudioData {
  title: string;
  audio_url: string;
}

const AudioPage = () => {
  const { username: rawUsername, title } = useParams<{ username: string; title: string }>();
  // Fix username parsing - remove @ if present
  const username = rawUsername?.startsWith('@') ? rawUsername.substring(1) : rawUsername;
  
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAudioData = async () => {
      if (!username || !title) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching audio for username: ${username}, title: ${title}`);
        
        // Fetch audio from Supabase
        const { data, error } = await supabase
          .from('audio_uploads')
          .select('title, audio_url')
          .eq('username', username)
          .eq('title', title)
          .maybeSingle();
        
        console.log("Supabase response:", { data, error });
        
        if (error) {
          console.error("Error fetching audio:", error);
          setNotFound(true);
        } else if (data) {
          setAudioData({
            title: data.title,
            audio_url: data.audio_url
          });
          
          // Update document title
          document.title = `${data.title} by @${username} - vzee.fun`;
        } else {
          console.log("No audio data found for the specified username and title");
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching audio data:", error);
        toast.error("Failed to load audio");
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioData();
  }, [username, title]);

  if (isLoading) {
    return <Loading message="Loading audio..." />;
  }

  if (notFound || !audioData) {
    return <NotFound />;
  }

  return (
    <AudioPlayer 
      audioURL={audioData.audio_url}
      title={audioData.title}
      username={username || ""}
    />
  );
};

export default AudioPage;
