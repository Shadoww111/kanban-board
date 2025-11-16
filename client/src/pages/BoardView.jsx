import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { getBoard, createCard, moveCard, createColumn, deleteColumn } from "../api/client";
import KanbanCard from "../components/KanbanCard";
import Navbar from "../components/Navbar";
import { Plus, X, Loader2, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

export default function BoardView() {
  const { wsId, boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [addingCard, setAddingCard] = useState(null); // columnId
  const [newCardTitle, setNewCardTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const load = useCallback(async () => {
    try { const { data } = await getBoard(wsId, boardId); setBoard(data); }
    catch { toast.error("failed to load"); }
    finally { setLoading(false); }
  }, [wsId, boardId]);

  useEffect(() => { load(); }, [load]);

  const handleDragEnd = async (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    // optimistic update
    const newBoard = JSON.parse(JSON.stringify(board));
    const srcCol = newBoard.Columns.find(c => String(c.id) === source.droppableId);
    const dstCol = newBoard.Columns.find(c => String(c.id) === destination.droppableId);
    if (!srcCol || !dstCol) return;
    const [moved] = srcCol.Cards.splice(source.index, 1);
    dstCol.Cards.splice(destination.index, 0, moved);
    setBoard(newBoard);
    try { await moveCard(draggableId, { columnId: parseInt(destination.droppableId), position: destination.index }); }
    catch { load(); }
  };

  const handleAddCard = async (colId) => {
    if (!newCardTitle.trim()) return;
    try { await createCard({ title: newCardTitle.trim(), columnId: colId }); setNewCardTitle(""); setAddingCard(null); load(); }
    catch { toast.error("failed"); }
  };

  const handleAddCol = async () => {
    if (!newColName.trim()) return;
    try { await createColumn(boardId, { name: newColName.trim() }); setNewColName(""); setAddingCol(false); load(); }
    catch { toast.error("failed"); }
  };

  if (loading) return <div className="min-h-screen"><Navbar/><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-500"/></div></div>;
  if (!board) return <div className="min-h-screen"><Navbar/><p className="text-center py-20 text-gray-400">board not found</p></div>;

  return (
    <div className="min-h-screen" style={{ background: board.background }}>
      <Navbar breadcrumbs={[{ label: "Workspaces", to: "/" }, { label: board.name }]}/>
      <div className="p-4 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 items-start">
            {board.Columns?.sort((a,b)=>a.position-b.position).map(col => (
              <div key={col.id} className="bg-gray-100 rounded-xl p-3 w-72 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-700">{col.name} <span className="text-gray-400 font-normal">({col.Cards?.length || 0})</span></h3>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4"/></button>
                </div>
                <Droppable droppableId={String(col.id)}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-col min-h-[50px]">
                      {col.Cards?.sort((a,b)=>a.position-b.position).map((card, i) => (
                        <KanbanCard key={card.id} card={card} index={i} onClick={setSelectedCard}/>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {addingCard === col.id ? (
                  <div className="mt-2">
                    <textarea value={newCardTitle} onChange={e=>setNewCardTitle(e.target.value)} placeholder="card title..." rows={2} autoFocus
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddCard(col.id); } }}/>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleAddCard(col.id)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs">add</button>
                      <button onClick={() => { setAddingCard(null); setNewCardTitle(""); }} className="text-gray-400 text-xs">cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingCard(col.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2 w-full px-2 py-1 rounded hover:bg-gray-200 transition">
                    <Plus className="w-4 h-4"/> add card
                  </button>
                )}
              </div>
            ))}
            {addingCol ? (
              <div className="bg-gray-100 rounded-xl p-3 w-72 flex-shrink-0">
                <input value={newColName} onChange={e=>setNewColName(e.target.value)} placeholder="column name" autoFocus
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  onKeyDown={e => { if (e.key === "Enter") handleAddCol(); }}/>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleAddCol} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs">add</button>
                  <button onClick={() => setAddingCol(false)} className="text-gray-400 text-xs">cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingCol(true)} className="bg-white/30 backdrop-blur rounded-xl p-3 w-72 flex-shrink-0 text-white/80 hover:bg-white/40 transition flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4"/> add column
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
