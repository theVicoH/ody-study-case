import React from "react";

import type { StatusDotProps } from "@/components/atoms/status-dot/status-dot.atom";

import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { Caption } from "@/components/atoms/typography/typography.atom";
import { Badge } from "@/components/ui/badge";


interface RestaurantLabelProps {
  name: string;
  address: string;
  status: StatusDotProps["status"];
}

const RestaurantLabel = ({ name, address, status }: RestaurantLabelProps): React.JSX.Element => (
  <>
    <Badge variant="secondary" className="rs-label-badge">
      <StatusDot status={status} size="sm" />
      {name}
    </Badge>
    <Caption className="rs-label-addr">{address}</Caption>
  </>
);

export { RestaurantLabel };

export type { RestaurantLabelProps };
