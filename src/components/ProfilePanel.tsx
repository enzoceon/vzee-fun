
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, User, LogOut, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePanelProps {
  username: string;
  onClose: () => void;
}

const ProfilePanel = ({ username: initialUsername, onClose, ...props }: ProfilePanelProps) => {
  const { toast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState(initialUsername);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleSignOut = () => {
    toast({
      title: "Signing out",
      description: "You have been signed out successfully",
    });
    // In a real app, this would sign the user out and redirect to login
    // For now, we'll just reload the page
    window.location.reload();
  };
  
  const toggleChangeUsername = () => {
    setIsChangingUsername(!isChangingUsername);
    setNewUsername(username);
    setError(null);
  };
  
  const validateUsername = (value: string) => {
    if (!value || value.trim() === '') {
      return "Username cannot be empty";
    }
    
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    
    if (value.length > 20) {
      return "Username must be less than 20 characters";
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, underscores and dashes";
    }
    
    return null;
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewUsername(value);
    setError(validateUsername(value));
  };
  
  const saveUsername = () => {
    const validationError = validateUsername(newUsername);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Simulate API call to check username availability and save
    setTimeout(() => {
      // Simulate username taken check (randomly)
      const isTaken = newUsername === "admin" || newUsername === "test" || Math.random() > 0.8;
      
      if (isTaken) {
        setError("This username is already taken");
        setIsSubmitting(false);
        return;
      }
      
      setUsername(newUsername);
      setIsChangingUsername(false);
      setIsSubmitting(false);
      
      toast({
        description: "Username updated successfully!",
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-50 animate-fade-in">
      <div 
        ref={panelRef}
        className="w-full max-w-sm bg-black h-full overflow-y-auto shadow-lg animate-slide-right"
        {...props}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-premiumRed mb-4">
              <User className="w-10 h-10 text-lightGray" />
            </div>
            <span className="text-lg font-medium text-lightGray">Demo User</span>
            <span className="text-sm text-muted-foreground">user@example.com</span>
          </div>
          
          <div className="bg-muted bg-opacity-30 rounded-lg p-4 mb-6">
            <label className="text-sm text-muted-foreground">Username</label>
            
            {isChangingUsername ? (
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-md flex-1">
                    <span className="text-muted-foreground">vzee.fun/</span>
                    <input 
                      type="text"
                      value={newUsername}
                      onChange={handleUsernameChange}
                      className="bg-transparent border-none outline-none text-lightGray font-medium"
                      placeholder="username"
                      autoFocus
                    />
                  </div>
                </div>
                
                {error && (
                  <p className="text-sm text-premiumRed">{error}</p>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleChangeUsername}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={saveUsername}
                    className="flex-1 bg-premiumRed hover:bg-premiumRed/90"
                    disabled={isSubmitting || !!error}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Save
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-muted p-2 rounded-md flex-1 text-left">
                  <span className="text-muted-foreground">vzee.fun/</span>
                  <span className="text-lightGray font-medium">{username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleChangeUsername}
                  className="whitespace-nowrap"
                >
                  Change
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-premiumRed hover:text-white border-premiumRed text-premiumRed" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
