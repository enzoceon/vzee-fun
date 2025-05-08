
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, X, ChevronDown, ChevronRight, FileText, ShieldCheck, Cookie, HeartHandshake } from "lucide-react";
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
import { useNavigate, Link } from "react-router-dom";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [legalOpen, setLegalOpen] = useState(false);
  
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
                  {/* Legal Section with Support Us moved here */}
                  <Collapsible 
                    open={legalOpen} 
                    onOpenChange={setLegalOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Legal
                      </span>
                      {legalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <Link 
                        to="/terms" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Terms and Conditions
                      </Link>
                      <Link 
                        to="/privacy" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Privacy Policy
                      </Link>
                      <Link 
                        to="/disclaimer" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Disclaimer
                      </Link>
                      <Link 
                        to="/cookie-policy" 
                        className="block py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        Cookie Policy
                      </Link>
                      <a 
                        href="https://www.paypal.me/enzoceon" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                      >
                        <HeartHandshake className="h-4 w-4 mr-2" />
                        Support Us
                      </a>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {/* Contact link moved to top level */}
                  <Link 
                    to="/contact" 
                    className="flex items-center py-2 px-2 text-lightGray hover:text-premiumRed transition-colors rounded-md hover:bg-gray-800/50"
                  >
                    Contact Us
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-premiumRed font-bold text-xl">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              vzee.fun
            </Link>
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
