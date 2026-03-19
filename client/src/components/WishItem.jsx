import { useState } from 'react';

export default function WishItem({ wish, onReserve, onUnreserve, onDelete }) {
  const [showReserve, setShowReserve] = useState(false);
  const [name, setName] = useState('');

  const handleReserve = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onReserve(wish.id, name.trim());
    setShowReserve(false);
    setName('');
  };

  return (
    <div className={`wish-item ${wish.reserved_by ? 'reserved' : ''}`}>
      <div className="wish-info">
        <h4>
          {wish.reserved_by ? '✅ ' : ''}{wish.title}
        </h4>
        {wish.url && (
          <a href={wish.url} target="_blank" rel="noopener noreferrer" className="wish-link">
            🔗 {wish.url.length > 50 ? wish.url.slice(0, 50) + '...' : wish.url}
          </a>
        )}
        {wish.reserved_by && (
          <div className="reserved-label">Зарезервовано: {wish.reserved_by}</div>
        )}
      </div>

      <div className="wish-actions">
        {wish.reserved_by ? (
          <button className="btn btn-outline btn-sm" onClick={() => onUnreserve(wish.id)}>
            Зняти резерв
          </button>
        ) : showReserve ? (
          <form onSubmit={handleReserve} style={{ display: 'flex', gap: 6 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше ім'я"
              autoFocus
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg-input)',
                color: 'var(--text)',
                fontSize: 13,
                width: 120,
              }}
            />
            <button type="submit" className="btn btn-green btn-sm">OK</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowReserve(false)}>✕</button>
          </form>
        ) : (
          <button className="btn btn-green btn-sm" onClick={() => setShowReserve(true)}>
            Зарезервувати
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(wish.id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
