
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CookiePolicyPage() {
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
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Cookie Policy</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website.
            They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. How We Use Cookies</h2>
          <p>
            vzee.fun uses cookies to provide necessary website functionality, improve user experience and analyze website traffic.
            We may use both session cookies, which expire when you close your browser, and persistent cookies, which stay on your
            device until you delete them or they expire.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential cookies:</strong> These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in.
            </li>
            <li>
              <strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources, so we can measure and improve the performance of our site.
            </li>
            <li>
              <strong>Functional cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Your Choices Regarding Cookies</h2>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            If you disable or refuse cookies, please note that some parts of this website may not function properly.
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
