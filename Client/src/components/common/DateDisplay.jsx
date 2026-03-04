import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

export default function DateDisplay({ date, className }) {
  if (!date) return <span className="text-muted-foreground">-</span>;

  const formatted = formatDate(date);
  const fullDate = new Date(date).toLocaleString();

  return (
    <div 
      className={cn("flex items-center gap-1.5 text-muted-foreground group/date cursor-default", className)}
      title={fullDate}
    >
      <Clock className="h-3 w-3 transition-colors group-hover/date:text-indigo-500" />
      <span className="text-xs transition-colors group-hover/date:text-foreground">
        {formatted}
      </span>
    </div>
  );
}
