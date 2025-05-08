
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-darkBlack text-white p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-premiumRed">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-lightGray mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-premiumRed hover:bg-premiumRed/90 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
