import { useState, useEffect } from "react";
import Header from "./Header";
import AudioItem from "./AudioItem";
import AudioUploadModal from "./AudioUploadModal";
import TabNavigation from "./TabNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
  file?: File;
  audioURL?: string;
}

interface DashboardProps {
  username: string;
}

const Dashboard = ({ username }: DashboardProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "audio">("home");
  const { toast: toastHook } = useToast();

  // Load audio files from Supabase on mount
  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        console.log("Fetching audio files for username:", username);
        
        const { data, error } = await supabase
          .from('audio_uploads')
          .select('*')
          .eq('username', username)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching audio files:", error);
          toast.error("Failed to load your audio files");
        } else if (data && data.length > 0) {
          console.log("Fetched audio files:", data);
          setAudioFiles(data);
          setActiveTab("audio");
        } else {
          console.log("No audio files found for username:", username);
        }
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
    };
    
    if (username) {
      fetchAudioFiles();
    }
  }, [username, toastHook]);
  
  // Function to handle audio upload completion
  const handleUploadComplete = async (title: string, file: File, audioURL: string) => {
    try {
      console.log("Processing audio upload:", { title, username });
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('audio_uploads')
        .insert({
          username,
          title,
          audio_url: audioURL
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error saving audio to Supabase:", error);
        toast.error("Failed to save your audio. Please try again.");
        return;
      }
      
      console.log("Audio saved to Supabase:", data);
      
      // Update state with new audio file
      const newAudioFile: AudioFile = { 
        id: data.id,
        title, 
        audio_url: audioURL,
        created_at: data.created_at
      };
      
      setAudioFiles(prevFiles => [newAudioFile, ...prevFiles]);
      setActiveTab("audio"); // Switch to audio tab after upload
      
      toast.success("Audio uploaded successfully!");
    } catch (error) {
      console.error("Error in upload process:", error);
      toast.error("Upload failed. Please try again.");
    }
  };
  
  // Function to handle audio deletion
  const handleDeleteAudio = async (titleToDelete: string) => {
    try {
      console.log("Deleting audio:", titleToDelete);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('audio_uploads')
        .delete()
        .eq('username', username)
        .eq('title', titleToDelete);
        
      if (error) {
        console.error("Error deleting from Supabase:", error);
        toast.error("Failed to delete the audio");
        return;
      }
      
      // Update local state
      setAudioFiles(prevFiles => prevFiles.filter(audio => audio.title !== titleToDelete));
      
      toast.success("Audio deleted successfully");
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("Delete failed. Please try again.");
    }
  };

  const renderHomeTab = () => {
    return (
      <div className="flex flex-col items-center justify-center mt-6">
        <h2 className="text-xl font-bold mb-1.5">Share Your Audio</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-4 text-sm">
          Upload your audio file to get started. Your unique audio page will be instantly shared.
        </p>
        <Button
          className="bg-premiumRed hover:bg-premiumRed/90 text-white rounded-full px-6 flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="h-5 w-5" />
          Upload Audio
        </Button>
      </div>
    );
  };
  
  const renderAudioTab = () => {
    if (audioFiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] animate-fade-in">
          <p className="text-muted-foreground text-center">
            No audio files uploaded yet
          </p>
        </div>
      );
    } else {
      return (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Audio Files</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioFiles.map((audio) => (
              <AudioItem 
                key={audio.id}
                title={audio.title}
                username={username}
                audioURL={audio.audio_url || audio.audioURL || ""}
                audioFile={audio.file} // This is now optional so no TypeScript error
                onDelete={handleDeleteAudio}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-darkBlack text-lightGray">
      <Header username={username} />
      
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "home" ? renderHomeTab() : renderAudioTab()}
      </main>
      
      {showUploadModal && (
        <AudioUploadModal
          username={username}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
