
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CopyrightPage() {
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
      
      <h1 className="text-3xl font-bold mb-6 text-premiumRed">Copyright Policy</h1>
      
      <div className="max-w-2xl mx-auto space-y-6 text-lightGray text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">1. Copyright Ownership</h2>
          <p>
            Users retain copyright ownership of all audio content they upload to vzee.fun. 
            By uploading content, you grant vzee.fun a non-exclusive license to host and share your content.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">2. Copyright Infringement</h2>
          <p>
            vzee.fun respects the intellectual property rights of others and expects users to do the same. 
            Do not upload content for which you do not have the necessary rights or permissions.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">3. DMCA Compliance</h2>
          <p>
            If you believe your copyrighted work has been copied in a way that constitutes copyright 
            infringement, please submit a notification in accordance with the Digital Millennium Copyright Act (DMCA).
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">4. Counter Notice</h2>
          <p>
            If you believe your content was removed in error, you may submit a counter-notice. 
            Please include a detailed explanation of why you believe the content was removed in error.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">5. Repeat Infringers</h2>
          <p>
            vzee.fun maintains a policy of terminating the accounts of users who are found to be 
            repeat infringers of copyright.
          </p>
        </section>
      </div>
    </div>
  );
}
