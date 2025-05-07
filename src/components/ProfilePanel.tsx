
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, User, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfilePanelProps {
  username: string;
  onClose: () => void;
}

const ProfilePanel = ({ username, onClose, ...props }: ProfilePanelProps) => {
  const { toast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleChangeUsername = () => {
    toast({
      description: "Username change functionality would be implemented here",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-50 animate-fade-in">
      <div 
        ref={panelRef}
        className="w-full max-w-sm bg-secondary h-full overflow-y-auto shadow-lg animate-slide-right"
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
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-muted p-2 rounded-md flex-1 text-left">
                <span className="text-muted-foreground">vzee.fun/</span>
                <span className="text-lightGray font-medium">{username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleChangeUsername}
                className="whitespace-nowrap"
              >
                Change
              </Button>
            </div>
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
