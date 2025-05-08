
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/googleAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, UserCheck, ShieldCheck, Headphones, Globe } from "lucide-react";

interface AuthProps {
  onAuthenticated: () => void;
}

const ImprovedAuth = ({ onAuthenticated }: AuthProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    document.title = "Sign In - vzee.fun";
    
    // Initialize Google Sign-In
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Remove script on unmount if needed
      document.body.removeChild(script);
    };
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Sign in successful",
        description: "Welcome back to vzee.fun!",
      });
      onAuthenticated();
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Headphones className="w-8 h-8 text-premiumRed" />,
      title: "Share Audio",
      description: "Upload and share your audio clips with friends and followers"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-premiumRed" />,
      title: "Create Profile",
      description: "Build your personal profile with a custom username"
    },
    {
      icon: <Globe className="w-8 h-8 text-premiumRed" />,
      title: "Global Access",
      description: "Access your content from anywhere in the world"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-premiumRed" />,
      title: "Secure Platform",
      description: "Your data is protected with the latest security"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-darkBlack text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-premiumRed font-bold text-2xl text-center">
            vzee.fun
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Auth */}
            <div className="bg-black/30 p-6 md:p-10 rounded-lg border border-gray-800 flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Sign In to <span className="text-premiumRed">vzee.fun</span>
              </h2>
              
              <p className="text-lightGray text-center mb-8">
                Share your voice with the world through audio clips and build your personal profile
              </p>
              
              <div className="w-full max-w-xs">
                <Button
                  className="w-full bg-premiumRed hover:bg-premiumRed/90 py-6 text-lg"
                  onClick={handleSignIn}
                  disabled={isLoading || !scriptLoaded}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in with Google <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-8 text-xs text-gray-400 text-center">
                By signing in, you agree to our{" "}
                <a href="/terms" className="text-premiumRed hover:underline">Terms and Conditions</a> and{" "}
                <a href="/privacy" className="text-premiumRed hover:underline">Privacy Policy</a>
              </div>
            </div>
            
            {/* Right Side - Features */}
            <div className="space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-2xl font-bold">Platform Features</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-black/20 p-4 rounded-lg border border-gray-800 hover:border-premiumRed/50 transition-all duration-300">
                    <div className="mb-3">{feature.icon}</div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} vzee.fun. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-premiumRed">Terms</a>
            <a href="/privacy" className="hover:text-premiumRed">Privacy</a>
            <a href="/contact" className="hover:text-premiumRed">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImprovedAuth;
