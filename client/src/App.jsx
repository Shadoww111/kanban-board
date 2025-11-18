import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workspaces from "./pages/Workspaces";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import BoardView from "./pages/BoardView";

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"/></div>;
  return (
    <>
      <Toaster position="top-right"/>
      <Routes>
        <Route path="/" element={user ? <Workspaces/> : <Navigate to="/login"/>}/>
        <Route path="/w/:wsId" element={user ? <WorkspaceDetail/> : <Navigate to="/login"/>}/>
        <Route path="/w/:wsId/b/:boardId" element={user ? <BoardView/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!user ? <Login/> : <Navigate to="/"/>}/>
        <Route path="/register" element={!user ? <Register/> : <Navigate to="/"/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </>
  );
}
export default App;
