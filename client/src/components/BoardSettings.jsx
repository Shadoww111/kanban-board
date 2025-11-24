import { useState } from "react";
import { X, Palette, Trash2 } from "lucide-react";

const BG_OPTIONS = ["#6366f1", "#ec4899", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6", "#0ea5e9", "#d946ef"];
const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];

export default function BoardSettings({ board, onUpdate, onDelete, onClose }) {
  const [name, setName] = useState(board?.name || "");
  const [desc, setDesc] = useState(board?.description || "");
  const [bg, setBg] = useState(board?.background || BG_OPTIONS[0]);

  const save = () => { onUpdate({ name, description: desc, background: bg }); };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Board Settings</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Description</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Palette className="w-3 h-3"/>Background</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {BG_OPTIONS.map(c => <button key={c} onClick={()=>setBg(c)} className={`w-8 h-8 rounded-lg ${bg===c?"ring-2 ring-offset-2 ring-indigo-500":""}`} style={{background:c}}/>)}
              {GRADIENTS.map((g,i) => <button key={i} onClick={()=>setBg(g)} className={`w-8 h-8 rounded-lg ${bg===g?"ring-2 ring-offset-2 ring-indigo-500":""}`} style={{background:g}}/>)}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button onClick={onDelete} className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/>delete board</button>
          <button onClick={save} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">save</button>
        </div>
      </div>
    </div>
  );
}
