import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: "text" | "email" | "url" | "number" | "password";
  hint?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  readOnly?: boolean;
}

export function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  multiline,
  rows = 4,
  className,
  readOnly,
}: FormFieldProps) {
  const inputClass = cn(
    "mt-1.5 w-full rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground",
    "placeholder:text-muted-foreground/50",
    "focus:border-border focus:outline-none focus:ring-1 focus:ring-accent/30",
  );

  return (
    <label className={cn("block", className)}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={rows}
          className={cn(inputClass, "resize-y min-h-[5rem]")}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          readOnly={readOnly}
          className={cn(inputClass, readOnly && "cursor-not-allowed opacity-70")}
        />
      )}
      {hint ? (
        <span className="mt-1 block text-xs text-muted-foreground/80">{hint}</span>
      ) : null}
    </label>
  );
}
