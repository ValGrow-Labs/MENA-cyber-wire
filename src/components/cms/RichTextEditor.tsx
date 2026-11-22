"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Table,
  Eye,
  Edit3,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write editorial article body...",
  minHeight = "360px",
}: RichTextEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (before: string, after: string = "", defaultText: string = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;

    const newValue = el.value.substring(0, start) + replacement + el.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#2B2B2B] bg-[#191919] px-3 py-2 gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet("**", "**", "bold text")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("*", "*", "italic text")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Italic"
          >
            <Italic size={15} />
          </button>
          <span className="mx-1 h-4 w-px bg-[#2B2B2B]" />
          <button
            type="button"
            onClick={() => insertSnippet("## ", "\n", "Heading 2")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Heading 2"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("### ", "\n", "Heading 3")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Heading 3"
          >
            <Heading3 size={15} />
          </button>
          <span className="mx-1 h-4 w-px bg-[#2B2B2B]" />
          <button
            type="button"
            onClick={() => insertSnippet("- ", "\n", "List item")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Bullet list"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("1. ", "\n", "List item")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Numbered list"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("> ", "\n", "Editorial quote or warning")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Blockquote"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("```bash\n", "\n```\n", "# Command or code")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Code block"
          >
            <Code size={15} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("[", "](https://example.com)", "link title")}
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Insert link"
          >
            <LinkIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                "\n| Indicator / IoC | Type | Target Vertical |\n| :--- | :--- | :--- |\n| `c2.malicious-domain.com` | DNS C2 | Energy / Oil |\n| `e3b0c44298fc...` | SHA256 | Telecom |\n\n"
              )
            }
            className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
            title="Insert IoC Table"
          >
            <Table size={15} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 rounded bg-[#151515] p-0.5 border border-[#2B2B2B]">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium ${
              tab === "write"
                ? "bg-[#202020] text-[#F5F5F5]"
                : "text-[#707070] hover:text-[#F5F5F5]"
            }`}
          >
            <Edit3 size={13} />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium ${
              tab === "preview"
                ? "bg-[#202020] text-[#F5F5F5]"
                : "text-[#707070] hover:text-[#F5F5F5]"
            }`}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full resize-y bg-transparent p-4 font-mono text-xs leading-relaxed text-[#F5F5F5] placeholder-[#707070] focus:outline-none"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="prose prose-invert max-w-none p-5 text-xs leading-relaxed text-[#F5F5F5] overflow-y-auto"
        >
          {value ? (
            <div className="space-y-4 whitespace-pre-wrap font-sans">
              {value}
            </div>
          ) : (
            <p className="italic text-[#707070]">No content to preview.</p>
          )}
        </div>
      )}

      {/* Footer Metrics */}
      <div className="flex items-center justify-between border-t border-[#2B2B2B] bg-[#191919] px-3 py-1.5 font-mono text-[11px] text-[#707070]">
        <div>
          <span>{wordCount} words</span>
          <span className="mx-2">·</span>
          <span>~{readTimeMinutes} min read</span>
        </div>
        <div className="text-[11px] text-[#707070]">
          Markdown supported
        </div>
      </div>
    </div>
  );
}
