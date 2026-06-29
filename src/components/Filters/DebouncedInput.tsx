import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import { Input } from "../Input";

const DEBOUNCE_MS = 300;

interface DebouncedInputProps {
  type: "text" | "number";
  value: string;
  onCommit: (next: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
}

/**
 * Wraps the shared <Input>, holding the typed value locally and committing it
 * after a short debounce so the controller isn't rewritten on every keystroke.
 */
export const DebouncedInput: FC<DebouncedInputProps> = ({
  type,
  value,
  onCommit,
  label,
  placeholder,
  className,
  min,
  max,
}) => {
  const [local, setLocal] = useState(value);
  const [lastSeen, setLastSeen] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync down when the committed value changes externally (e.g. clear/back).
  if (value !== lastSeen) {
    setLastSeen(value);
    setLocal(value);
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocal(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLastSeen(next);
      onCommit(next);
    }, DEBOUNCE_MS);
  };

  return (
    <Input
      type={type}
      label={label}
      value={local}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      min={min}
      max={max}
    />
  );
};

export default DebouncedInput;
