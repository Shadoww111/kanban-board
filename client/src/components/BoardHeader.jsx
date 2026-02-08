import { useState } from "react";
import { Settings, Users, Filter } from "lucide-react";
export default function BoardHeader({ board, onOpenSettings, memberCount }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/10 backdrop-blur">
      <h2 className="text-white font-bold text-lg drop-shadow">{board.name}</h2>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 text-white/80 text-sm hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"><Filter className="w-3.5 h-3.5"/>filter</button>
        <button className="flex items-center gap-1 text-white/80 text-sm hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"><Users className="w-3.5 h-3.5"/>{memberCount || 1}</button>
        <button onClick={onOpenSettings} className="text-white/80 hover:text-white bg-white/10 p-1.5 rounded-lg"><Settings className="w-4 h-4"/></button>
      </div>
    </div>
  );
}
