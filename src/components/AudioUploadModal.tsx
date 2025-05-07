
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { X, Upload, CheckCircle } from "lucide-react";

interface AudioUploadModalProps {
  username: string;
  onClose: () => void;
  onUploadComplete: (title: string, file: File) => void;
}

const AudioUploadModal = ({ username, onClose, onUploadComplete }: AudioUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [titleAvailable, setTitleAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setTitle(newTitle);
    
    if (newTitle.length >= 3) {
      setIsChecking(true);
      setTimeout(() => {
        // Simulate checking if title is available
        setTitleAvailable(Math.random() > 0.1);
        setIsChecking(false);
      }, 600);
    } else {
      setTitleAvailable(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || title.length < 3 || !titleAvailable) {
      toast({
        title: "Invalid submission",
        description: "Please provide a valid title and audio file",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      onUploadComplete(title, file);
      onClose();
      toast({
        title: "Upload successful",
        description: `Your audio "${title}" has been uploaded`,
      });
    }, 2000);
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
        className="bg-secondary w-full max-w-md rounded-lg shadow-xl animate-slide-up"
      >
        <div className="flex justify-between items-center p-4 border-b border-muted">
          <h2 className="text-xl font-semibold">Upload Audio</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div className="space-y-4">
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-premiumRed transition-colors"
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-1">Click to upload audio file</p>
                <p className="text-xs text-muted-foreground">MP3, WAV, or OGG (Max 10MB)</p>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-premiumRed mr-3" />
                <div className="flex-1 truncate text-left">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
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
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <div className="relative">
                <Input 
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter title"
                  className="input-premium"
                  minLength={3}
                  maxLength={30}
                  required
                />
                {title.length >= 3 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isChecking ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
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
            
            <div className="bg-muted bg-opacity-40 p-3 rounded-md">
              <p className="text-sm text-center">
                <span className="text-muted-foreground">Share link: </span>
                <span className="font-medium">vzee.fun/{username}/{title || "title"}</span>
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="btn-premium w-full"
              disabled={isUploading || !file || !title || title.length < 3 || titleAvailable === false}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
