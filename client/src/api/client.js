import axios from "axios";
const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(e);
  }
);

// auth
export const registerUser = (d) => api.post("/auth/register", d);
export const loginUser = (d) => api.post("/auth/login", d);
export const getMe = () => api.get("/auth/me");

// workspaces
export const getWorkspaces = () => api.get("/workspaces");
export const createWorkspace = (d) => api.post("/workspaces", d);
export const getWorkspace = (id) => api.get(`/workspaces/${id}`);
export const deleteWorkspace = (id) => api.delete(`/workspaces/${id}`);

// boards
export const getBoards = (wsId) => api.get(`/workspaces/${wsId}/boards`);
export const createBoard = (wsId, d) => api.post(`/workspaces/${wsId}/boards`, d);
export const getBoard = (wsId, bId) => api.get(`/workspaces/${wsId}/boards/${bId}`);
export const deleteBoard = (wsId, bId) => api.delete(`/workspaces/${wsId}/boards/${bId}`);

// columns
export const createColumn = (bId, d) => api.post(`/boards/${bId}/columns`, d);
export const updateColumn = (bId, cId, d) => api.put(`/boards/${bId}/columns/${cId}`, d);
export const reorderColumns = (bId, order) => api.put(`/boards/${bId}/columns`, { order });
export const deleteColumn = (bId, cId) => api.delete(`/boards/${bId}/columns/${cId}`);

// cards
export const createCard = (d) => api.post("/cards", d);
export const getCard = (id) => api.get(`/cards/${id}`);
export const updateCard = (id, d) => api.put(`/cards/${id}`, d);
export const moveCard = (id, d) => api.put(`/cards/${id}/move`, d);
export const toggleLabel = (cardId, labelId) => api.post(`/cards/${cardId}/labels/${labelId}`);
export const deleteCard = (id) => api.delete(`/cards/${id}`);

export default api;
