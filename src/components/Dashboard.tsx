import { useState } from "react";
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
}

interface DashboardProps {
  username: string;
}

const Dashboard = ({ username }: DashboardProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "audio">("home");
  const { toast } = useToast();
  
  const handleUploadComplete = (title: string, file: File) => {
    setAudioFiles([...audioFiles, { title, file }]);
    setActiveTab("audio"); // Switch to audio tab after upload
  };

  const renderHomeTab = () => {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Share Your Audio</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Upload your first audio file to get started. Your unique audio page will be instantly shared with the world.
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
