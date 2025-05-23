
import { useState, useEffect, useRef } from "react";
import AudioWaveform from "./AudioWaveform";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  audioURL: string;
  title: string;
  username: string;
  audioFile?: File;
}

const AudioPlayer = ({ audioURL, title, username, audioFile }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    // Update the document title when component mounts
    document.title = `${title} by @${username} - vzee.fun`;
    
    // Create audio element
    const audio = new Audio(audioURL);
    audioRef.current = audio;
    
    // Set up audio event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleAudioError);
    
    // Autoplay the audio
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.error("Autoplay failed:", err);
    });
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [audioURL, title, username]);
  
  const handleAudioError = (e: Event) => {
    console.error("Audio playback error:", e);
    
    // If we have the file object and the URL is broken, try to recreate it
    if (audioFile && audioRef.current) {
      try {
        const newUrl = URL.createObjectURL(audioFile);
        audioRef.current.src = newUrl;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Failed to play with recreated URL:", err);
        });
      } catch (fileErr) {
        console.error("Failed to recreate audio URL from file:", fileErr);
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
    setCurrentTime(newTime);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkBlack text-white">
      <div className="w-full max-w-lg px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-premiumRed">{title}</h1>
          <p className="text-lightGray opacity-70">@{username}</p>
        </div>
        
        <div className="space-y-6">
          {/* Main waveform - large size */}
          <div className="flex justify-center">
            <AudioWaveform 
              isPlaying={isPlaying} 
              barCount={60} 
              className="h-32" 
            />
          </div>
          
          {/* Progress bar */}
          <div 
            className="h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-premiumRed"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Time display */}
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-premiumRed text-white hover:bg-opacity-80"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-zinc-400 hover:text-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
