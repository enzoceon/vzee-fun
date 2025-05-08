
import { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
  className?: string;
}

const AudioWaveform = ({
  isPlaying,
  color = "#ea384c",
  barCount = 15,
  className = "",
}: AudioWaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const bars = containerRef.current.querySelectorAll<HTMLDivElement>(".waveform-bar");
    if (!bars.length) return;
    
    bars.forEach((bar, index) => {
      // Set animation delay to create wave effect
      bar.style.setProperty("--delay", `${index * 0.05}s`);
      
      // Set animation state based on isPlaying
      if (isPlaying) {
        bar.style.animationPlayState = "running";
      } else {
        bar.style.animationPlayState = "paused";
      }
    });
  }, [isPlaying]);
  
  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center gap-1 ${className}`}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className="waveform-bar animate-waveform"
          style={{
            backgroundColor: color,
            height: `${Math.random() * 15 + 5}px`,
            width: "3px",
            animationDelay: `calc(${index * 0.05}s)`,
            animationPlayState: isPlaying ? "running" : "paused"
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
