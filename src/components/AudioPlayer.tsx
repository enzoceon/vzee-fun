
import { useState, useEffect, useRef } from "react";
import AudioWaveform from "./AudioWaveform";
import { useParams } from "react-router-dom";

const AudioPlayer = () => {
  const { username, title } = useParams<{ username: string; title: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // In a real app, we would fetch the audio file from an API
    // For now, we'll just simulate playing audio with a dummy file
    
    // Create a simulated audio element
    const audio = new Audio("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3");
    audioRef.current = audio;
    
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
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkBlack text-white">
      <div className="w-full max-w-lg px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-premiumRed">{title}</h1>
          <p className="text-lightGray opacity-70">@{username}</p>
        </div>
        
        <div className="flex justify-center">
          <AudioWaveform 
            isPlaying={isPlaying} 
            barCount={40} 
            className="h-32" 
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
