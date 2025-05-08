
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Play, Pause, Share2 } from "lucide-react";
import AudioWaveform from "./AudioWaveform";

interface AudioItemProps {
  title: string;
  username: string;
  audioFile: File;
}

const AudioItem = ({ title, username, audioFile }: AudioItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const handlePlayPause = () => {
    if (!audioURL) {
      // Create URL from file
      const url = URL.createObjectURL(audioFile);
      setAudioURL(url);
      
      const audio = new Audio(url);
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
        } else {
          audioElement.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };
  
  const handleCopyLink = () => {
    const link = `vzee.fun/${username}/${title}`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
    });
  };

  const handleShare = () => {
    const shareUrl = `vzee.fun/${username}/${title}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Listen to ${title} on vzee.fun`,
        text: `Check out this audio file: ${title}`,
        url: shareUrl,
      })
      .then(() => {
        toast({ description: "Shared successfully!" });
      })
      .catch(() => {
        toast({ description: "Sharing cancelled or failed" });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({ description: "Audio URL copied to clipboard!" });
        })
        .catch(() => {
          toast({ variant: "destructive", description: "Failed to copy URL" });
        });
    }
  };

  return (
    <div className="premium-card relative">
      {/* Share button in the top right corner with text label */}
      <Button 
        variant="ghost" 
        size="sm"
        className="absolute top-2 right-2 text-premiumRed hover:bg-muted/50 gap-1"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-premiumRed text-white hover:bg-opacity-80"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <h3 className="font-medium">{title}</h3>
        </div>
      </div>
      
      <AudioWaveform isPlaying={isPlaying} className="my-3" />
      
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-muted-foreground">
          vzee.fun/{username}/{title}
        </span>
        <Button 
          variant="outline"
          size="sm" 
          className="text-xs border-premiumRed text-premiumRed hover:bg-premiumRed hover:text-white"
          onClick={handleCopyLink}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy Link
        </Button>
      </div>
    </div>
  );
};

export default AudioItem;
