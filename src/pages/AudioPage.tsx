
import { useParams } from "react-router-dom";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

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
          // For re-creating audio URLs that may have been lost between sessions
          let audioURL = foundAudio.audioURL;
          
          // If the URL is no longer valid or doesn't exist, recreate it
          if (!audioURL || audioURL.startsWith('blob:')) {
            try {
              // Recreate a blob URL from the file data
              if (foundAudio.file) {
                // Try to reconstruct the file from the stored data
                const fileData = foundAudio.file;
                // Create a placeholder file with correct metadata
                const file = new File(
                  [new Blob([new ArrayBuffer(1024)])], // Create a small buffer as placeholder
                  fileData.name || 'audio.mp3',
                  { type: fileData.type || 'audio/mpeg' }
                );
                audioURL = URL.createObjectURL(file);
              }
            } catch (error) {
              console.error("Error recreating audio URL:", error);
            }
          }
          
          setExists(true);
          setAudioData({
            audioURL: audioURL,
            title: foundAudio.title,
            username: username,
            file: foundAudio.file
          });
        } else {
          setExists(false);
        }
      } catch (error) {
        console.error("Error parsing stored audio data:", error);
        setExists(false);
      }
    } else {
      // Check all users' audio files as well
      const allUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
      
      let foundAudio = null;
      for (const storedUsername of allUsernames) {
        const userAudios = localStorage.getItem(`${storedUsername}_audioFiles`);
        if (userAudios) {
          try {
            const audioFiles = JSON.parse(userAudios);
            foundAudio = audioFiles.find((audio: any) => audio.title === title);
            if (foundAudio) {
              // For recreating audio URLs that may have been lost
              let audioURL = foundAudio.audioURL;
              if (!audioURL || audioURL.startsWith('blob:')) {
                try {
                  if (foundAudio.file) {
                    const fileData = foundAudio.file;
                    const file = new File(
                      [new Blob([new ArrayBuffer(1024)])],
                      fileData.name || 'audio.mp3',
                      { type: fileData.type || 'audio/mpeg' }
                    );
                    audioURL = URL.createObjectURL(file);
                  }
                } catch (error) {
                  console.error("Error recreating audio URL:", error);
                }
              }
              
              setExists(true);
              setAudioData({
                audioURL: audioURL,
                title: foundAudio.title,
                username: storedUsername,
                file: foundAudio.file
              });
              break;
            }
          } catch (error) {
            console.error("Error parsing stored audio data:", error);
          }
        }
      }
      
      if (!foundAudio) {
        setExists(false);
      }
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
        audioFile={audioData.file} // Pass the file object if available
      />
    </div>
  );
};

export default AudioPage;
