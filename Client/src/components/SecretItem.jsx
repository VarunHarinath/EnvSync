import { useDraggable } from '@dnd-kit/core';
import { Lock } from 'lucide-react';

export const SecretItem = ({ secret }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: secret.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 bg-[#27272a] border border-[#3f3f46] rounded-md cursor-grab active:cursor-grabbing hover:border-white hover:bg-[#3f3f46] transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Lock size={16} className="text-white" />
        <span className="text-sm font-medium text-white">{secret.name}</span>
      </div>
    </div>
  );
};
