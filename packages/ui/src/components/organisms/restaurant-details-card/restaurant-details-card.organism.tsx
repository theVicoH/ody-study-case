import React from "react";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface RestaurantDetailsCardLabels {
  title: string;
  type: string;
  phone: string;
  capacity: string;
  services: string;
  tableService: string;
  clickAndCollect: string;
  coversUnit: (count: number) => string;
}

interface RestaurantDetailsCardProps {
  labels: RestaurantDetailsCardLabels;
  restaurantType: string;
  phone?: string;
  maxCovers?: number;
  tableService?: boolean;
  clickAndCollect?: boolean;
}

const stripWhitespace = (value: string): string => value.replace(/\s+/g, "");

const RestaurantDetailsCard = ({
  labels,
  restaurantType,
  phone,
  maxCovers,
  tableService,
  clickAndCollect
}: RestaurantDetailsCardProps): React.JSX.Element | null => {
  const hasService = tableService === true || clickAndCollect === true;
  const hasContent = phone !== undefined || maxCovers !== undefined || hasService;

  if (!hasContent) {
    return null;
  }

  return (
    <Card size="sm">
      <CardHeader className="border-b !pb-2">
        <CardTitle className="typo-caption">{labels.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-xs">
        <dl className="divide-border/60 typo-caption divide-y">
          <div className="py-xs gap-sm flex items-center justify-between">
            <dt><Muted className="typo-caption">{labels.type}</Muted></dt>
            <dd className="text-foreground typo-caption truncate">{restaurantType}</dd>
          </div>
          {phone !== undefined && (
            <div className="py-xs gap-sm flex items-center justify-between">
              <dt><Muted className="typo-caption">{labels.phone}</Muted></dt>
              <dd>
                <a
                  href={`tel:${stripWhitespace(phone)}`}
                  className="text-foreground typo-caption truncate hover:underline"
                >
                  {phone}
                </a>
              </dd>
            </div>
          )}
          {maxCovers !== undefined && (
            <div className="py-xs gap-sm flex items-center justify-between">
              <dt><Muted className="typo-caption">{labels.capacity}</Muted></dt>
              <dd className="text-foreground typo-caption truncate">{labels.coversUnit(maxCovers)}</dd>
            </div>
          )}
          {hasService && (
            <div className="py-xs gap-sm flex items-center justify-between">
              <dt><Muted className="typo-caption">{labels.services}</Muted></dt>
              <dd className="gap-xs flex flex-wrap justify-end">
                {tableService === true && <Badge variant="secondary">{labels.tableService}</Badge>}
                {clickAndCollect === true && <Badge variant="secondary">{labels.clickAndCollect}</Badge>}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export { RestaurantDetailsCard };

export type { RestaurantDetailsCardProps, RestaurantDetailsCardLabels };
