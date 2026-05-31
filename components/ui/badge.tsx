import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md border bg-accent/30 px-2.5 py-1 text-xs font-bold text-accent-foreground", className)}
      {...props}
    />
  );
}
