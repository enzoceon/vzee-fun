
import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import UsernameSetup from "@/components/UsernameSetup";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import { 
  getCurrentUser, 
  isAuthenticated as checkIsAuthenticated, 
  getUsernameByEmail, 
  storeUsernameWithEmail
} from "@/lib/googleAuth";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      setLoadingMessage("Checking authentication...");
      
      // Check if user is already authenticated
      const authenticated = checkIsAuthenticated();
      
      if (authenticated) {
        setIsAuthenticated(true);
        
        // Get current user details
        const user = getCurrentUser();
        if (user?.email) {
          // Check for username mapped to this email
          const userUsername = getUsernameByEmail(user.email);
          
          if (userUsername) {
            setUsername(userUsername);
            // Also ensure it's saved to localStorage for legacy support
            localStorage.setItem('vzeeUsername', userUsername);
          } else {
            // Check for fallback in localStorage (legacy support)
            const savedUsername = localStorage.getItem('vzeeUsername');
            if (savedUsername) {
              setUsername(savedUsername);
              // Store this username with the user's email for persistence
              storeUsernameWithEmail(user.email, savedUsername);
            }
          }
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setIsLoading(true);
    setLoadingMessage("Getting things ready...");
    
    // Check if the authenticated user already has a username
    const user = getCurrentUser();
    if (user?.email) {
      const existingUsername = getUsernameByEmail(user.email);
      if (existingUsername) {
        setUsername(existingUsername);
        // Also ensure it's saved to localStorage for legacy support
        localStorage.setItem('vzeeUsername', existingUsername);
      }
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleUsernameComplete = (selectedUsername: string) => {
    setIsLoading(true);
    setLoadingMessage("Setting up your account...");
    
    // Save username to localStorage (legacy support)
    localStorage.setItem('vzeeUsername', selectedUsername);
    
    // Save username with email for persistence between sessions
    const user = getCurrentUser();
    if (user?.email) {
      storeUsernameWithEmail(user.email, selectedUsername);
    }
    
    // Also save to global username list for availability checking
    const allUsernames = JSON.parse(localStorage.getItem('vzeeAllUsernames') || '[]');
    if (!allUsernames.includes(selectedUsername)) {
      allUsernames.push(selectedUsername);
      localStorage.setItem('vzeeAllUsernames', JSON.stringify(allUsernames));
    }
    
    setTimeout(() => {
      setUsername(selectedUsername);
      setIsLoading(false);
    }, 1500);
  };
  
  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }
  
  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthentication} />;
  }
  
  if (!username) {
    return <UsernameSetup onComplete={handleUsernameComplete} />;
  }
  
  return <Dashboard username={username} />;
};

export default Index;
