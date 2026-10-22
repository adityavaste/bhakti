import React from "react";
import { Sparkles } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="bg-gradient-to-r from-amber-700 via-rose-900 to-amber-800 text-amber-50 text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2">
      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse hidden sm:inline" />
      <span>
        🕉️ Bhakti connects you directly to official temple trusts and verified
        live sanctums across India.
      </span>
    </div>
  );
};

export default TopBar;