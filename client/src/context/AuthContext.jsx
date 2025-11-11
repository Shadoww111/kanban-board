import { createContext, useContext, useState, useEffect } from "react";
import { getMe, loginUser, registerUser } from "../api/client";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("token")) { setLoading(false); return; }
    getMe().then(({ data }) => setUser(data)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);
  const login = async (email, pw) => { const { data } = await loginUser({ email, password: pw }); localStorage.setItem("token", data.token); setUser(data.user); };
  const register = async (username, email, pw) => { const { data } = await registerUser({ username, email, password: pw }); localStorage.setItem("token", data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
};
