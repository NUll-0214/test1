import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Edit3, Trash2, X } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    if (trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    }

    setIsEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className="mt-1 flex h-7 w-7 items-center justify-center rounded-2xl border-2 transition focus:outline-none focus:ring-2 focus:ring-toss-blue"
          aria-label={todo.completed ? '미완료 처리' : '완료 처리'}
        >
          {todo.completed ? (
            <CheckCircle2 className="text-toss-blue" size={18} />
          ) : (
            <span className="h-3.5 w-3.5 rounded-full bg-transparent" />
          )}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSave();
              if (event.key === 'Escape') setIsEditing(false);
            }}
            className="w-full rounded-3xl border border-[#D8DEE6] bg-[#F8FAFC] px-4 py-3 text-sm text-[#191F28] outline-none transition focus:border-toss-blue focus:ring-2 focus:ring-[#3182F61A]/20"
          />
        ) : (
          <p
            className={`min-w-0 text-sm font-medium transition duration-200 ${
              todo.completed
                ? 'text-slate-500 line-through opacity-70'
                : 'text-[#191F28]'
            }`}
          >
            {todo.text}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <> 
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-2xl bg-toss-blue px-3 py-2 text-white transition hover:bg-[#1f67d9]"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditText(todo.text);
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2 text-[#64748B] transition hover:border-toss-blue hover:text-toss-blue"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-[#64748B] transition hover:border-toss-blue hover:text-toss-blue"
              aria-label="Edit todo"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label="Delete todo"
              className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-[#64748B] transition hover:border-toss-blue hover:text-toss-blue"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </motion.li>
  );
}
