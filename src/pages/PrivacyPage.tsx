
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
            We collect information you provide directly to us when you register for an account,
            create or share content, and communicate with other users. This includes your username,
            email address, profile information, and any audio files you upload.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services,
            develop new features, and protect vzee.fun and our users.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Sharing Your Information</h2>
          <p>
            We do not share your personal information with companies, organizations, or individuals
            outside of vzee.fun except in the following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>With your consent</li>
            <li>For legal reasons</li>
            <li>To protect the rights, property or safety of vzee.fun, our users or the public</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Data Security</h2>
          <p>
            We work hard to protect our users from unauthorized access to or unauthorized alteration,
            disclosure or destruction of information we hold.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Contact Us</h2>
          <p>
           If you have any questions about these Terms, please contact us at - hello@vzee.fun
          </p>
        </section>
      </div>
    </div>
  );
}
