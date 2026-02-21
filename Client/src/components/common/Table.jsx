import React from 'react';
import { cn } from '../../utils';
import LoadingSpinner from './LoadingSpinner';

export default function Table({ 
  columns, 
  data, 
  isLoading, 
  onRowClick,
  className 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
     // Let parent handle empty state usually, but we could render a default one if needed.
     // For now, render table with no rows? Or just return null?
     // Better to render the header at least.
  }

  return (
    <div className={cn("w-full overflow-auto rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <table className="w-full caption-bottom text-sm text-left">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "h-10 px-4 align-middle font-medium text-muted-foreground bg-muted/20",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn("p-4 align-middle", col.className)}
                  >
                    {col.render ? col.render(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
             <tr>
               <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                 No data found.
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
