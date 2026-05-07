import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, RefreshCcw, Search, Trash2 } from 'lucide-react';
import TodoItem from './components/TodoItem';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://webtest1-bu0d.onrender.com';

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '활성', value: 'active' },
  { label: '완료', value: 'completed' }
];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const fetchTodos = async (search = searchTerm) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({ status: filter });
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`${API_BASE}/todos?${params}`);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setError('할 일 목록을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/todos/stats`);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.warn('Stats fetch failed.');
    }
  };

  const createTodo = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
      });

      if (!response.ok) throw new Error();

      setText('');
      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError('새 할 일을 추가하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createTodo();
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchTodos(searchTerm);
  };

  const handleToggle = async (id) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error();

      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError('상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) throw new Error();

      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError('삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, updatedText) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedText })
      });

      if (!response.ok) throw new Error();

      await fetchTodos();
    } catch (err) {
      setError('수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/todos?completed=true`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) throw new Error();

      await fetchTodos();
      await fetchStats();
    } catch (err) {
      setError('완료된 항목 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCountLabel = useMemo(() => {
    if (filter === 'active') return `${todos.length} 활성 항목`;
    if (filter === 'completed') return `${todos.length} 완료 항목`;
    return `${todos.length} 전체 항목`;
  }, [filter, todos.length]);

  return (
    <div className="min-h-screen bg-[#F2F4F6] px-4 py-10 text-[#191F28]">
      <div className="mx-auto w-full max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[2rem] bg-white/90 px-6 py-8 shadow-soft backdrop-blur-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#4E5968]">
            Modern Checklist
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#191F28] sm:text-4xl">
            깔끔하고 부드러운 할 일 관리
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4E5968] sm:text-base">
            Toss 스타일의 심플하고 신뢰감 있는 체크리스트입니다. 검색, 필터, 편집, 완료 항목 삭제가 가능합니다.
          </p>
        </motion.header>

        <section className="mb-6 rounded-[2rem] bg-white px-5 py-6 shadow-soft sm:px-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="todo-input" className="sr-only">
              새 할 일 입력
            </label>
            <input
              id="todo-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘의 할 일을 입력하세요"
              className="flex-1 rounded-3xl border border-transparent bg-[#F8FAFC] px-5 py-4 text-base text-[#191F28] outline-none transition focus:border-toss-blue focus:ring-4 focus:ring-[#3182F61A]"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-toss-blue px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1f67d9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} /> 추가
            </button>
          </form>

          <form onSubmit={handleSearch} className="mt-4 flex gap-3">
            <label htmlFor="search-input" className="sr-only">
              검색
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-3xl bg-[#F8FAFC] px-4 py-3">
              <Search size={18} className="text-[#94A3B8]" />
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="할 일 검색"
                className="w-full bg-transparent text-sm text-[#191F28] outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-3xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#4E5968] transition hover:border-toss-blue hover:text-toss-blue"
            >
              검색
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === option.value
                      ? 'bg-toss-blue text-white shadow-soft'
                      : 'bg-[#F8FAFC] text-[#4E5968] hover:bg-[#E8F0FF]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleClearCompleted}
              disabled={stats.completed === 0 || loading}
              className="inline-flex items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#4E5968] transition hover:border-toss-blue hover:text-toss-blue disabled:cursor-not-allowed disabled:opacity-60"
            >
              완료된 항목 삭제
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-3xl bg-[#F8FAFC] p-4 text-sm text-[#4E5968] sm:flex-row sm:justify-between">
            <span>전체 {stats.total}개</span>
            <span>활성 {stats.active}개</span>
            <span>완료 {stats.completed}개</span>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-3xl border border-[#F87171] bg-[#FEF2F2] px-5 py-4 text-sm text-[#B91C1C] shadow-soft">
            {error}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] bg-white px-4 py-5 shadow-soft sm:px-6"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">체크리스트</h2>
              <p className="text-sm text-[#4E5968]">완료된 항목과 남은 할 일을 한눈에 확인하세요.</p>
            </div>
            <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-sm font-medium text-[#3182F6]">
              {filteredCountLabel}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {todos.length > 0 ? (
              <motion.ul className="space-y-3">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-12 text-center text-sm text-[#4E5968]"
              >
                현재 등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}
