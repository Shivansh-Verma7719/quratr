import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  items: string[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  noResultsText?: string;
}

export const MultiSelect = ({
  items,
  selectedItems,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  noResultsText = "No results found",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Calculate dropdown position based on available space
  useEffect(() => {
    const calculatePosition = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Check if we're on mobile by screen width or user agent
      const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        setDropdownPosition('top');
      } else {
        // On desktop, choose based on available space
        setDropdownPosition(spaceBelow < 300 && spaceAbove > spaceBelow ? 'top' : 'bottom');
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen]);

  const toggleItem = (item: string) => {
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    onChange(newSelectedItems);
    setSearchQuery(""); // Clear search after selection
  };

  const removeItem = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedItems.filter((i) => i !== item));
  };

  // Highlight matching characters in search results
  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={i} className="bg-primary/20 text-primary">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" && 
      searchQuery === "" && 
      selectedItems.length > 0
    ) {
      const newSelectedItems = selectedItems.slice(0, -1);
      onChange(newSelectedItems);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full font-sans",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 w-full bg-background border border-gray-500 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden",
              dropdownPosition === 'top' ? "bottom-full mb-1" : "top-full mt-1"
            )}
          >
            <div className="max-h-60 overflow-auto">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  {items.length === 0 && !searchQuery 
                    ? "Please select a city first" 
                    : noResultsText}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => toggleItem(item)}
                    className={cn(
                      "px-4 py-2 text-sm cursor-pointer flex items-center justify-between",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      selectedItems.includes(item) &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{highlightMatch(item)}</span>
                    {selectedItems.includes(item) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "min-h-[42px] w-full rounded-xl border border-gray-500 dark:border-gray-600 bg-background",
          "px-3 py-2 flex items-center justify-between",
          "focus-within:ring-2 focus-within:ring-primary/50",
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 items-center">
          {selectedItems.map((item) => (
            <motion.span
              key={item}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={cn(
                "bg-primary/10 text-primary rounded-md flex items-center gap-2",
                "px-1.5 py-1.5",
                "text-sm"
              )}
            >
              <MapPin size={14} className="text-primary/70" />
              <span>{item}</span>
              <button
                onClick={(e) => removeItem(item, e)}
                className="hover:bg-primary/20 rounded-full"
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-[80px]"
          />
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </div>
    </div>
  );
};