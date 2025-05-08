
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
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Terms and conditions</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using vzee.fun, you agree to be bound by these Terms and Conditions.
            If you do not agree to all the terms and conditions, you must not access or use our services.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for maintaining the security of your account and for all activities
            that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. User Content</h2>
          <p>
            You retain ownership of the content you upload to vzee.fun. By uploading content, you grant
            us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your
            content in connection with our services.
          </p>
          <p className="mt-2">
            You are solely responsible for the content you upload. Content that violates any applicable
            laws or regulations is strictly prohibited.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Prohibited Activities</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Use our services in any way that violates any applicable laws</li>
            <li>Impersonate any person or entity</li>
            <li>Upload harmful or malicious code</li>
            <li>Attempt to gain unauthorized access to our services</li>
            <li>Use our services to distribute unsolicited promotional content</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please <a href="/contact" className="text-premiumRed hover:underline">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
