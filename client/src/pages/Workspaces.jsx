import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWorkspaces, createWorkspace } from "../api/client";
import Navbar from "../components/Navbar";
import { Plus, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Workspaces() {
  const [workspaces, setWs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const load = async () => { try { const { data } = await getWorkspaces(); setWs(data); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try { await createWorkspace({ name: name.trim() }); setName(""); setCreating(false); toast.success("created"); load(); }
    catch (e) { toast.error(e.response?.data?.msg || "failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Workspaces</h2>
          <button onClick={() => setCreating(!creating)} className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4"/> new
          </button>
        </div>
        {creating && (
          <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl border mb-4 flex gap-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="workspace name" autoFocus className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">create</button>
          </form>
        )}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-500"/></div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300"/><p>no workspaces yet</p></div>
        ) : (
          <div className="grid gap-3">
            {workspaces.map(ws => (
              <Link key={ws.id} to={`/w/${ws.id}`} className="bg-white p-4 rounded-xl border hover:shadow-sm transition-shadow flex items-center justify-between group">
                <div><h3 className="font-medium">{ws.name}</h3>{ws.description && <p className="text-sm text-gray-500 mt-0.5">{ws.description}</p>}</div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition"/>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
