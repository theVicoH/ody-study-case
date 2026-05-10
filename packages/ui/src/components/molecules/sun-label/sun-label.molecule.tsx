import React from "react";

import { H1 } from "@/components/atoms/typography/typography.atom";
import { Button } from "@/components/ui/button";

export interface SunLabelProps {
  brand: string;
  cta: string;
}

const SunLabel = ({ brand, cta }: SunLabelProps): React.JSX.Element => (
  <div className="rs-sun-label">
    <H1 className="rs-sun-brand">{brand}</H1>
    <Button
      variant="default"
      tabIndex={-1}
      className="rs-sun-cta mt-md pointer-events-none"
    >
      {cta}
    </Button>
  </div>
);

export { SunLabel };
