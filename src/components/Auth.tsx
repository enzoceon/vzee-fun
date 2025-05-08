
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";
import googleAuth from "@/utils/googleAuth";
import jwt_decode from "jwt-decode";

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
      // For credential response with ID token
      if (credentialResponse.credential) {
        // Parse the JWT token payload
        const decoded: any = jwt_decode(credentialResponse.credential);
        
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
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Invalid authentication response from Google.",
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
