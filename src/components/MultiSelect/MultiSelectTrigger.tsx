import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import type { MultiSelectTriggerProps } from "./MultiSelect.types";
import styles from "./MultiSelect.module.css";

export const MultiSelectTrigger: FC<MultiSelectTriggerProps> = ({
  triggerRef,
  selectClass,
  isOpen,
  disabled,
  displayText,
  selectedOptions,
  onToggleOpen,
  onRemoveTag,
}) => (
  <div
    ref={triggerRef}
    className={selectClass}
    onClick={onToggleOpen}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggleOpen();
      }
    }}
  >
    <div className={styles.tagsContainer}>
      {displayText ? (
        <span className={styles.placeholder}>{displayText}</span>
      ) : (
        selectedOptions.map((option) => (
          <span key={option.value} className={styles.tag}>
            {option.label}
            <button
              type="button"
              onClick={(e) => onRemoveTag(option.value, e)}
              className={styles.tagRemove}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </span>
        ))
      )}
    </div>

    <FontAwesomeIcon
      icon={faChevronDown}
      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
    />
  </div>
);
