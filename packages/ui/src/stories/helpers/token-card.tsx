import React from "react";

interface TokenCardProps {
  preview: React.ReactNode;
  name: string;
  value: string;
  usage: string;
}

export const TokenCard = ({ preview, name, value, usage }: TokenCardProps): React.JSX.Element => (
  <div className="border-border bg-card gap-xs p-md flex flex-col rounded-lg border">
    <div className="bg-muted min-h-2xl p-sm flex items-center justify-center rounded-md">
      {preview}
    </div>
    <div className="gap-2xs flex flex-col">
      <span className="typo-code text-foreground">{name}</span>
      <span className="typo-code text-muted-foreground">{value}</span>
      <span className="typo-code text-primary">{usage}</span>
    </div>
  </div>
);
