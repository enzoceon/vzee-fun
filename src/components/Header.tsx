
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
                <SheetTitle className="text-premiumRed">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <nav className="flex flex-col gap-2">
                  <a 
                    href="/terms" 
                    className="text-lightGray hover:text-premiumRed transition-colors px-2 py-1.5 rounded-md hover:bg-gray-800/50"
                  >
                    Terms and Conditions
                  </a>
                  <a 
                    href="/privacy" 
                    className="text-lightGray hover:text-premiumRed transition-colors px-2 py-1.5 rounded-md hover:bg-gray-800/50"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/disclaimer" 
                    className="text-lightGray hover:text-premiumRed transition-colors px-2 py-1.5 rounded-md hover:bg-gray-800/50"
                  >
                    Disclaimer
                  </a>
                  <a 
                    href="/copyright" 
                    className="text-lightGray hover:text-premiumRed transition-colors px-2 py-1.5 rounded-md hover:bg-gray-800/50"
                  >
                    Copyright Policy
                  </a>
                </nav>
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
