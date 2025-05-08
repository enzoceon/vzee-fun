
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";
import googleAuth from "@/utils/googleAuth";

interface AuthProps {
  onAuthenticated: () => void;
}

const Auth = ({ onAuthenticated }: AuthProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  
  // Google client ID provided by the user
  const GOOGLE_CLIENT_ID = "763178151866-bft0v9p1q4vmekfg0btrc4c3isi58r0t.apps.googleusercontent.com";
  
  // Handle successful Google login
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsAuthenticating(true);
    
    try {
      // Get user info from Google token
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credentialResponse.access_token}`
      );
      
      // If we got an ID token instead of access token, we need to decode it manually
      if (credentialResponse.credential) {
        // Parse the JWT token payload (second part between dots)
        const payload = credentialResponse.credential.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        
        // Save user in our auth system
        googleAuth.setUser({
          name: decoded.name || 'User',
          email: decoded.email,
          picture: decoded.picture
        });
        
        onAuthenticated();
        toast({
          title: "Successfully signed in",
          description: `Welcome, ${decoded.given_name || 'User'}!`,
        });
      } else {
        // Handle case with access_token
        const data = await response.json();
        googleAuth.setUser({
          name: data.name || 'User',
          email: data.email,
          picture: data.picture
        });
        
        onAuthenticated();
        toast({
          title: "Successfully signed in",
          description: `Welcome, ${data.given_name || 'User'}!`,
        });
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "There was an error authenticating with Google.",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const handleGoogleLoginError = () => {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: "There was an error authenticating with Google.",
    });
    setIsAuthenticating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-darkBlack text-white p-4 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-premiumRed">
        vzee.fun
      </h1>
      <p className="text-sm text-lightGray mb-10 opacity-70 max-w-xs text-center">
        Upload your audio and get a unique link to share. Your audio will autoplay when someone visits your link.
      </p>
      
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          useOneTap
          theme="filled_black"
          text="continue_with"
          shape="pill"
          size="large"
          logo_alignment="left"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Auth;
