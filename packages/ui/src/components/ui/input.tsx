import * as React from "react";

import { Input as InputPrimitive } from "@base-ui/react/input";


import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-border/50 text-foreground file:text-foreground placeholder:text-muted-foreground focus-visible:border-border aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 w-full min-w-0 rounded-4xl border bg-white/10 px-3 py-1 text-base shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_8px_0_rgba(0,0,0,0.04)] backdrop-blur-md backdrop-saturate-150 transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-white/10 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

export { Input };
