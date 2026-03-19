import { useState } from 'react';

export default function WishForm({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), url: url.trim() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Нове побажання</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Назва *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="AirPods Pro" autoFocus />
          </div>
          <div className="form-group">
            <label>Посилання</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn btn-primary">Додати</button>
          </div>
        </form>
      </div>
    </div>
  );
}
