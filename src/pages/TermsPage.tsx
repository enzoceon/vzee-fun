
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsPage() {
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
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Terms and Conditions</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
          <p>
            By using vzee.fun, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our service.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. Use License</h2>
          <p>
            vzee.fun grants you a personal, non-exclusive, non-transferable license to use 
            the service for personal and non-commercial purposes in accordance with these Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. User Obligations</h2>
          <p>
            Users are responsible for all content they upload to vzee.fun. You may not upload content 
            that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise 
            objectionable.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Service Modifications</h2>
          <p>
            vzee.fun reserves the right to modify or discontinue the service at any time, 
            with or without notice. We shall not be liable to you or any third party for any 
            modification, suspension, or discontinuation of the service.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Limitation of Liability</h2>
          <p>
            In no event shall vzee.fun be liable for any indirect, incidental, special, 
            consequential or punitive damages, including without limitation, loss of profits, 
            data, or use, arising out of or in connection with these Terms or the service.
          </p>
        </section>
      </div>
    </div>
  );
}
