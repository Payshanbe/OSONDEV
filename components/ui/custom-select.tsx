"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectOption = readonly [value: string, label: string];

type CustomSelectProps = {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  options: readonly SelectOption[];
  onValueChange: (value: string) => void;
  invalid?: boolean;
  errorId?: string;
};

export function CustomSelect({
  id,
  name,
  value,
  placeholder,
  options,
  onValueChange,
  invalid = false,
  errorId,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;
  const selectedIndex = options.findIndex(([optionValue]) => optionValue === value);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex]?.[1] : undefined;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(Math.max(0, Math.min(options.length - 1, index)));
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onValueChange(option[0]);
    setActiveIndex(index);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) openList();
      else setActiveIndex((index) => (index + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openList(selectedIndex >= 0 ? selectedIndex : options.length - 1);
      else setActiveIndex((index) => (index - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else openList();
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={open ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "focus-ring flex w-full items-center justify-between gap-4 rounded-none border bg-white/[0.035] px-4 py-3.5 text-left text-sm outline-none transition-colors",
          "hover:border-white/25 focus:border-accent/60",
          open ? "border-accent/70 ring-2 ring-accent/25" : "border-white/15",
          invalid && "border-red-400/70",
        )}
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground/55"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-40 max-h-64 overflow-y-auto border border-white/15 bg-[#0d0d11] p-1.5 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.85)]"
          >
            {options.map(([optionValue, label], index) => {
              const selected = optionValue === value;
              const active = index === activeIndex;

              return (
                <button
                  key={optionValue}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-3 py-3 text-left text-sm text-foreground/75 transition-colors",
                    active && "bg-white/[0.07] text-foreground",
                    selected && "bg-accent/15 text-foreground",
                  )}
                >
                  <span>{label}</span>
                  {selected && <Check className="size-4 shrink-0 text-accent" aria-hidden />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
