import React from "react";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Section = ({ title, description, children }: SectionProps): React.JSX.Element => (
  <div className="gap-lg flex flex-col">
    <div className="border-border gap-2xs pb-md flex flex-col border-b">
      <h2 className="typo-h3 text-foreground">{title}</h2>
      {description && <p className="typo-body-sm text-muted-foreground">{description}</p>}
    </div>
    {children}
  </div>
);
