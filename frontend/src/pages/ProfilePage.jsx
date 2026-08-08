import { useRef, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

function fileToAvatar(file, size = 160) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function initials(user) {
  return `${(user.firstName || '?')[0]}${(user.lastName || '?')[0]}`.toUpperCase();
}

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  async function pickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setDone('');
    try {
      setPreview(await fileToAvatar(file));
    } catch {
      setError('Impossible de lire cette image.');
    }
  }

  async function save() {
    if (!preview) return;
    setSaving(true);
    setError('');
    setDone('');
    try {
      await api('/api/auth/avatar', { method: 'PUT', body: { avatarUrl: preview } });
      await refresh();
      setPreview(null);
      setDone('Photo de profil enregistrée.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    setError('');
    setDone('');
    try {
      await api('/api/auth/avatar', { method: 'PUT', body: { avatarUrl: null } });
      await refresh();
      setPreview(null);
      setDone('Photo de profil supprimée.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const avatar = preview || user.avatarUrl;

  return (
    <div className="profile-page">
      <h1>Profil</h1>
      <p className="subtitle">{user.firstName} {user.lastName} — {user.email}</p>

      <div className="card profile-card">
        <div className="avatar-large">
          {avatar ? (
            <img src={avatar} alt="Photo de profil" />
          ) : (
            <span>{initials(user)}</span>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style={{ display: 'none' }}
          onChange={pickFile}
        />

        <div className="profile-actions">
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            {preview ? 'Changer d’image' : 'Choisir une photo'}
          </button>
          {preview && (
            <button className="btn btn-ghost" disabled={saving} onClick={save}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          )}
          {user.avatarUrl && (
            <button className="btn btn-danger" disabled={saving} onClick={remove}>
              Supprimer
            </button>
          )}
        </div>

        {preview && <p className="muted">Prévisualisation — clique sur Enregistrer pour valider.</p>}
        {error && <p className="error">{error}</p>}
        {done && <p className="success">{done}</p>}
      </div>
    </div>
  );
}
