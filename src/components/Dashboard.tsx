
import { useState } from "react";
import Header from "./Header";
import AudioItem from "./AudioItem";
import AudioUploadModal from "./AudioUploadModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  
  const handleUploadComplete = (title: string, file: File) => {
    setAudioFiles([...audioFiles, { title, file }]);
  };

  return (
    <div className="min-h-screen bg-darkBlack text-lightGray">
      <Header username={username} />
      
      <main className="px-4 py-16 max-w-4xl mx-auto">
        {audioFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Share Your Audio</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Upload your first audio file to get started. Your unique audio page will be instantly shared with the world.
            </p>
          </div>
        ) : (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6 text-left">Your Audio Files</h2>
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
        )}
      </main>
      
      {/* Floating upload button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          className="bg-premiumRed hover:bg-premiumRed text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:animate-pulse-glow"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
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
