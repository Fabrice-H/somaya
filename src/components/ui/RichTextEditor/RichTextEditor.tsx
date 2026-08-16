'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';
import type { RichTextEditorProps } from './types';

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="transition-colors"
      style={{
        width: 32,
        height: 32,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isActive ? '#511F29' : 'transparent',
        color: isActive ? '#fcd3b4' : '#2a181d',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Commencez à écrire...',
  label,
  hint,
  minHeight = 200,
  maxHeight = 500,
  disabled = false,
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#511F29] underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        style: `min-height: ${minHeight - 60}px; max-height: ${maxHeight - 60}px; overflow-y: auto; padding: 16px;`,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL du lien:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 500,
            color: '#2a181d',
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          border: '1px solid rgba(81, 31, 41, 0.15)',
          background: disabled ? '#e8e0d8' : '#faf6f1',
        }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-1"
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(81, 31, 41, 0.15)',
            background: '#faf6f1',
          }}
        >
          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
            title="Annuler"
          >
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
            title="Rétablir"
          >
            <Redo size={16} />
          </ToolbarButton>

          <span style={{ width: 1, height: 20, background: 'rgba(81, 31, 41, 0.15)', margin: '0 8px' }} />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            disabled={disabled}
            title="Titre 2"
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            disabled={disabled}
            title="Titre 3"
          >
            <Heading3 size={16} />
          </ToolbarButton>

          <span style={{ width: 1, height: 20, background: 'rgba(81, 31, 41, 0.15)', margin: '0 8px' }} />

          {/* Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={disabled}
            title="Gras"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={disabled}
            title="Italique"
          >
            <Italic size={16} />
          </ToolbarButton>

          <span style={{ width: 1, height: 20, background: 'rgba(81, 31, 41, 0.15)', margin: '0 8px' }} />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            disabled={disabled}
            title="Liste à puces"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            disabled={disabled}
            title="Liste numérotée"
          >
            <ListOrdered size={16} />
          </ToolbarButton>

          <span style={{ width: 1, height: 20, background: 'rgba(81, 31, 41, 0.15)', margin: '0 8px' }} />

          {/* Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            disabled={disabled}
            title="Citation"
          >
            <Quote size={16} />
          </ToolbarButton>

          {/* Links */}
          <ToolbarButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            disabled={disabled}
            title="Ajouter un lien"
          >
            <LinkIcon size={16} />
          </ToolbarButton>
          {editor.isActive('link') && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={disabled}
              title="Supprimer le lien"
            >
              <Unlink size={16} />
            </ToolbarButton>
          )}
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>

      {hint && (
        <p style={{ fontSize: 12, color: '#94786b', marginTop: 6 }}>
          {hint}
        </p>
      )}

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94786b;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1em 0 0.5em;
          color: #2a181d;
        }

        .ProseMirror h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1em 0 0.5em;
          color: #2a181d;
        }

        .ProseMirror p {
          margin: 0.5em 0;
          color: #2a181d;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
          color: #2a181d;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #511F29;
          padding-left: 1em;
          margin: 1em 0;
          color: #94786b;
          font-style: italic;
        }

        .ProseMirror a {
          color: #511F29;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
