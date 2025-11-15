import { Draggable } from "@hello-pangea/dnd";
import { MessageSquare, Calendar, Tag } from "lucide-react";

const PRIORITY_COLORS = { none: "", low: "border-l-green-400", medium: "border-l-yellow-400", high: "border-l-orange-400", urgent: "border-l-red-500" };

export default function KanbanCard({ card, index, onClick }) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          onClick={() => onClick(card)}
          className={`bg-white rounded-lg border p-3 mb-2 cursor-pointer hover:shadow-sm transition-shadow border-l-4 ${PRIORITY_COLORS[card.priority] || "border-l-transparent"} ${snapshot.isDragging ? "shadow-lg rotate-2" : ""}`}>
          {card.Labels?.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {card.Labels.map(l => <span key={l.id} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{background:l.color}}>{l.name}</span>)}
            </div>
          )}
          <p className="text-sm font-medium text-gray-800">{card.title}</p>
          <div className="flex items-center gap-3 mt-2">
            {card.dueDate && (
              <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                <Calendar className="w-3 h-3"/>{new Date(card.dueDate).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </span>
            )}
            {card.assignee && <span className="text-[11px]">{card.assignee.avatar}</span>}
            {card.description && <MessageSquare className="w-3 h-3 text-gray-300"/>}
          </div>
        </div>
      )}
    </Draggable>
  );
}
