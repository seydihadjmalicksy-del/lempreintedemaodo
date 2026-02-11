/**
 * Delete Confirmation Modal Component
 */
import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  loading,
  t 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-[#004D33]">{t.confirmDelete}</h3>
        </div>
        <p className="text-[#4A4A4A] mb-6">
          Cette action est irréversible. Voulez-vous continuer ?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            data-testid="cancel-delete-btn"
          >
            {t.no}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            data-testid="confirm-delete-btn"
          >
            {loading ? "..." : t.yes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
