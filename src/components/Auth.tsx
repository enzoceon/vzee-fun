
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AuthProps {
  onAuthenticated: () => void;
}

const Auth = ({ onAuthenticated }: AuthProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    // Simulate Google authentication (in a real app, this would connect to Google)
    setTimeout(() => {
      setIsAuthenticating(false);
      onAuthenticated();
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-darkBlack text-white p-4 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-premiumRed">
        vzee.fun
      </h1>
      <p className="text-sm text-lightGray mb-10 opacity-70">
        Share audio with the world
      </p>
      
      <Button
        onClick={handleGoogleLogin}
        disabled={isAuthenticating}
        className="btn-premium flex items-center gap-2 min-w-[220px] justify-center"
      >
        {isAuthenticating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            Continue with Google <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default Auth;
