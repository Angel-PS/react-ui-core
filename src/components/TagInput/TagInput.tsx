import {
  forwardRef,
  useId,
  useState,
  type ClipboardEvent,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cn } from "../../lib/utils";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  /** Optional per-tag validation. When omitted, any non-empty tag is accepted. */
  validate?: (value: string) => boolean;
  /** Message shown when a typed value fails `validate`. */
  invalidMessage?: string;
  /** Draft input type. Defaults to "text". */
  type?: HTMLInputTypeAttribute;
  /** Accessible label for a chip's remove button. Default: "Remove {tag}". */
  removeTagLabel?: (tag: string) => string;
  error?: string | null;
  /**
   * Helper text under the field. Wired to the draft input through
   * `aria-describedby`, so it is announced together with the label.
   */
  hint?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /**
   * Called when the draft input loses focus (after any pending draft is
   * committed) — lets react-hook-form mark the field as touched.
   */
  onBlur?: () => void;
}

/** Strips separators and whitespace from both ends of a typed tag. */
export const cleanTag = (raw: string): string =>
  raw
    .trim()
    .replace(/^[,;]+|[,;]+$/g, "")
    .trim();

/** Splits pasted text into candidate tags on newlines, commas and semicolons. */
export const splitPastedTags = (text: string): string[] =>
  text
    .split(/[\n\r,;]+/)
    .map(cleanTag)
    .filter(Boolean);

const defaultRemoveLabel = (tag: string) => `Remove ${tag}`;

/**
 * Controlled multi-value "chip" input. Commits on Enter / comma / Tab / blur
 * and splits a pasted list; runs an optional per-tag validation and drops
 * duplicates; Backspace on an empty draft removes the last chip. The `ref`
 * points at the draft input, so a form library can focus the field.
 */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput({
  value,
  onChange,
  label,
  placeholder,
  validate,
  invalidMessage = "Invalid value",
  type = "text",
  removeTagLabel = defaultRemoveLabel,
  error,
  hint,
  disabled = false,
  required = false,
  id,
  name,
  className,
  onBlur,
}, ref) {
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const autoId = useId();
  const controlId = id ?? name ?? autoId;
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;

  const shownError = error || localError;
  const describedBy =
    [shownError ? errorId : undefined, hint ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  /**
   * Adds every valid, new tag in `candidates`. Returns the ones that failed
   * validation so the caller can keep them in the draft for correction.
   */
  const addTags = (candidates: string[]): string[] => {
    const next = [...value];
    const rejected: string[] = [];
    for (const tag of candidates) {
      if (validate && !validate(tag)) {
        rejected.push(tag);
        continue;
      }
      if (!next.includes(tag)) next.push(tag);
    }
    if (next.length !== value.length) onChange(next);
    return rejected;
  };

  const commit = (raw: string): boolean => {
    const tag = cleanTag(raw);
    if (!tag) {
      setDraft("");
      return true;
    }
    const rejected = addTags([tag]);
    if (rejected.length) {
      setLocalError(invalidMessage);
      return false;
    }
    setDraft("");
    setLocalError(null);
    return true;
  };

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Tab" && draft.trim()) {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      removeAt(value.length - 1);
    }
  };

  // A pasted list ("a.com, b.com" or one per line) becomes several chips at
  // once. A single value without separators pastes into the draft as usual.
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!/[\n\r,;]/.test(text)) return;
    e.preventDefault();
    const rejected = addTags(splitPastedTags(text));
    if (rejected.length) {
      setDraft(rejected.join(", "));
      setLocalError(invalidMessage);
    } else {
      setDraft("");
      setLocalError(null);
    }
  };

  return (
    <div className={cn("block w-full", className)}>
      {label && (
        <label htmlFor={controlId} className="label mb-1 block">
          {label}
          {required && <span className="text-alerts-error ml-1">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 shadow-xs transition-colors focus-within:ring-2 dark:bg-slate-900",
          shownError
            ? "border-alerts-error focus-within:ring-red-100 dark:focus-within:ring-red-950/50"
            : "focus-within:border-primary-blue-default focus-within:ring-primary-blue-light/50 border-gray-300 dark:border-slate-700",
          disabled &&
            "border-gray-200 bg-gray-50 shadow-none dark:border-slate-800 dark:bg-slate-800",
        )}
      >
        {value.map((tag, i) => (
          <span
            key={tag}
            className="bg-primary-blue-lightest text-primary-blue-dark inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
          >
            <span className="truncate">{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-primary-blue-dark/70 hover:text-primary-blue-dark cursor-pointer border-0 bg-transparent p-0"
                aria-label={removeTagLabel(tag)}
              >
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        <input
          ref={ref}
          id={controlId}
          name={name}
          type={type}
          value={draft}
          disabled={disabled}
          autoComplete="off"
          aria-required={required}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setLocalError(null);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            commit(draft);
            onBlur?.();
          }}
          className="min-w-40 flex-1 border-0 bg-transparent py-0.5 text-sm text-slate-700 placeholder-slate-400 outline-none disabled:cursor-not-allowed disabled:text-gray-400 dark:text-slate-200 dark:placeholder-slate-500 dark:disabled:text-slate-500"
        />
      </div>
      {shownError && (
        <span
          id={errorId}
          role="alert"
          className="text-alerts-error mt-1 block text-xs font-medium"
        >
          {shownError}
        </span>
      )}
      {hint && (
        <p id={hintId} className="text-muted-foreground mt-1 mb-0 text-xs">
          {hint}
        </p>
      )}
    </div>
  );
});

export default TagInput;
