import { forwardRef } from 'react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  RemoveFormatting,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  Minus,
  Pilcrow,
  Undo,
  Redo,
} from 'lucide-react';
import { Separator } from './separator';

import { Button } from './button';
import { cn } from '../../lib/utils';

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  type ToolbarButton = {
    name: string;
    command: () => void;
    icon: React.ElementType;
    isActive: boolean;
    canExecute: boolean;
  };

  type ToolbarItem = ToolbarButton | 'separator';

  const toolbarItems: ToolbarItem[] = [
    // Mark Group
    {
      name: 'bold',
      command: () => editor.chain().focus().toggleBold().run(),
      icon: Bold,
      isActive: editor.isActive('bold'),
      canExecute: editor.can().toggleBold(),
    },
    {
      name: 'italic',
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: Italic,
      isActive: editor.isActive('italic'),
      canExecute: editor.can().toggleItalic(),
    },
    {
      name: 'strike',
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: Strikethrough,
      isActive: editor.isActive('strike'),
      canExecute: editor.can().toggleStrike(),
    },
    {
      name: 'code',
      command: () => editor.chain().focus().toggleCode().run(),
      icon: Code,
      isActive: editor.isActive('code'),
      canExecute: editor.can().toggleCode(),
    },
    'separator',
    // Block Type Group
    {
      name: 'paragraph',
      command: () => editor.chain().focus().setParagraph().run(),
      icon: Pilcrow,
      isActive: editor.isActive('paragraph'),
      canExecute: editor.can().setParagraph(),
    },
    {
      name: 'h1',
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: Heading1,
      isActive: editor.isActive('heading', { level: 1 }),
      canExecute: editor.can().toggleHeading({ level: 1 }),
    },
    {
      name: 'h2',
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: Heading2,
      isActive: editor.isActive('heading', { level: 2 }),
      canExecute: editor.can().toggleHeading({ level: 2 }),
    },
    {
      name: 'h3',
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: Heading3,
      isActive: editor.isActive('heading', { level: 3 }),
      canExecute: editor.can().toggleHeading({ level: 3 }),
    },
    {
      name: 'h4',
      command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      icon: Heading4,
      isActive: editor.isActive('heading', { level: 4 }),
      canExecute: editor.can().toggleHeading({ level: 4 }),
    },
    'separator',
    // List & Block Group
    {
      name: 'bulletList',
      command: () => editor.chain().focus().toggleBulletList().run(),
      icon: List,
      isActive: editor.isActive('bulletList'),
      canExecute: editor.can().toggleBulletList(),
    },
    {
      name: 'orderedList',
      command: () => editor.chain().focus().toggleOrderedList().run(),
      icon: ListOrdered,
      isActive: editor.isActive('orderedList'),
      canExecute: editor.can().toggleOrderedList(),
    },
    {
      name: 'blockquote',
      command: () => editor.chain().focus().toggleBlockquote().run(),
      icon: Quote,
      isActive: editor.isActive('blockquote'),
      canExecute: editor.can().toggleBlockquote(),
    },
    {
      name: 'codeBlock',
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      icon: SquareCode,
      isActive: editor.isActive('codeBlock'),
      canExecute: editor.can().toggleCodeBlock(),
    },
    'separator',
    // Action Group
    {
      name: 'clearMarks',
      command: () => editor.chain().focus().unsetAllMarks().run(),
      icon: RemoveFormatting,
      isActive: false, // This is an action, not a state
      canExecute: editor.can().unsetAllMarks(),
    },
    {
      name: 'horizontalRule',
      command: () => editor.chain().focus().setHorizontalRule().run(),
      icon: Minus,
      isActive: false,
      canExecute: editor.can().setHorizontalRule(),
    },
    'separator',
    // History Group
    {
      name: 'undo',
      command: () => editor.chain().focus().undo().run(),
      icon: Undo,
      isActive: false,
      canExecute: editor.can().undo(),
    },
    {
      name: 'redo',
      command: () => editor.chain().focus().redo().run(),
      icon: Redo,
      isActive: false,
      canExecute: editor.can().redo(),
    },
  ];

  return (
    <div className="border-b border-input p-2 flex items-center flex-wrap gap-1">
      {toolbarItems.map((item, index) =>
        item === 'separator' ? (
          <Separator key={index} orientation="vertical" className="h-6" />
        ) : (
          <Button
            key={item.name}
            variant={item.isActive ? 'secondary' : 'ghost'}
            size="icon"
            onClick={item.command}
            disabled={!item.canExecute}
            title={item.name}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        )
      )}
    </div>
  );
};

export interface TextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  className?: string;
  disabled?: boolean;
}

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
];

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ content, onChange, className, disabled = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border border-input rounded-md',
          { 'cursor-text': disabled },
          className
        )}
      >
        <EditorProvider
          editable={!disabled}
          extensions={extensions}
          content={content}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
          editorProps={{
            attributes: {
              class:
                'prose dark:prose-invert prose-sm sm:prose-base max-w-none m-5 focus:outline-none',
            },
          }}
          slotBefore={!disabled ? <Toolbar /> : null}
        ></EditorProvider>
      </div>
    );
  }
);

TextEditor.displayName = 'Text Editor';

export { TextEditor };
