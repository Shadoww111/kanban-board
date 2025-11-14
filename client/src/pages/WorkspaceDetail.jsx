import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getWorkspace, createBoard } from "../api/client";
import Navbar from "../components/Navbar";
import { Plus, LayoutGrid, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const BG_OPTIONS = ["#6366f1", "#ec4899", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6"];

export default function WorkspaceDetail() {
  const { wsId } = useParams();
  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardBg, setBoardBg] = useState(BG_OPTIONS[0]);

  const load = async () => { try { const { data } = await getWorkspace(wsId); setWs(data); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, [wsId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    try { await createBoard(wsId, { name: boardName.trim(), background: boardBg }); setBoardName(""); setShowNew(false); toast.success("board created"); load(); }
    catch { toast.error("failed"); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar/><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-500"/></div></div>;
  if (!ws) return <div className="min-h-screen bg-gray-50"><Navbar/><p className="text-center py-20 text-gray-400">workspace not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar breadcrumbs={[{ label: ws.name }]}/>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold">{ws.name}</h2>{ws.description && <p className="text-sm text-gray-500">{ws.description}</p>}</div>
          <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"><Plus className="w-4 h-4"/> new board</button>
        </div>
        {showNew && (
          <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl border mb-6 space-y-3">
            <input value={boardName} onChange={e=>setBoardName(e.target.value)} placeholder="board name" autoFocus className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            <div className="flex gap-2">{BG_OPTIONS.map(bg => <button key={bg} type="button" onClick={()=>setBoardBg(bg)} className={`w-8 h-8 rounded-lg ${boardBg===bg?"ring-2 ring-offset-2 ring-indigo-500":""}`} style={{background:bg}}/>)}</div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">create</button>
          </form>
        )}
        {ws.Boards?.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><LayoutGrid className="w-10 h-10 mx-auto mb-3 text-gray-300"/><p>no boards</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ws.Boards?.map(b => (
              <Link key={b.id} to={`/w/${wsId}/b/${b.id}`} className="rounded-xl p-4 h-24 flex items-end shadow-sm hover:shadow-md transition-shadow" style={{ background: b.background }}>
                <span className="text-white font-medium text-sm drop-shadow">{b.name}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
