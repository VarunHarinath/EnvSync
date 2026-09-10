import React from 'react';
import { cn } from '../../utils';
import { EnvSyncMark } from './Logo';

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <EnvSyncMark
      className={cn(
        "animate-pulse text-primary",
        sizes[size], 
        className
      )} 
    />
  );
}
