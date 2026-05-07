const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;

// In-memory storage for todos.
let todos = [
  {
    id: 1,
    text: 'Modern Checklist App 시작하기',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    text: 'UI/UX 디자인 스타일 적용',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const filterTodos = ({ status, search }) => {
  let filtered = [...todos];

  if (status === 'active') {
    filtered = filtered.filter((item) => !item.completed);
  }

  if (status === 'completed') {
    filtered = filtered.filter((item) => item.completed);
  }

  if (search) {
    const normalized = search.toString().trim().toLowerCase();
    filtered = filtered.filter((item) => item.text.toLowerCase().includes(normalized));
  }

  return filtered;
};

const getStats = () => ({
  total: todos.length,
  completed: todos.filter((item) => item.completed).length,
  active: todos.filter((item) => !item.completed).length
});

app.get('/todos', (req, res) => {
  const { status = 'all', search = '' } = req.query;
  const filtered = filterTodos({ status, search });
  res.json({ todos: filtered });
});

app.get('/todos/stats', (req, res) => {
  res.json({ stats: getStats() });
});

app.post('/todos', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '텍스트는 필수이며 문자열이어야 합니다.' });
  }

  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos = [newTodo, ...todos];
  res.status(201).json({ todo: newTodo });
});

app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
  }

  const { text, completed } = req.body;

  if (text !== undefined && typeof text !== 'string') {
    return res.status(400).json({ error: '텍스트는 문자열이어야 합니다.' });
  }

  const updatedTodo = {
    ...todo,
    text: text !== undefined ? text.trim() : todo.text,
    completed: completed !== undefined ? Boolean(completed) : !todo.completed
  };

  todos = todos.map((item) => (item.id === id ? updatedTodo : item));
  res.json({ todo: updatedTodo });
});

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = todos.some((item) => item.id === id);

  if (!exists) {
    return res.status(404).json({ error: '삭제할 할 일을 찾을 수 없습니다.' });
  }

  todos = todos.filter((item) => item.id !== id);
  res.status(204).send();
});

app.delete('/todos', (req, res) => {
  const { completed } = req.query;

  if (completed === 'true') {
    todos = todos.filter((item) => !item.completed);
    return res.status(204).send();
  }

  res.status(400).json({ error: '유효한 쿼리를 전달해주세요. completed=true 를 사용하세요.' });
});

app.get('/', (req, res) => {
  res.send({ status: 'Modern Checklist API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
