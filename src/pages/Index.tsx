
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      console.log("Is authenticated:", authenticated);
      
      if (authenticated) {
        setIsAuthenticated(true);
        
        // Get current user details
        const user = getCurrentUser();
        console.log("Current user:", user);
        
        if (user?.email) {
          try {
            // First try to get username from Supabase by user's display name
            console.log("Checking for username in Supabase with display_name:", user.name);
            const { data: profileByName, error: nameError } = await supabase
              .from('user_profiles')
              .select('username')
              .eq('display_name', user.name)
              .maybeSingle();
              
            console.log("Supabase profile lookup by name result:", { profileByName, nameError });
              
            if (profileByName?.username) {
              console.log("Found username in Supabase by display_name:", profileByName.username);
              setUsername(profileByName.username);
              storeUsernameWithEmail(user.email, profileByName.username);
              localStorage.setItem('vzeeUsername', profileByName.username);
            } else {
              // Try with email check in local storage
              console.log("Checking for username mapped to email:", user.email);
              const userUsername = getUsernameByEmail(user.email);
              console.log("Username from email mapping:", userUsername);
              
              if (userUsername) {
                console.log("Using username from email mapping:", userUsername);
                setUsername(userUsername);
                localStorage.setItem('vzeeUsername', userUsername);
                
                // Check if already in Supabase
                const { data: existingProfile, error: checkError } = await supabase
                  .from('user_profiles')
                  .select('username')
                  .eq('username', userUsername)
                  .maybeSingle();
                
                // If not in Supabase, save to Supabase for future use
                if (!existingProfile && (!checkError || checkError.code === 'PGRST116')) {
                  console.log("Saving username to Supabase:", userUsername);
                  const { error: saveError } = await supabase
                    .from('user_profiles')
                    .insert({
                      username: userUsername,
                      display_name: user.name,
                      picture_url: user.picture
                    });
                    
                  if (saveError) {
                    console.error("Error saving profile to Supabase:", saveError);
                  } else {
                    console.log("Profile saved to Supabase successfully");
                  }
                }
              } else {
                // Fall back to localStorage
                console.log("Checking for fallback in localStorage");
                const savedUsername = localStorage.getItem('vzeeUsername');
                console.log("Username from localStorage:", savedUsername);
                
                if (savedUsername) {
                  console.log("Using username from localStorage:", savedUsername);
                  setUsername(savedUsername);
                  storeUsernameWithEmail(user.email, savedUsername);
                  
                  // Check if already in Supabase
                  const { data: existingProfile, error: checkError } = await supabase
                    .from('user_profiles')
                    .select('username')
                    .eq('username', savedUsername)
                    .maybeSingle();
                  
                  // If not in Supabase, save to Supabase for future use
                  if (!existingProfile && (!checkError || checkError.code === 'PGRST116')) {
                    console.log("Saving username from localStorage to Supabase:", savedUsername);
                    const { error: saveError } = await supabase
                      .from('user_profiles')
                      .insert({
                        username: savedUsername,
                        display_name: user.name,
                        picture_url: user.picture
                      });
                      
                    if (saveError) {
                      console.error("Error saving profile to Supabase:", saveError);
                    } else {
                      console.log("Profile saved to Supabase successfully");
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error checking for username:", error);
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
      const checkUsername = async () => {
        try {
          // First check in Supabase
          const { data, error } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('display_name', user.name)
            .maybeSingle();
            
          if (data && !error) {
            setUsername(data.username);
            // Also save to localStorage for legacy support
            localStorage.setItem('vzeeUsername', data.username);
            // And store the email-username mapping
            storeUsernameWithEmail(user.email, data.username);
            setIsLoading(false);
            return;
          }
          
          // If not in Supabase, check for username mapped to email
          const existingUsername = getUsernameByEmail(user.email);
          if (existingUsername) {
            setUsername(existingUsername);
            // Also ensure it's saved to localStorage for legacy support
            localStorage.setItem('vzeeUsername', existingUsername);
            
            // Try to save to Supabase for future use
            await supabase
              .from('user_profiles')
              .upsert({
                username: existingUsername,
                display_name: user.name,
                picture_url: user.picture
              })
              .then(({ error }) => {
                if (error) console.error("Error saving profile to Supabase:", error);
              });
          }
        } catch (error) {
          console.error("Error checking for username:", error);
        }
        
        setIsLoading(false);
      };
      
      checkUsername();
    } else {
      // If no user email, just stop loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };
  
  const handleUsernameComplete = async (selectedUsername: string) => {
    setIsLoading(true);
    setLoadingMessage("Setting up your account...");
    
    // Save username to localStorage (legacy support)
    localStorage.setItem('vzeeUsername', selectedUsername);
    
    // Save username with email for persistence between sessions
    const user = getCurrentUser();
    if (user?.email) {
      // Store locally first for quick access
      storeUsernameWithEmail(user.email, selectedUsername);
      
      // Save to Supabase for persistence
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            username: selectedUsername,
            display_name: user.name,
            picture_url: user.picture
          });
          
        if (error) {
          console.error("Error saving profile to Supabase:", error);
          toast.error("Failed to save your profile. Please try again.");
        }
      } catch (error) {
        console.error("Error in profile creation:", error);
      }
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
