
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Play, Pause, Share2, Trash2, MoreVertical, X } from "lucide-react";
import AudioWaveform from "./AudioWaveform";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioItemProps {
  title: string;
  username: string;
  audioFile: File;
  audioURL?: string;
  onDelete?: (title: string) => void;
}

const AudioItem = ({ 
  title, 
  username, 
  audioFile, 
  audioURL: providedAudioURL,
  onDelete 
}: AudioItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(providedAudioURL || null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Create URL from file if not provided or if URL is broken
    if (!audioURL || (audioElement && audioElement.error)) {
      try {
        const url = URL.createObjectURL(audioFile);
        setAudioURL(url);
      } catch (error) {
        console.error("Error creating audio URL:", error);
      }
    }
    
    // Create audio element to ensure it's ready for playback
    if (audioURL && !audioElement) {
      const audio = new Audio(audioURL);
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      setAudioElement(audio);
    }
  }, [audioFile, audioURL, audioElement]);

  const handleLongPressStart = () => {
    longPressTimerRef.current = window.setTimeout(() => {
      setIsLongPressing(true);
    }, 800); // 800ms long press to trigger
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
  };
  
  const handlePlayPause = () => {
    if (!audioURL) {
      // Create URL from file if not provided
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
          audioElement.play().catch(err => {
            console.error("Error playing audio:", err);
            // Try recreating the audio URL
            const newUrl = URL.createObjectURL(audioFile);
            const newAudio = new Audio(newUrl);
            newAudio.addEventListener("ended", () => {
              setIsPlaying(false);
            });
            setAudioURL(newUrl);
            setAudioElement(newAudio);
            newAudio.play().then(() => {
              setIsPlaying(true);
            }).catch(err2 => {
              console.error("Failed to play with recreated URL:", err2);
            });
          });
        }
        setIsPlaying(!isPlaying);
      } else {
        // If audio element not created yet but URL exists
        const audio = new Audio(audioURL);
        audio.addEventListener("ended", () => {
          setIsPlaying(false);
        });
        audio.addEventListener("error", () => {
          // Handle audio error by recreating URL
          const newUrl = URL.createObjectURL(audioFile);
          audio.src = newUrl;
          setAudioURL(newUrl);
          audio.load();
          audio.play().catch(err => console.error("Error playing recreated audio:", err));
        });
        setAudioElement(audio);
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Error playing audio:", err);
        });
      }
    }
  };
  
  const handleCopyLink = () => {
    // Make sure username has the @ prefix for the URL
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;
    const link = `${window.location.origin}/${formattedUsername}/${title}`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
    });
  };

  const handleShare = () => {
    // Make sure username has the @ prefix for the URL
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;
    const shareUrl = `${window.location.origin}/${formattedUsername}/${title}`;
    
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
  
  const handleDelete = () => {
    setShowDeleteDialog(false);
    if (onDelete) {
      onDelete(title);
      toast({
        title: "Audio deleted",
        description: "Your audio file has been deleted",
      });
    }
  };

  const showDeleteConfirm = () => {
    setShowDeleteDialog(true);
  };

  // Make sure username has the @ prefix for the link
  const formattedUsername = username.startsWith('@') ? username : `@${username}`;
  const audioLink = `/${formattedUsername}/${title}`;

  return (
    <>
      <div 
        className={`premium-card relative ${isLongPressing ? 'bg-muted/20' : ''}`}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
      >
        {/* Audio actions dropdown */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-muted/50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuItem 
                onClick={handleShare}
                className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleCopyLink}
                className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={showDeleteConfirm}
                className="flex items-center gap-2 cursor-pointer text-premiumRed hover:bg-zinc-800 hover:text-premiumRed"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-premiumRed text-white hover:bg-opacity-80"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Link to={audioLink} className="font-medium hover:text-premiumRed transition-colors">
              {title}
            </Link>
          </div>
        </div>
        
        <AudioWaveform isPlaying={isPlaying} className="my-3" />
        
        <div className="flex justify-between items-center mt-3">
          <Link to={audioLink} className="text-xs text-muted-foreground hover:text-premiumRed transition-colors">
            vzee.fun/{formattedUsername}/{title}
          </Link>
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-premiumRed text-white hover:bg-premiumRed/90">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AudioItem;
