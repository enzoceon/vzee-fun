
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import googleAuth from "@/utils/googleAuth";
import { createClient } from '@supabase/supabase-js';

interface AuthProps {
  onAuthenticated: () => void;
}

const Auth = ({ onAuthenticated }: AuthProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  
  // Supabase client configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Will redirect to Google sign in page
        console.log("Redirecting to Google...");
      }
      
    } catch (error) {
      console.error("Google authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "There was an error authenticating with Google.",
      });
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-darkBlack text-white p-4 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-premiumRed">
        vzee.fun
      </h1>
      <p className="text-sm text-lightGray mb-10 opacity-70 max-w-xs text-center">
        Upload your audio and get a unique link to share. Your audio will autoplay when someone visits your link.
      </p>
      
      <Button
        onClick={handleGoogleSignIn}
        disabled={isAuthenticating}
        className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-full flex items-center space-x-2"
      >
        {isAuthenticating ? (
          <span className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-gray-500 border-t-white rounded-full"></div>
            <span>Authenticating...</span>
          </span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default Auth;
