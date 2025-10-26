import { useEffect } from "react";

type ToastMessageProps = {
  isVisible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

const ToastMessage = ({ isVisible, message, type = "info", onClose }: ToastMessageProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const colorMap = {
    success: "bg-green-600 border-green-400",
    error: "bg-red-600 border-red-400",
    info: "bg-blue-600 border-blue-400",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg text-white shadow-lg border ${colorMap[type]} animate-fade-in`}
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {message}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ToastMessage;
