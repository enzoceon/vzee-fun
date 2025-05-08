
import { useState, useEffect } from "react";
import Header from "./Header";
import AudioItem from "./AudioItem";
import AudioUploadModal from "./AudioUploadModal";
import TabNavigation from "./TabNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioFile {
  title: string;
  file: File;
  audioURL: string;
  createdAt: number;
}

interface DashboardProps {
  username: string;
}

const Dashboard = ({ username }: DashboardProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "audio">("home");
  const { toast } = useToast();

  // Load saved audio files from localStorage on mount
  useEffect(() => {
    const savedAudioFiles = localStorage.getItem(`${username}_audioFiles`);
    if (savedAudioFiles) {
      try {
        const parsedFiles = JSON.parse(savedAudioFiles);
        setAudioFiles(parsedFiles);
        
        // If we have audio files, switch to audio tab
        if (parsedFiles && parsedFiles.length > 0) {
          setActiveTab("audio");
        }
      } catch (error) {
        console.error("Error loading saved audio files:", error);
        toast({
          title: "Error loading audio files",
          description: "There was a problem loading your saved audio files.",
          variant: "destructive",
        });
      }
    }
  }, [username, toast]);
  
  const handleUploadComplete = (title: string, file: File) => {
    // Create URL for the file
    const audioURL = URL.createObjectURL(file);
    const newAudioFile: AudioFile = { 
      title, 
      file, 
      audioURL,
      createdAt: Date.now() 
    };
    
    const updatedFiles = [...audioFiles, newAudioFile];
    setAudioFiles(updatedFiles);
    
    // Save to localStorage
    try {
      localStorage.setItem(`${username}_audioFiles`, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error("Error saving audio files to localStorage:", error);
      toast({
        title: "Storage error",
        description: "There was a problem saving your audio file. Please try again.",
        variant: "destructive",
      });
    }
    
    setActiveTab("audio"); // Switch to audio tab after upload
  };
  
  const handleDeleteAudio = (titleToDelete: string) => {
    const updatedFiles = audioFiles.filter(audio => audio.title !== titleToDelete);
    setAudioFiles(updatedFiles);
    
    // Update localStorage
    try {
      localStorage.setItem(`${username}_audioFiles`, JSON.stringify(updatedFiles));
    } catch (error) {
      console.error("Error updating audio files in localStorage:", error);
      toast({
        title: "Storage error",
        description: "There was a problem updating your audio files. Please try again.",
        variant: "destructive",
      });
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
            {audioFiles.map((audio, index) => (
              <AudioItem 
                key={index}
                title={audio.title}
                username={username}
                audioFile={audio.file}
                audioURL={audio.audioURL}
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
