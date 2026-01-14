import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { useNotes } from '../notes/NotesProvider';
import { SlashCommand } from './slashCommand';

const lowlight = createLowlight(common);

export function NoteEditor({ noteId, noteTitle, initialContent }) {
  const { updateNoteContent } = useNotes();
  const saveTimer = useRef(null);
  const [focused, setFocused] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Typography,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note…',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      SlashCommand,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'ProseMirror ListemEditor',
        spellcheck: 'true',
      },
    },
    onSelectionUpdate: ({ editor: ed }) => {
      setHasSelection(!ed.state.selection.empty);
    },
    onUpdate: ({ editor: ed }) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        updateNoteContent(noteId, ed.getJSON());
      }, 350);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    editor.on('focus', onFocus);
    editor.on('blur', onBlur);

    return () => {
      editor.off('focus', onFocus);
      editor.off('blur', onBlur);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [editor]);

  const canLink = useMemo(() => editor?.can().setLink({ href: 'https://example.com' }) ?? false, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const { from, to } = editor.state.selection;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Paste a link URL', prev || '');
    if (url === null) return;
    if (url === '') {
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .extendMarkRange('link')
        .unsetLink()
        .run();
      return;
    }
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  };

  const showToolbar = focused || hasSelection;

  return (
    <div className="EditorRoot">
      <div className={showToolbar ? 'EditorFloatingToolbar isVisible' : 'EditorFloatingToolbar'} role="toolbar" aria-label="Editor toolbar">
        <button
          type="button"
          className={editor.isActive('bold') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={editor.isActive('underline') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={editor.isActive('code') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline code"
          title="Inline code"
        >
          {'</>'}
        </button>
        <button
          type="button"
          className={editor.isActive('link') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={setLink}
          disabled={!canLink}
          aria-label="Link"
          title="Link"
        >
          Link
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
