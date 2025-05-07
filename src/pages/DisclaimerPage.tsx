
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DisclaimerPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-darkBlack text-white p-4 md:p-8 animate-fade-in">
      <Button 
        variant="ghost" 
        className="text-lightGray mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Disclaimer</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. No Warranty</h2>
          <p>
            vzee.fun is provided "as is" without warranties of any kind, either express or implied. 
            We do not warrant that the service will be uninterrupted or error-free.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. User Content</h2>
          <p>
            vzee.fun does not claim ownership of the content you upload. However, we are not 
            responsible for the content, accuracy, or opinions expressed in user-uploaded content.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. External Links</h2>
          <p>
            Our service may contain links to external websites that are not operated by us. 
            We have no control over the content and practices of these sites and cannot accept 
            responsibility for their respective privacy policies.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Changes to Service</h2>
          <p>
            vzee.fun reserves the right to modify or discontinue the service with or without notice. 
            We shall not be liable to you or any third party for any modification, price change, 
            suspension, or discontinuance of the service.
          </p>
        </section>
      </div>
    </div>
  );
}
