import React, { memo } from "react";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const ALERT_STYLES = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    button: "text-green-600 hover:text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    button: "text-red-600 hover:text-red-800",
  },
} as const;

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  onClose,
}) => {
  const styles = ALERT_STYLES[type];

  return (
    <div
      className={`mb-4 p-4 ${styles.bg} border ${styles.border} rounded-lg ${styles.text} flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className={`${styles.button} ml-4 font-semibold transition-colors`}
        aria-label="Close alert"
      >
        ✕
      </button>
    </div>
  );
};

export default memo(AlertMessage);
