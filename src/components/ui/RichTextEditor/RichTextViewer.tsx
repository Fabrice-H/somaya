'use client';

import type { RichTextViewerProps } from './types';

/**
 * Displays HTML content from rich text editor
 * Uses dangerouslySetInnerHTML but content should be sanitized on save
 */
export function RichTextViewer({ content, className = '' }: RichTextViewerProps) {
  if (!content || content === '<p></p>') {
    return null;
  }

  return (
    <>
      <div
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: '#2a181d',
        }}
      />
      <style jsx global>{`
        .rich-text-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1em 0 0.5em;
        }

        .rich-text-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1em 0 0.5em;
        }

        .rich-text-content p {
          margin: 0.5em 0;
        }

        .rich-text-content ul,
        .rich-text-content ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .rich-text-content ul {
          list-style-type: disc;
        }

        .rich-text-content ol {
          list-style-type: decimal;
        }

        .rich-text-content blockquote {
          border-left: 3px solid #511F29;
          padding-left: 1em;
          margin: 1em 0;
          color: #94786b;
          font-style: italic;
        }

        .rich-text-content a {
          color: #511F29;
          text-decoration: underline;
        }

        .rich-text-content strong {
          font-weight: 600;
        }

        .rich-text-content em {
          font-style: italic;
        }
      `}</style>
    </>
  );
}
