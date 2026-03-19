import { useState } from 'react';

const EMOJIS = ['🎁', '🎂', '🎄', '💍', '🎓', '🏠', '👶', '🎉', '❤️', '🌟'];

export default function EventForm({ event, onSave, onClose }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date ? event.date.slice(0, 10) : '');
  const [emoji, setEmoji] = useState(event?.emoji || '🎁');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), date: date || null, emoji });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{event ? 'Редагувати подію' : 'Нова подія'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Назва *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="День народження Марії" autoFocus />
          </div>
          <div className="form-group">
            <label>Опис</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Деталі..." />
          </div>
          <div className="form-group">
            <label>Дата</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Іконка</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  style={{
                    fontSize: 24,
                    padding: '4px 8px',
                    borderRadius: 8,
                    border: emoji === em ? '2px solid var(--accent)' : '2px solid transparent',
                    background: emoji === em ? 'rgba(233,69,96,0.15)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn btn-primary">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}
