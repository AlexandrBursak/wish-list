import { useState, useRef } from 'react';
import api from '../api';

export default function WishForm({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchOg = async (link) => {
    if (!link || !link.startsWith('http')) return;
    setLoading(true);
    try {
      const { data } = await api.get('/og', { params: { url: link } });
      if (data.image) setImageUrl(data.image);
      if (data.title && !title) setTitle(data.title);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOg(val.trim()), 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), url: url.trim(), image_url: imageUrl.trim() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Нове побажання</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Посилання</label>
            <input value={url} onChange={handleUrlChange} placeholder="https://..." autoFocus />
            {loading && <small style={{ color: 'var(--text-muted)' }}>Завантаження preview...</small>}
          </div>

          {imageUrl && (
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 8, border: '1px solid var(--border)' }}
                onError={() => setImageUrl('')}
              />
            </div>
          )}

          <div className="form-group">
            <label>Назва *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="AirPods Pro" />
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
