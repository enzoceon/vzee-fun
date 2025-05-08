
import React from "react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: "home" | "audio";
  onTabChange: (tab: "home" | "audio") => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex justify-center w-full max-w-xs mx-auto mt-2 mb-3 px-4">
      <div className="bg-[#1a1a1a] rounded-full p-1 flex w-full">
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "flex-1 py-1 rounded-full text-center transition-colors text-sm",
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
            "flex-1 py-1 rounded-full text-center transition-colors text-sm",
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
