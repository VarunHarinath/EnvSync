export const EmptyState = ({ message, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-[#a1a1aa] mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-md hover:bg-[#e4e4e7] transition-colors font-medium text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
