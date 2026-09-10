import React from "react";
import { cn } from "../../utils/cn";

export function EnvSyncMark({ className = "h-6 w-6", title = "EnvSync" }) {
  return <svg viewBox="0 0 32 32" role="img" aria-label={title} className={cn("text-primary", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h14.5L27 14.5l-4.5 4.5-5.25-5.25H4V6Z" fill="currentColor"/>
    <path d="M28 26H13.5L5 17.5 9.5 13l5.25 5.25H28V26Z" fill="currentColor"/>
  </svg>;
}

export function EnvSyncWordmark({ className = "" }) {
  return <span className={cn("font-semibold tracking-[-0.025em] text-foreground", className)}>EnvSync</span>;
}

export function EnvSyncLogo({ className = "", markClassName = "h-6 w-6", wordmarkClassName = "" }) {
  return <span className={cn("inline-flex items-center gap-2.5", className)}><EnvSyncMark className={markClassName}/><EnvSyncWordmark className={wordmarkClassName}/></span>;
}

export default EnvSyncMark;
