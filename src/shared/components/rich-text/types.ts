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

export type RichTextViewerProps = {
  content: string;
  className?: string;
};
