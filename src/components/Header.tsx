import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfilePanel from "./ProfilePanel";

interface HeaderProps {
  username: string;
}

const Header = ({ username }: HeaderProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 60) {
        setIsVisible(true);
        clearTimeout(timeout);
      } else if (!showPanel) {
        timeout = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [showPanel]);
  
  const toggleProfilePanel = () => {
    setShowPanel(!showPanel);
    // Keep header visible when panel is open
    setIsVisible(true);
  };

  return (
    <>
      <header 
        className={`hoverable-header ${isVisible || showPanel ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: isVisible || showPanel ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="text-lightGray">
            <Menu className="w-5 h-5" />
          </Button>
          
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
