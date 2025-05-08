
import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import UsernameSetup from "@/components/UsernameSetup";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import googleAuth from "@/utils/googleAuth";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const user = googleAuth.getUser();
    if (user) {
      setIsAuthenticated(true);
      
      // Check if user has a username (in a real app this would be fetched from backend)
      const savedUsername = localStorage.getItem('vzee_username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }
    
    // Simulating network request
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
    
    // Store username in localStorage
    localStorage.setItem('vzee_username', selectedUsername);
    
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
