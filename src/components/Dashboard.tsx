
import { useState } from "react";
import Header from "./Header";
import AudioItem from "./AudioItem";
import AudioUploadModal from "./AudioUploadModal";
import TabNavigation from "./TabNavigation";
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
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
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my audio on vzee.fun',
        text: 'Listen to my audio on vzee.fun',
        url: `https://vzee.fun/${username}`,
      })
      .then(() => toast({ description: "Shared successfully!" }))
      .catch(() => toast({ description: "Sharing cancelled or failed" }));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`https://vzee.fun/${username}`)
        .then(() => toast({ description: "Profile URL copied to clipboard!" }))
        .catch(() => toast({ variant: "destructive", description: "Failed to copy URL" }));
    }
  };

  return (
    <div className="min-h-screen bg-darkBlack text-lightGray">
      <Header username={username} />
      
      <main className="px-4 py-4 max-w-4xl mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {audioFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-lightGray hover:text-premiumRed"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
            <h2 className="text-3xl font-bold mb-4">Share Your Audio</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Upload your first audio file to get started. Your unique audio page will be instantly shared with the world.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Audio Files</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-lightGray hover:text-premiumRed"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
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
        )}
      </main>
      
      {/* Floating upload button */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2">
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
