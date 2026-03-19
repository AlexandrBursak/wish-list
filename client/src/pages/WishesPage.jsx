import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import WishForm from '../components/WishForm';
import WishItem from '../components/WishItem';

export default function WishesPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadEvent = () => api.get(`/events/${id}`).then(r => setEvent(r.data));
  const loadWishes = () => api.get(`/events/${id}/wishes`).then(r => setWishes(r.data));

  useEffect(() => {
    loadEvent();
    loadWishes();
  }, [id]);

  const handleAdd = async (data) => {
    await api.post(`/events/${id}/wishes`, data);
    setShowForm(false);
    loadWishes();
  };

  const handleReserve = async (wishId, name) => {
    await api.put(`/wishes/${wishId}/reserve`, { name });
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
          <Link to="/" className="back-btn">← Назад</Link>
        </div>
        <h2>{event.emoji} {event.title}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Додати побажання
        </button>
      </div>

      {event.description && <p className="event-description">{event.description}</p>}

      {wishes.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✨</div>
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
