import React from "react";

import { SearchIcon } from "@/components/icons/search/search.icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const SEARCH_ICON_SIZE = 16;

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput = ({ value, onChange, placeholder, className }: SearchInputProps): React.JSX.Element => (
  <div className={cn("relative", className)}>
    <span className="text-muted-foreground left-sm pointer-events-none absolute top-1/2 -translate-y-1/2">
      <SearchIcon size={SEARCH_ICON_SIZE} isAnimated={false} />
    </span>
    <Input
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-2xl"
    />
  </div>
);

export { SearchInput };

export type { SearchInputProps };
