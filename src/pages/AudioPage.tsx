
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import Loading from "@/components/Loading";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";

interface AudioData {
  title: string;
  audio_url: string;
  file?: File;
  audioURL?: string;
}

const AudioPage = () => {
  const { username: rawUsername, title } = useParams<{ username: string; title: string }>();
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
        // Try to get audio from Supabase
        const { data, error } = await supabase
          .from('audio_uploads')
          .select('*')
          .eq('username', username)
          .eq('title', title)
          .single();
        
        if (error) {
          console.log("Audio not found in Supabase, checking localStorage");
          
          // If not in Supabase, try localStorage
          const storedAudios = localStorage.getItem(`${username}_audioFiles`);
          if (storedAudios) {
            const audioFiles = JSON.parse(storedAudios);
            const audio = audioFiles.find((a: any) => a.title === title);
            
            if (audio) {
              setAudioData({
                title: audio.title,
                audio_url: audio.audioURL,
                file: audio.file,
                audioURL: audio.audioURL
              });
              
              // Try to save this to Supabase for future use
              await supabase
                .from('audio_uploads')
                .insert({
                  username: username,
                  title: audio.title,
                  audio_url: audio.audioURL || ''
                })
                .then(({ error }) => {
                  if (error) console.error("Error saving audio to Supabase:", error);
                });
            } else {
              setNotFound(true);
            }
          } else {
            setNotFound(true);
          }
        } else {
          // Found in Supabase
          setAudioData({
            title: data.title,
            audio_url: data.audio_url,
            audioURL: data.audio_url
          });
        }
      } catch (error) {
        console.error("Error fetching audio data:", error);
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
      audioURL={audioData.audioURL || audioData.audio_url}
      title={audioData.title}
      username={username || ""}
      audioFile={audioData.file}
    />
  );
};

export default AudioPage;
