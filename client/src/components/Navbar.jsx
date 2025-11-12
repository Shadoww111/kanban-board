import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Columns3, LogOut, Home, ChevronRight } from "lucide-react";
export default function Navbar({ breadcrumbs = [] }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-indigo-600"><Columns3 className="w-5 h-5"/>Kanban</Link>
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1 text-sm text-gray-500">
              <ChevronRight className="w-3.5 h-3.5"/>
              {bc.to ? <Link to={bc.to} className="hover:text-gray-700">{bc.label}</Link> : <span className="text-gray-700 font-medium">{bc.label}</span>}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.avatar} {user?.username}</span>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition"><LogOut className="w-4 h-4"/></button>
        </div>
      </div>
    </nav>
  );
}
