import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { fetchSharedNote, revokeShare } from '../sharing/noteShareService';
import { ReadOnlyNote } from '../editor/ReadOnlyNote';
import { normalizeHexColor, useCustomNoteColor } from '../ui/useCustomNoteColor';

function normalizeColorId(raw) {
  const v = (raw || '').trim();
  if (!v) return 'cream';
  if (normalizeHexColor(v)) return 'custom';
  const allowed = new Set(['cream', 'sun', 'pink', 'white', 'sky', 'mint', 'lavender']);
  if (allowed.has(v)) return v;
  if (v === 'default') return 'cream';
  if (v === 'mist') return 'cream';
  if (v === 'sand') return 'sun';
  if (v === 'lavender') return 'pink';
  if (v === 'lilac') return 'lavender';
  if (v === 'peach') return 'pink';
  if (v === 'graphite') return 'white';
  return 'cream';
}

export default function SharedNotePage() {
  const { shareId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [share, setShare] = useState(null);
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchSharedNote({ shareId });
        if (!alive) return;
        setShare(res.share);
        setNote(res.note);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Failed to load shared note');
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [shareId]);

  const custom = useCustomNoteColor(note?.id || shareId || '', normalizeHexColor(note?.color));

  const noteColorClass = useMemo(() => {
    const id = normalizeColorId(note?.color);
    return id === 'custom' ? 'is-custom' : `is-${id}`;
  }, [note?.color]);

  const canRevoke = Boolean(user?.id && share?.user_id && user.id === share.user_id && share?.revoked === false);

  const onRevoke = async () => {
    if (!canRevoke) return;
    setRevoking(true);
    try {
      await revokeShare({ userId: user.id, shareId });
      const res = await fetchSharedNote({ shareId });
      setShare(res.share);
      setNote(res.note);
    } catch (e) {
      setError(e?.message || 'Failed to revoke');
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="SharedNoteShell">
        <div className="SharedNoteTop">
          <Link to="/" className="Brand">
            <div className="BrandMark">L</div>
            <div className="BrandName">Listem Notes</div>
          </Link>
        </div>
        <div className="SharedNoteCenter">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="SharedNoteShell">
        <div className="SharedNoteTop">
          <Link to="/" className="Brand">
            <div className="BrandMark">L</div>
            <div className="BrandName">Listem Notes</div>
          </Link>
        </div>
        <div className="SharedNoteCenter">{error}</div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="SharedNoteShell">
        <div className="SharedNoteTop">
          <Link to="/" className="Brand">
            <div className="BrandMark">L</div>
            <div className="BrandName">Listem Notes</div>
          </Link>
        </div>
        <div className="SharedNoteCenter">Share link not found.</div>
      </div>
    );
  }

  if (share.revoked || !note) {
    return (
      <div className="SharedNoteShell">
        <div className="SharedNoteTop">
          <Link to="/" className="Brand">
            <div className="BrandMark">L</div>
            <div className="BrandName">Listem Notes</div>
          </Link>
        </div>
        <div className="SharedNoteCenter">This share link has been revoked.</div>
      </div>
    );
  }

  return (
    <div className={`SharedNoteShell ${noteColorClass}${custom.isCustom ? ` ${custom.className}` : ''}`}>
      <div className="SharedNoteTop">
        <Link to="/" className="Brand">
          <div className="BrandMark">L</div>
          <div className="BrandName">Listem Notes</div>
        </Link>

        <div className="SharedNoteActions">
          {canRevoke ? (
            <button className="MiniIconButton isDanger" type="button" onClick={onRevoke} disabled={revoking} title="Revoke access">
              {revoking ? '…' : 'Revoke'}
            </button>
          ) : null}
        </div>
      </div>

      <main className="SharedNoteMain">
        <div className="SharedNoteDoc">
          <h1 className="SharedNoteTitle">{note.title || 'Untitled'}</h1>
          <ReadOnlyNote content={note.content} />
        </div>
      </main>
    </div>
  );
}
