import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import EventForm from '../components/EventForm';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();

  const load = () => api.get('/events').then(r => setEvents(r.data));

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    if (editEvent) {
      await api.put(`/events/${editEvent.id}`, data);
    } else {
      await api.post('/events', data);
    }
    setShowForm(false);
    setEditEvent(null);
    load();
  };

  const handleEdit = (e, ev) => {
    e.stopPropagation();
    setEditEvent(ev);
    setShowForm(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Видалити цю подію та всі побажання?')) return;
    await api.delete(`/events/${id}`);
    load();
  };

  return (
    <>
      <div className="page-top">
        <h2>Події</h2>
        <button className="btn btn-primary" onClick={() => { setEditEvent(null); setShowForm(true); }}>
          + Додати подію
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎉</div>
          <p>Поки немає подій. Створіть першу!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(ev => (
            <div key={ev.id} className="event-card" onClick={() => navigate(`/events/${ev.id}`)}>
              <div className="emoji">{ev.emoji}</div>
              <h3>{ev.title}</h3>
              {ev.description && <p style={{ color: '#888', fontSize: 13 }}>{ev.description}</p>}
              <div className="meta">
                {ev.date && <span>📅 {new Date(ev.date).toLocaleDateString('uk-UA')}</span>}
                <span>🎁 {ev.wish_count} побажань</span>
                {ev.reserved_count > 0 && <span>✅ {ev.reserved_count} зарезервовано</span>}
              </div>
              <button className="edit-btn" onClick={(e) => handleEdit(e, ev)} title="Редагувати">✏️</button>
              <button
                className="edit-btn"
                style={{ right: 44 }}
                onClick={(e) => handleDelete(e, ev.id)}
                title="Видалити"
              >🗑️</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EventForm
          event={editEvent}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditEvent(null); }}
        />
      )}
    </>
  );
}
