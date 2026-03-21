import { useState, useEffect } from 'react';

const THEMES = [
  { key: 'system', icon: '💻', label: 'Системна' },
  { key: 'light', icon: '☀️', label: 'Світла' },
  { key: 'dark', icon: '🌙', label: 'Темна' },
];

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wishlist-theme') || 'system';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('wishlist-theme', theme);
  }, [theme]);

  // Apply saved theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const cycle = () => {
    const idx = THEMES.findIndex(t => t.key === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.key);
  };

  const current = THEMES.find(t => t.key === theme);

  return (
    <button
      className="theme-toggle"
      onClick={cycle}
      title={`Тема: ${current.label}`}
    >
      {current.icon}
    </button>
  );
}
