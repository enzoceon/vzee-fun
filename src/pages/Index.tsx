
import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import UsernameSetup from "@/components/UsernameSetup";
import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import googleAuth from "@/utils/googleAuth";
import { createClient } from '@supabase/supabase-js';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  
  // Supabase client configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Save user in our auth system
          googleAuth.setUser({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            picture: user.user_metadata?.avatar_url
          });
          
          setIsAuthenticated(true);
          
          // Check if user has a username
          const savedUsername = localStorage.getItem('vzee_username');
          if (savedUsername) {
            setUsername(savedUsername);
          }
        }
      }
      
      // Also check URL for OAuth response
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        // Remove hash from URL to prevent issues on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Save user in our auth system
            googleAuth.setUser({
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              picture: user.user_metadata?.avatar_url
            });
            
            setIsAuthenticated(true);
            
            // Check if user has a username
            const savedUsername = localStorage.getItem('vzee_username');
            if (savedUsername) {
              setUsername(savedUsername);
            } else {
              setLoadingMessage("Setting up your account...");
            }
          }
        } else if (event === 'SIGNED_OUT') {
          googleAuth.signOut();
          setIsAuthenticated(false);
          setUsername(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
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
