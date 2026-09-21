/**
 * Rich text editor props
 */
export type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  minHeight?: number;
  maxHeight?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Rich text viewer props
 */
export type RichTextViewerProps = {
  content: string;
  className?: string;
};
