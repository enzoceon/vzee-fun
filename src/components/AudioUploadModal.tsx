import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, FileAudio, CheckCircle, Share, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AudioUploadModalProps {
  username: string;
  onClose: () => void;
  onUploadComplete: (title: string, file: File, audioURL: string) => void;
}

const AudioUploadModal = ({ username, onClose, onUploadComplete }: AudioUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [titleAvailable, setTitleAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(isChecking);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast: toastHook } = useToast();
  
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setTitle(newTitle);
    
    if (newTitle.length >= 3) {
      setIsChecking(true);
      
      try {
        console.log("Checking title availability:", newTitle);
        // Check if title already exists in Supabase
        const { data, error } = await supabase
          .from('audio_uploads')
          .select('title')
          .eq('username', username)
          .eq('title', newTitle)
          .maybeSingle();
          
        console.log("Title check result:", { data, error });
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking title:", error);
          setTitleAvailable(null);
          return;
        }
        
        // Title is available if no data was returned
        setTitleAvailable(!data);
      } catch (error) {
        console.error("Error in title check:", error);
        setTitleAvailable(null);
      } finally {
        setIsChecking(false);
      }
    } else {
      setTitleAvailable(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error("Maximum file size is 10MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || title.length < 3 || !titleAvailable) {
      toast.error("Please provide a valid title and audio file");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Generate a data URL from the file
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          if (!event.target?.result) {
            toast.error("Failed to read file");
            setIsUploading(false);
            reject("Failed to read file");
            return;
          }
          
          const audioURL = event.target.result as string;
          console.log("Created audio data URL");
          
          try {
            // Call parent callback to complete upload
            onUploadComplete(title, file, audioURL);
            setIsUploading(false);
            onClose();
            resolve();
          } catch (error) {
            console.error("Error in upload completion:", error);
            setIsUploading(false);
            reject(error);
          }
        };
        
        reader.onerror = () => {
          toast.error("Error reading file");
          setIsUploading(false);
          reject("Error reading file");
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error("There was an error processing your upload");
    }
  };
  
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="bg-black w-full max-w-md rounded-xl shadow-xl animate-slide-up"
      >
        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Upload Audio</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-5">
          <div className="space-y-5">
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 bg-zinc-900 rounded-xl p-8 text-center cursor-pointer hover:border-premiumRed transition-colors group"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-premiumRed/20 transition-colors">
                  <FileAudio className="w-8 h-8 text-zinc-400 group-hover:text-premiumRed transition-colors" />
                </div>
                <p className="text-white text-lg mb-1 font-medium">Click to upload audio</p>
                <p className="text-sm text-zinc-400">MP3, WAV, or OGG (Max 10MB)</p>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-xl p-5 flex items-center border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-premiumRed/20 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-premiumRed" />
                </div>
                <div className="flex-1 truncate text-left">
                  <p className="font-medium truncate text-white">{file.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-zinc-800"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="audio/*" 
              className="hidden" 
            />
            
            <div className="space-y-2.5">
              <label htmlFor="title" className="text-sm font-medium text-white">
                Title
              </label>
              <div className="relative">
                <Input 
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder=""
                  className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-premiumRed"
                  minLength={3}
                  maxLength={30}
                  required
                />
                {title.length >= 3 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isChecking ? (
                      <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                    ) : titleAvailable ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : titleAvailable === false ? (
                      <X className="w-4 h-4 text-premiumRed" />
                    ) : null}
                  </div>
                )}
              </div>
              
              {title.length >= 3 && titleAvailable === false && (
                <p className="text-xs text-premiumRed">This title is already taken</p>
              )}
            </div>
            
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 mt-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Share className="w-4 h-4 text-zinc-400" />
                <p className="text-zinc-400">
                  {username ? `${window.location.origin}/@${username}/${title || ""}` : "Create your unique share link"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-premiumRed to-red-700 hover:opacity-90 text-white font-medium py-2.5 rounded-xl transition-all"
              disabled={isUploading || !file || !title || title.length < 3 || titleAvailable === false}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudioUploadModal;
