import { useEffect, useState } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  inputLabel?: string;
  inputType?: string;
  initialValue?: string | number;
  showInput?: boolean;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  isOpen,
  title = "Potvrda akcije",
  message = "Da li ste sigurni?",
  confirmLabel = "Potvrdi",
  cancelLabel = "Otkaži",
  inputLabel,
  inputType = "text",
  initialValue = "",
  showInput = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const [value, setValue] = useState(initialValue.toString());

  useEffect(() => {
    setValue(initialValue.toString());
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fade-in"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-[#2a2a3d] border border-gray-600 rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm transform scale-95 animate-scale-in"
        style={{ animation: "scaleIn 0.2s ease-out forwards" }}
      >
        <h2 className="text-xl font-bold text-blue-400 mb-3 text-center">
          {title}
        </h2>
        <p className="text-gray-200 text-center mb-4">{message}</p>

        {showInput && (
          <div className="mb-6">
            {inputLabel && (
              <label className="block text-gray-300 text-sm mb-2">
                {inputLabel}
              </label>
            )}
            <input
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1e1e2f] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(value)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
