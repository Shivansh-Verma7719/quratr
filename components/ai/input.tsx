import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";

interface AIInputBoxProps {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
  containerClassName?: string;
  fixed?: boolean;
}

const AIInputBox: React.FC<AIInputBoxProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading = false,
  error = null,
  placeholder = "Ask about restaurants...",
  inputRef: externalInputRef,
  className = "",
  containerClassName = "",
  fixed = true,
}) => {
  const internalInputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  // Auto-grow textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setQuery(textarea.value);
  };

  // Clear input and reset height
  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  // Handle Cmd/Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputRef.current === document.activeElement &&
        (e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit]);

  const positionClass = fixed ? 
    "fixed bottom-[2.5rem] z-30 left-0 right-0" : 
    "relative";

  return (
    <div className={`${positionClass} border-t border-gray-200 dark:border-gray-800 bg-background/40 p-3 backdrop-blur-md ${containerClassName}`}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }} 
        className={`mx-auto max-w-3xl ${className}`}
      >
        <div className="relative flex mb-1 items-center overflow-hidden rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md focus-within:ring-2 focus-within:ring-primary/30">
          <textarea
            ref={inputRef}
            value={query}
            onChange={handleTextareaInput}
            placeholder={placeholder}
            rows={1}
            className="max-h-[100px] min-h-[44px] w-full resize-none bg-transparent px-4 py-3 pr-16 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          <div className="hidden md:flex absolute right-20 text-xs text-gray-400 items-center">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 mr-1">Ctrl</kbd>
            <span className="mx-0.5">+</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Enter</kbd>
          </div>

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute bottom-[10px] right-12 rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute bottom-[6px] right-2 rounded-full bg-primary p-2 text-white opacity-90 transition-opacity hover:opacity-100 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-xs text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800"
          >
            {error}
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default AIInputBox;