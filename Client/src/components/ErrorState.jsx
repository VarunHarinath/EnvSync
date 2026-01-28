import { AlertCircle } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-[#e4e4e7] mb-6">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] transition-colors font-medium text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};
