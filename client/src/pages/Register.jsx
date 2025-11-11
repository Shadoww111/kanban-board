import { useState } from "react"; import { Link, useNavigate } from "react-router-dom"; import { useAuth } from "../context/AuthContext"; import toast from "react-hot-toast"; import { Columns3 } from "lucide-react";
export default function Register() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false);
  const { register } = useAuth(); const nav = useNavigate();
  const go = async (e) => { e.preventDefault(); setBusy(true); try { await register(name, email, pw); nav("/"); } catch (err) { toast.error(err.response?.data?.msg || "failed"); } finally { setBusy(false); } };
  return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4"><div className="max-w-sm w-full">
    <div className="text-center mb-8"><Columns3 className="w-10 h-10 text-white mx-auto mb-2"/><h1 className="text-2xl font-bold text-white">Kanban</h1></div>
    <form onSubmit={go} className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
      <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="username" required minLength={3} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="password" required minLength={6} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
      <button disabled={busy} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">{busy?"...":"create account"}</button>
    </form>
    <p className="text-center text-sm text-white/80 mt-4">have account? <Link to="/login" className="text-white font-medium hover:underline">sign in</Link></p>
  </div></div>);
}
