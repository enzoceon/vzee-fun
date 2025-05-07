
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
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
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Privacy Policy</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Information We Collect</h2>
          <p>
            When you use vzee.fun, we collect information that you provide directly to us, 
            such as your name, email address, and any audio content you upload.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            to process transactions, to send you related information, and to respond to your comments and questions.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this 
            privacy policy. We may share information with third-party vendors who provide services on our behalf.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Data Security</h2>
          <p>
            vzee.fun takes reasonable measures to help protect your personal information from loss, 
            theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. If we make significant changes, 
            we will notify you by email or by posting a notice on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
