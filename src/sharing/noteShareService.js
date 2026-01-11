import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function getShareForNote({ userId, noteId }) {
  const { data, error } = await supabase
    .from('note_shares')
    .select('share_id, revoked, note_id, user_id, created_at')
    .eq('user_id', userId)
    .eq('note_id', noteId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function enableShareForNote({ userId, noteId }) {
  const existing = await getShareForNote({ userId, noteId });

  if (existing?.share_id) {
    if (existing.revoked) {
      const { data, error } = await supabase
        .from('note_shares')
        .update({ revoked: false })
        .eq('user_id', userId)
        .eq('note_id', noteId)
        .select('share_id, revoked')
        .single();

      if (error) throw error;
      return data;
    }

    return existing;
  }

  const shareId = uuidv4();
  const { data, error } = await supabase
    .from('note_shares')
    .insert({ share_id: shareId, user_id: userId, note_id: noteId, revoked: false })
    .select('share_id, revoked')
    .single();

  if (error) throw error;
  return data;
}

export async function revokeShare({ userId, noteId, shareId }) {
  let query = supabase.from('note_shares').update({ revoked: true });

  if (noteId) query = query.eq('note_id', noteId);
  if (shareId) query = query.eq('share_id', shareId);
  query = query.eq('user_id', userId);

  const { data, error } = await query.select('share_id, revoked').maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function fetchSharedNote({ shareId }) {
  const { data, error } = await supabase.rpc('fetch_shared_note', { p_share_id: shareId });
  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { share: null, note: null };

  return {
    share: {
      share_id: row.share_id,
      revoked: row.revoked,
      note_id: row.note_id,
      user_id: row.user_id,
      created_at: row.created_at,
    },
    note: {
      id: row.note_id,
      user_id: row.user_id,
      title: row.note_title,
      content: row.note_content,
      color: row.note_color,
      created_at: row.note_created_at,
      updated_at: row.note_updated_at,
    },
  };
}
