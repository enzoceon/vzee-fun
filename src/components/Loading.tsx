
import AudioWaveform from "./AudioWaveform";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = "Loading..." }: LoadingProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkBlack text-white animate-fade-in">
      <AudioWaveform isPlaying={true} className="mb-4" />
      <p className="text-lg font-medium text-premiumRed">{message}</p>
    </div>
  );
};

export default Loading;
