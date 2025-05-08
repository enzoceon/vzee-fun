
import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import UsernameSetup from "@/components/UsernameSetup";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import { getCurrentUser, isAuthenticated as checkIsAuthenticated } from "@/lib/googleAuth";

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
        
        // Check for saved username in localStorage
        const savedUsername = localStorage.getItem('vzeeUsername');
        if (savedUsername) {
          setUsername(savedUsername);
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
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleUsernameComplete = (selectedUsername: string) => {
    setIsLoading(true);
    setLoadingMessage("Setting up your account...");
    
    // Save username to localStorage
    localStorage.setItem('vzeeUsername', selectedUsername);
    
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
