import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Trash2, Plus, LogOut, Sun, Moon, Download } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const { user, logout, apiRequest, darkMode, toggleDarkMode } = useAuth();

  // Fetch todos on mount
  useEffect(() => {
    apiRequest<{ todos: Todo[] }>('/todos')
      .then((res) => setTodos(res.todos))
      .catch((err) => console.error('Failed to fetch todos:', err));
  }, [apiRequest]);

  // Add a new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await apiRequest<any>('/todos', {
        method: 'POST',
        data: { title },
      });

      const newTodoItem = res.todo || res;

      if (newTodoItem && newTodoItem.id) {
        setTodos((prev) => [...prev, newTodoItem]);
        setTitle('');
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  // Toggle completion status
  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await apiRequest<any>(`/todos/${id}`, {
        method: 'PUT',
        data: { completed: !completed },
      });
      const updatedItem = res.todo || res;
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedItem : t)));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      await apiRequest(`/todos/${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  // Download all todos
  const downloadAllTodos = () => {
    if (todos.length === 0) {
      alert('No todos available to download!');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `all_todos_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download a single specific todo item
  const downloadSingleTodo = (todo: Todo) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todo, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `todo_${todo.id}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-text)' }}>
            Manage your daily tasks efficiently
          </p>
        </div>
        <div className="dashboard-actions">
          <button 
            onClick={downloadAllTodos} 
            className="btn-secondary" 
            type="button" 
            title="Download All Todos" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} /> Download All
          </button>

          <button onClick={toggleDarkMode} className="theme-toggle-btn" type="button" style={{ position: 'static' }}>
            {darkMode ? <Sun size={18} style={{ color: '#facc15' }} /> : <Moon size={18} />}
          </button>
          
          <button onClick={logout} className="btn-logout" type="button">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          className="input-field"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          <Plus size={18} /> Add
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="todo-title" onClick={() => toggleTodo(todo.id, todo.completed)} style={{ flex: 1, cursor: 'pointer' }}>
              {todo.completed ? (
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              ) : (
                <Circle size={20} style={{ color: 'var(--muted-text)' }} />
              )}
              <span className={todo.completed ? 'completed-text' : ''}>
                {todo.title}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Individual Todo Download Button */}
              <button 
                onClick={() => downloadSingleTodo(todo)} 
                className="btn-icon-secondary" 
                type="button"
                title="Download this task"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}
              >
                <Download size={16} />
              </button>

              <button onClick={() => deleteTodo(todo.id)} className="btn-icon-danger" type="button" title="Delete task">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
        {todos.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted-text)', padding: '30px 0' }}>
            No tasks yet. Add one above!
          </p>
        )}
      </ul>
    </div>
  );
};