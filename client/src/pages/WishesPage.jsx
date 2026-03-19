import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import WishForm from '../components/WishForm';
import WishItem from '../components/WishItem';

const POLL_INTERVAL = 5000; // 5 sec

export default function WishesPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const pollRef = useRef(null);

  const loadEvent = () => api.get(`/events/${id}`).then(r => setEvent(r.data));
  const loadWishes = () => api.get(`/events/${id}/wishes`).then(r => setWishes(r.data));

  useEffect(() => {
    loadEvent();
    loadWishes();

    // Auto-refresh
    pollRef.current = setInterval(loadWishes, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [id]);

  const handleAdd = async (data) => {
    await api.post(`/events/${id}/wishes`, data);
    setShowForm(false);
    loadWishes();
  };

  const handleReserve = async (wishId, name) => {
    try {
      await api.put(`/wishes/${wishId}/reserve`, { name });
    } catch (err) {
      if (err.response?.status === 409) {
        alert(`Це побажання вже зарезервовано: ${err.response.data.reserved_by}`);
      }
    }
    loadWishes();
  };

  const handleUnreserve = async (wishId) => {
    await api.put(`/wishes/${wishId}/unreserve`);
    loadWishes();
  };

  const handleDelete = async (wishId) => {
    if (!confirm('Видалити це побажання?')) return;
    await api.delete(`/wishes/${wishId}`);
    loadWishes();
  };

  if (!event) return null;

  return (
    <>
      <div className="wishes-header">
        <div>
          <Link to="/" className="back-btn">&larr; Назад</Link>
        </div>
        <h2>{event.emoji} {event.title}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Додати побажання
        </button>
      </div>

      {event.description && <p className="event-description">{event.description}</p>}

      {wishes.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">&#10024;</div>
          <p>Список побажань порожній. Додайте перше!</p>
        </div>
      ) : (
        <div className="wish-list">
          {wishes.map(w => (
            <WishItem
              key={w.id}
              wish={w}
              onReserve={handleReserve}
              onUnreserve={handleUnreserve}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <WishForm
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
