
import React from "react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: "home" | "audio";
  onTabChange: (tab: "home" | "audio") => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex justify-center w-full max-w-xl mx-auto mt-4 mb-6 px-4">
      <div className="bg-[#1a1a1a] rounded-full p-2 flex w-full">
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "flex-1 py-3 rounded-full text-center transition-colors text-base font-medium",
            activeTab === "home"
              ? "bg-white text-black"
              : "text-white/80 hover:text-white"
          )}
        >
          Home
        </button>
        <button
          onClick={() => onTabChange("audio")}
          className={cn(
            "flex-1 py-3 rounded-full text-center transition-colors text-base font-medium",
            activeTab === "audio"
              ? "bg-white text-black"
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
