
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, X } from "lucide-react";
import { getCurrentUser, storeUsernameWithEmail, isUsernameTaken, getAllocatedUsernames } from "@/lib/googleAuth";

interface UsernameSetupProps {
  onComplete: (username: string) => void;
}

const UsernameSetup = ({ onComplete }: UsernameSetupProps) => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Initialize all usernames list if it doesn't exist
  useEffect(() => {
    if (!localStorage.getItem('vzeeAllUsernames')) {
      localStorage.setItem('vzeeAllUsernames', JSON.stringify([]));
    }
    
    // Store this user in the all users map if they're not already there
    if (currentUser?.email) {
      const allUsers = JSON.parse(localStorage.getItem('vzeeAllUsers') || '{}');
      if (!allUsers[currentUser.email]) {
        allUsers[currentUser.email] = {
          name: currentUser.name,
          picture: currentUser.picture
        };
        localStorage.setItem('vzeeAllUsers', JSON.stringify(allUsers));
      }
    }
  }, [currentUser]);

  // Check username availability
  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const checkUsername = setTimeout(() => {
      setIsChecking(true);
      
      // Check against all usernames in localStorage
      setTimeout(() => {
        const taken = isUsernameTaken(username);
        setIsAvailable(!taken);
        setIsChecking(false);
      }, 800);
    }, 500);

    return () => clearTimeout(checkUsername);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAvailable || username.length < 3) {
      toast({
        title: "Invalid username",
        description: "Please choose a valid and available username",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Save username with associated email for future reference
    if (currentUser?.email) {
      storeUsernameWithEmail(currentUser.email, username);
      
      // Update all usernames list
      const allUsernames = getAllocatedUsernames();
      if (!allUsernames.includes(username)) {
        allUsernames.push(username);
        localStorage.setItem('vzeeAllUsernames', JSON.stringify(allUsernames));
      }
    }
    
    // Complete the setup
    setTimeout(() => {
      onComplete(username);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBlack text-white p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose your unique username</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex items-center border border-muted rounded-md bg-secondary overflow-hidden focus-within:ring-1 focus-within:ring-premiumRed">
              <span className="text-sm text-muted-foreground px-3 py-3">
                @
              </span>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="username"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                minLength={3}
                maxLength={20}
                required
              />
              {username.length > 0 && (
                <div className="px-3">
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  ) : isAvailable ? (
                    <Check className="text-green-500 w-4 h-4" />
                  ) : isAvailable === false ? (
                    <X className="text-premiumRed w-4 h-4" />
                  ) : null}
                </div>
              )}
            </div>
            
            {username.length > 0 && !isChecking && (
              <p className={`text-sm mt-1 ${isAvailable ? 'text-green-500' : 'text-premiumRed'}`}>
                {isAvailable ? 'Username is available' : 'Username is taken'}
              </p>
            )}
            
            {username.length > 0 && username.length < 3 && (
              <p className="text-sm mt-1 text-premiumRed">
                Username must be at least 3 characters
              </p>
            )}
          </div>
          
          <div className="bg-zinc-900/50 p-4 rounded-lg mb-4">
            <p className="text-xs text-lightGray opacity-70">
              Your public profile will be available at:
            </p>
            <p className="text-sm font-medium mt-1">
              vzee.fun/@{username || 'username'}
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="btn-premium w-full"
            disabled={!isAvailable || isSubmitting || username.length < 3}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Choose wisely, this will be your public identity
        </p>
      </div>
    </div>
  );
};

export default UsernameSetup;
