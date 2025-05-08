
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface TabNavigationProps {
  activeTab: "home" | "audio";
  onTabChange: (tab: "home" | "audio") => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex justify-center w-full max-w-md mx-auto mt-4 mb-8 px-4">
      <div className="bg-[#1a1a1a] rounded-full p-1 flex w-full">
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "flex-1 py-3 rounded-full text-center transition-colors",
            activeTab === "home"
              ? "bg-white text-black font-medium"
              : "text-white/80 hover:text-white"
          )}
        >
          Home
        </button>
        <button
          onClick={() => onTabChange("audio")}
          className={cn(
            "flex-1 py-3 rounded-full text-center transition-colors",
            activeTab === "audio"
              ? "bg-white text-black font-medium"
              : "text-white/80 hover:text-white"
          )}
        >
          Audio
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
