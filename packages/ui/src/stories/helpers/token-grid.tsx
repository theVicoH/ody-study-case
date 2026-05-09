import React from "react";

interface TokenGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
}

const DEFAULT_COLUMNS = 4;

const colClasses: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6"
};

export const TokenGrid = ({ children, columns = DEFAULT_COLUMNS }: TokenGridProps): React.JSX.Element => (
  <div className={`grid ${colClasses[columns]} gap-md`}>
    {children}
  </div>
);
