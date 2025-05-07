
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfilePanel from "./ProfilePanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const { toast } = useToast();
  
  // Header is always visible now - removed visibility state
  
  const toggleProfilePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      <header className="sticky top-0 w-full bg-darkBlack border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-lightGray">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-darkBlack text-white border-r border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-premiumRed">Legal Information</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <section>
                  <h3 className="text-premiumRed font-semibold mb-2">Terms and Conditions</h3>
                  <p className="text-sm text-lightGray">
                    By using vzee.fun, you agree to these terms. We provide a platform for sharing audio content.
                    Users are responsible for the content they upload and share.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-premiumRed font-semibold mb-2">Privacy Policy</h3>
                  <p className="text-sm text-lightGray">
                    We collect minimal data necessary to provide our services.
                    Your uploaded audio is stored securely and shared only via the links you create.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-premiumRed font-semibold mb-2">Disclaimer</h3>
                  <p className="text-sm text-lightGray">
                    vzee.fun is not responsible for user-generated content.
                    We reserve the right to remove content that violates our policies.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-premiumRed font-semibold mb-2">Copyright Policy</h3>
                  <p className="text-sm text-lightGray">
                    Do not upload content you don't own rights to.
                    Report copyright violations to our team.
                  </p>
                </section>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-premiumRed font-bold text-xl">
            vzee.fun
          </h1>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-lightGray" 
            onClick={toggleProfilePanel}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>
      
      {showPanel && (
        <ProfilePanel 
          username={username} 
          onClose={() => setShowPanel(false)} 
        />
      )}
    </>
  );
};

export default Header;
