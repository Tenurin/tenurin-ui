import React, { forwardRef, useCallback, useEffect } from 'react';
import { useEditor, EditorContent, JSONContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

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
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Highlighter,
} from 'lucide-react';
import { Separator } from './separator';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { Input } from './input';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

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
      name: 'underline',
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
      isActive: editor.isActive('underline'),
      canExecute: editor.can().toggleUnderline(),
    },
    {
      name: 'code',
      command: () => editor.chain().focus().toggleCode().run(),
      icon: Code,
      isActive: editor.isActive('code'),
      canExecute: editor.can().toggleCode(),
    },
    'separator',
    // Style Group
    {
      name: 'highlight',
      command: () => editor.chain().focus().toggleHighlight().run(),
      icon: Highlighter,
      isActive: editor.isActive('highlight'),
      canExecute: editor.can().toggleHighlight(),
    },
    {
      name: 'superscript',
      command: () => editor.chain().focus().toggleSuperscript().run(),
      icon: SuperscriptIcon,
      isActive: editor.isActive('superscript'),
      canExecute: editor.can().toggleSuperscript(),
    },
    {
      name: 'subscript',
      command: () => editor.chain().focus().toggleSubscript().run(),
      icon: SubscriptIcon,
      isActive: editor.isActive('subscript'),
      canExecute: editor.can().toggleSubscript(),
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
      name: 'setLink',
      command: setLink,
      icon: LinkIcon,
      isActive: editor.isActive('link'),
      canExecute: true,
    },
    {
      name: 'unsetLink',
      command: () => editor.chain().focus().unsetLink().run(),
      icon: Unlink,
      isActive: false,
      canExecute: editor.isActive('link'),
    },
    {
      name: 'horizontalRule',
      command: () => editor.chain().focus().setHorizontalRule().run(),
      icon: Minus,
      isActive: false,
      canExecute: editor.can().setHorizontalRule(),
    },
    'separator',
    // Style clear & History
    {
      name: 'clearMarks',
      command: () => editor.chain().focus().unsetAllMarks().run(),
      icon: RemoveFormatting,
      isActive: false,
      canExecute: editor.can().unsetAllMarks(),
    },
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
            type="button"
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
      <Input
        type="color"
        className="w-8 h-8 p-1"
        value={editor.getAttributes('textStyle').color || '#000000'}
        onInput={(event) =>
          editor.chain().focus().setColor(event.currentTarget.value).run()
        }
        title="Text Color"
        disabled={!editor.can().setColor('#000000')}
      />
    </div>
  );
};

interface TextEditorBaseProps {
  className?: string;
  disabled?: boolean;
}

interface TextEditorHtmlProps extends TextEditorBaseProps {
  format: 'html';
  content: string;
  onChange: (html: string) => void;
}

interface TextEditorJsonProps extends TextEditorBaseProps {
  format?: 'json';
  content: JSONContent | string;
  onChange: (json: JSONContent) => void;
}

export type TextEditorProps = TextEditorHtmlProps | TextEditorJsonProps;

const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
  }),
  Underline,
  Superscript,
  Subscript,
  Highlight,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  TextStyleKit,
  Color,
];

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>((props, ref) => {
  const { className, disabled = false } = props;

  const editor = useEditor({
    extensions,
    editable: !disabled,
    content: props.content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base max-w-none m-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (props.format === 'html') {
        props.onChange(editor.getHTML());
      } else {
        props.onChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable !== !disabled) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editorContent = JSON.stringify(editor.getJSON());
    const newContent = JSON.stringify(props.content);

    if (editorContent !== newContent) {
      editor.commands.setContent(props.content, { emitUpdate: false });
    }
  }, [props.content, editor]);

  return (
    <div
      ref={ref}
      className={cn(
        'border border-input rounded-md',
        { 'cursor-text': disabled },
        className
      )}
    >
      {!disabled && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
});

TextEditor.displayName = 'Text Editor';

export { TextEditor };
