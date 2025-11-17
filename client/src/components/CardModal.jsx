import { useState, useEffect } from "react";
import { getCard, updateCard, toggleLabel, deleteCard } from "../api/client";
import { X, Tag, Calendar, User, AlertCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PRIORITIES = [
  { value: "none", label: "None", color: "gray" },
  { value: "low", label: "Low", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
];

export default function CardModal({ cardId, boardLabels, onClose, onUpdate }) {
  const [card, setCard] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("none");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!cardId) return;
    getCard(cardId).then(({ data }) => {
      setCard(data); setTitle(data.title); setDesc(data.description || "");
      setPriority(data.priority); setDueDate(data.dueDate || "");
    }).catch(() => toast.error("failed to load card"));
  }, [cardId]);

  const save = async () => {
    setSaving(true);
    try {
      await updateCard(cardId, { title, description: desc, priority, dueDate: dueDate || null });
      toast.success("saved"); onUpdate?.();
    } catch { toast.error("failed"); }
    finally { setSaving(false); }
  };

  const handleToggleLabel = async (labelId) => {
    try { await toggleLabel(cardId, labelId); const { data } = await getCard(cardId); setCard(data); onUpdate?.(); }
    catch { toast.error("failed"); }
  };

  const handleDelete = async () => {
    if (!confirm("delete this card?")) return;
    try { await deleteCard(cardId); toast.success("deleted"); onClose(); onUpdate?.(); }
    catch { toast.error("failed"); }
  };

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <input value={title} onChange={e=>setTitle(e.target.value)} onBlur={save} className="text-lg font-bold flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 -ml-1"/>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
          </div>
          <p className="text-xs text-gray-400 mb-4">in <span className="font-medium">{card.Column?.name}</span></p>

          {/* Labels */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Tag className="w-3 h-3"/>Labels</h4>
            <div className="flex flex-wrap gap-1.5">
              {boardLabels?.map(l => {
                const active = card.Labels?.some(cl => cl.id === l.id);
                return <button key={l.id} onClick={() => handleToggleLabel(l.id)} className={`px-2 py-1 rounded text-xs font-medium transition ${active ? "text-white ring-2 ring-offset-1" : "text-gray-600 opacity-50 hover:opacity-100"}`} style={{ background: active ? l.color : l.color+"30", ringColor: l.color }}>{l.name}</button>;
              })}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>Priority</h4>
            <div className="flex gap-1.5">
              {PRIORITIES.map(p => <button key={p.value} onClick={() => { setPriority(p.value); }} className={`px-2.5 py-1 rounded text-xs ${priority===p.value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p.label}</button>)}
            </div>
          </div>

          {/* Due date */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/>Due date</h4>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Description</h4>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4} placeholder="add a description..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"/>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <button onClick={save} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">{saving?"saving...":"save"}</button>
            <button onClick={handleDelete} className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/>delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
