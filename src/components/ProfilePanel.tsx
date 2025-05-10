import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, User, LogOut, Check, HeartHandshake, UserCheck, AlertTriangle, Loader2, Copy, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut, getCurrentUser } from "@/lib/googleAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePanelProps {
  username: string;
  onClose: () => void;
}

const ProfilePanel = ({ username: initialUsername, onClose, ...props }: ProfilePanelProps) => {
  const { toast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState(initialUsername);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const user = getCurrentUser();
  const displayName = user?.name || "User";
  const email = user?.email || "user@example.com";
  const profilePicture = user?.picture;
  
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
  
  useEffect(() => {
    if (isChangingUsername && newUsername !== username && newUsername.length >= 3) {
      const checkTimeout = setTimeout(() => {
        setIsChecking(true);
        // Check against Supabase if username exists
        const checkUsername = async () => {
          try {
            const { data, error: supabaseError } = await supabase
              .from('user_profiles')
              .select('username')
              .eq('username', newUsername)
              .single();
              
            if (supabaseError && supabaseError.code === 'PGRST116') {
              // Username is available (no record found)
              setIsAvailable(true);
            } else {
              // Username is taken
              setIsAvailable(false);
            }
          } catch (error) {
            console.error("Error checking username:", error);
            // Fallback to localStorage check
            const allUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
            const isTaken = allUsernames.includes(newUsername) && newUsername !== username;
            setIsAvailable(!isTaken);
          } finally {
            setIsChecking(false);
          }
        };
        
        checkUsername();
      }, 300);
      
      return () => clearTimeout(checkTimeout);
    }
  }, [newUsername, username, isChangingUsername]);
  
  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signing out",
      description: "You have been signed out successfully",
    });
    // Reload the page to return to the auth screen
    window.location.reload();
  };

  const navigateToProfile = () => {
    // Close the panel first
    onClose();
    // Navigate to the profile page with proper formatting
    setTimeout(() => {
      navigate(`/@${username}`);
    }, 100);
  };

  const copyProfileUrl = () => {
    const profileUrl = `${window.location.origin}/@${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to clipboard",
      description: "Profile URL has been copied to clipboard",
    });
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/@${username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${username}'s profile on vzee.fun`,
        text: `Check out ${username}'s profile on vzee.fun`,
        url: profileUrl,
      }).then(() => {
        toast({
          title: "Profile shared successfully",
          description: "Thanks for sharing!",
        });
      }).catch((error) => {
        console.error('Error sharing:', error);
        copyProfileUrl(); // Fallback to copying the URL
      });
    } else {
      copyProfileUrl(); // Fallback for browsers that don't support share
    }
  };
  
  const toggleChangeUsername = () => {
    setIsChangingUsername(!isChangingUsername);
    setNewUsername(username);
    setError(null);
    setIsAvailable(null);
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
    const validationError = validateUsername(value);
    setError(validationError);
  };
  
  const saveUsername = async () => {
    const validationError = validateUsername(newUsername);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check if the username is available first
      if (username !== newUsername) {
        const { data: existingUser, error: checkError } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', newUsername)
          .maybeSingle();
          
        if (existingUser) {
          setError("Username is already taken");
          setIsSubmitting(false);
          return;
        }
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking username:", checkError);
        }
      }
      
      // Get current user for updating
      const user = getCurrentUser();
      if (!user?.email) {
        throw new Error("User email not found");
      }
      
      // If changing from existing username
      if (username) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            username: newUsername,
            display_name: user.name,
            picture_url: user.picture
          })
          .eq('username', username);
          
        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw new Error("Failed to update profile");
        }
      } else {
        // Insert new profile if first time
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({ 
            username: newUsername,
            display_name: user.name,
            picture_url: user.picture
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw new Error("Failed to create profile");
        }
      }
      
      // Update username in local storage for legacy support
      setUsername(newUsername);
      localStorage.setItem('vzeeUsername', newUsername);
      
      // Update username in the email-username mapping
      if (user?.email) {
        const usernameMappings = JSON.parse(localStorage.getItem('vzeeUsernameMap') || '{}');
        usernameMappings[user.email] = newUsername;
        localStorage.setItem('vzeeUsernameMap', JSON.stringify(usernameMappings));
      }
      
      // Rename user's audio files in localStorage if they exist
      const oldAudioFiles = localStorage.getItem(`${username}_audioFiles`);
      if (oldAudioFiles) {
        localStorage.setItem(`${newUsername}_audioFiles`, oldAudioFiles);
        localStorage.removeItem(`${username}_audioFiles`);
      }
      
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully!",
      });
      
      setIsChangingUsername(false);
    } catch (error) {
      console.error("Error saving username:", error);
      setError("Failed to save username. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullProfileUrl = `vzee.fun/@${username}`;

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
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-20 h-20 rounded-full mb-4 border-2 border-premiumRed"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-premiumRed mb-4">
                <User className="w-10 h-10 text-lightGray" />
              </div>
            )}
            <span className="text-lg font-medium text-lightGray">{displayName}</span>
            <span className="text-sm text-muted-foreground">{email}</span>
            
            <Button 
              variant="outline" 
              className="mt-4 text-sm border-premiumRed text-premiumRed hover:bg-premiumRed hover:text-white"
              onClick={navigateToProfile}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              View Public Profile
            </Button>
          </div>
          
          <div className="bg-muted bg-opacity-30 rounded-lg p-4 mb-6">
            <label className="text-sm text-muted-foreground">Username</label>
            
            {isChangingUsername ? (
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-md flex-1 relative">
                    <span className="text-muted-foreground">@</span>
                    <input 
                      type="text"
                      value={newUsername}
                      onChange={handleUsernameChange}
                      className="bg-transparent border-none outline-none text-lightGray font-medium w-[85%]"
                      placeholder="username"
                      autoFocus
                    />
                    {newUsername.length >= 3 && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {isChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        ) : isAvailable ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : isAvailable === false ? (
                          <AlertTriangle className="h-4 w-4 text-premiumRed" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <p className="text-sm text-premiumRed">{error}</p>
                )}
                
                {newUsername.length >= 3 && isAvailable === false && !error && (
                  <p className="text-sm text-premiumRed">This username is already taken</p>
                )}
                
                {newUsername.length >= 3 && isAvailable && !error && (
                  <p className="text-sm text-green-500">This username is available</p>
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
                    disabled={isSubmitting || !!error || isAvailable === false || isChecking}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
              <div className="space-y-3 mt-1">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-md flex-1 text-left">
                    <span className="text-lightGray font-medium">{fullProfileUrl}</span>
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
                
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="flex-1 bg-premiumRed hover:bg-premiumRed/90"
                    onClick={copyProfileUrl}
                  >
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    className="flex-1 bg-premiumRed hover:bg-premiumRed/90"
                    onClick={shareProfile}
                  >
                    <Share className="w-4 h-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-premiumRed hover:text-white border-premiumRed text-premiumRed" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            
            <a 
              href="https://www.paypal.me/enzoceon"
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full"
            >
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-green-500 bg-green-500 text-white hover:bg-green-600" 
              >
                <HeartHandshake className="w-4 h-4" />
                Support Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
