import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
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

function HeadingDropdown({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const headings = [
    { level: 1, label: 'Heading 1', shortcut: '⌘⌥1' },
    { level: 2, label: 'Heading 2', shortcut: '⌘⌥2' },
    { level: 3, label: 'Heading 3', shortcut: '⌘⌥3' },
    { level: 4, label: 'Heading 4', shortcut: '⌘⌥4' },
    { level: 0, label: 'Normal text', shortcut: '⌘⌥0' },
  ];

  const currentLevel = headings.find(h => 
    h.level > 0 && editor.isActive('heading', { level: h.level })
  )?.level || 0;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectHeading = (level) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="EditorHeadingDropdown">
      <button
        type="button"
        className={currentLevel > 0 ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={toggleDropdown}
        aria-label="Heading styles"
        title="Heading styles"
      >
        <span style={{ fontSize: '14px', fontWeight: 700 }}>
          {currentLevel > 0 ? `H${currentLevel}` : 'H1'}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {isOpen && (
        <div className="EditorHeadingDropdownMenu">
          {headings.map((heading) => (
            <button
              key={heading.level}
              type="button"
              className={currentLevel === heading.level ? 'EditorHeadingDropdownItem isActive' : 'EditorHeadingDropdownItem'}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectHeading(heading.level)}
            >
              <span className="EditorHeadingLabel">
                {heading.level === 0 ? (
                  <span style={{ fontSize: '14px' }}>Normal text</span>
                ) : (
                  <span style={{ fontSize: heading.level === 1 ? '18px' : heading.level === 2 ? '16px' : heading.level === 3 ? '14px' : '13px', fontWeight: 700 }}>
                    Heading {heading.level}
                  </span>
                )}
              </span>
              <span className="EditorHeadingShortcut">{heading.shortcut}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NoteEditor({ noteId, noteTitle, initialContent }) {
  const { updateNoteContent } = useNotes();
  const saveTimer = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Typography,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: 'Your description...',
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
    onUpdate: ({ editor: ed }) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        updateNoteContent(noteId, ed.getJSON());
      }, 350);
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="EditorRoot">
      {/* Static toolbar at top */}
      <div className="EditorStaticToolbar" role="toolbar" aria-label="Editor toolbar">
        <button
          type="button"
          className={editor.isActive('bold') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          title="Bold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
          </svg>
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          title="Italic"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"/>
            <line x1="14" y1="20" x2="5" y2="20"/>
            <line x1="15" y1="4" x2="9" y2="20"/>
          </svg>
        </button>
        <button
          type="button"
          className={editor.isActive('strike') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
          title="Strikethrough"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.3 19c-1.4 1.4-3.2 2-5.3 2-4.4 0-8-3.6-8-8 0-1.9.7-3.7 2-5.2"/>
            <path d="M6.7 5C8 3.6 9.8 3 12 3c4.4 0 8 3.6 8 8 0 1.9-.7 3.7-2 5.2"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
          </svg>
        </button>
        <button
          type="button"
          className={editor.isActive('underline') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          title="Underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
            <line x1="4" y1="21" x2="20" y2="21"/>
          </svg>
        </button>
        <div className="EditorToolbarDivider" />
        <HeadingDropdown editor={editor} />
        <button
          type="button"
          className={editor.isActive('bulletList') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
          title="Bullet list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? 'EditorToolbarButton isActive' : 'EditorToolbarButton'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
          title="Numbered list"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/>
            <line x1="10" y1="12" x2="21" y2="12"/>
            <line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4M4 10h2M4 16h2M4 12h2"/>
          </svg>
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="EditorWordCount">
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words</span>
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters</span>
      </div>
    </div>
  );
}
