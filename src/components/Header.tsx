
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, X, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfilePanel from "./ProfilePanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [legalOpen, setLegalOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  
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
                <SheetTitle className="text-premiumRed">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <nav className="flex flex-col gap-2">
                  
                  {/* Support Section */}
                  <Collapsible 
                    open={supportOpen} 
                    onOpenChange={setSupportOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50">
                      <span>Support</span>
                      {supportOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <a 
                        href="/contact" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Contact Us
                      </a>
                      <a 
                        href="https://www.paypal.me/enzoceon" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Support Us
                      </a>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {/* Legal Section */}
                  <Collapsible 
                    open={legalOpen} 
                    onOpenChange={setLegalOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50">
                      <span>Legal</span>
                      {legalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <a 
                        href="/terms" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Terms and Conditions
                      </a>
                      <a 
                        href="/privacy" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Privacy Policy
                      </a>
                      <a 
                        href="/disclaimer" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Disclaimer
                      </a>
                      <a 
                        href="/cookie-policy" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Cookie Policy
                      </a>
                    </CollapsibleContent>
                  </Collapsible>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-premiumRed font-bold text-xl">
            <a href="/" className="hover:opacity-90 transition-opacity">
              vzee.fun
            </a>
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
