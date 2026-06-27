import React, { useState, useEffect } from 'react';
import './App.css';

const translations = {
  ru: {
    title: 'ToDo React Project',
    placeholder: 'Что нужно сделать?',
    addButton: 'Добавить',
    noTasks: 'Нет задач.',
    footer: 'Проект 2026',
    added: 'Добавлено:',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    langRu: 'Ru',
    langEn: 'Eng',
    integration: 'Окно интеграции',
    total: 'Всего',
    completed: 'Выполнено',
    remaining: 'Осталось',
    clearCompleted: 'Очистить выполненные',
  },
  en: {
    title: 'ToDo React Project',
    placeholder: 'What needs to be done?',
    addButton: 'Add',
    noTasks: 'No tasks.',
    footer: 'Project 2026',
    added: 'Added:',
    themeLight: 'Light',
    themeDark: 'Dark',
    langRu: 'Ru',
    langEn: 'Eng',
    integration: 'Integration Window',
    total: 'Total',
    completed: 'Completed',
    remaining: 'Remaining',
    clearCompleted: 'Clear completed',
  }
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || 'ru');
  const t = translations[locale];

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      createdAt: new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLocale = () => {
    setLocale(locale === 'ru' ? 'en' : 'ru');
  };

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t.title}</h1>
        <div className="header-controls">
          <button className="lang-btn" onClick={toggleLocale}>
            {locale === 'ru' ? t.langEn : t.langRu}
          </button>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? t.themeDark : t.themeLight}
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="left-panel">
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button onClick={addTask}>{t.addButton}</button>
          </div>

          <div className="stats-window">
            <div className="stats-row">
              <span>{t.total}: <strong>{total}</strong></span>
              <span>{t.completed}: <strong>{completed}</strong></span>
              <span>{t.remaining}: <strong>{remaining}</strong></span>
            </div>
            <button
              className={`clear-btn ${completed === 0 ? 'disabled' : ''}`}
              onClick={clearCompleted}
              disabled={completed === 0}
            >
              {t.clearCompleted}
            </button>
          </div>

          <div className="integration-window">
            <p>{t.integration}</p>
          </div>
        </aside>

        <section className="task-section">
          <ul className="task-list">
            {tasks.length === 0 && <li className="empty-message">{t.noTasks}</li>}
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <div className="task-content">
                  <button
                    className="task-text"
                    onClick={() => toggleTask(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && toggleTask(task.id)}
                    tabIndex="0"
                  >
                    {task.text}
                  </button>
                  <span className="task-date">{t.added} {task.createdAt}</span>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default App;