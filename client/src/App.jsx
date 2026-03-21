import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import WishesPage from './pages/WishesPage';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <a href="/">WishList</a>
          <ThemeToggle />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events/:id" element={<WishesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
