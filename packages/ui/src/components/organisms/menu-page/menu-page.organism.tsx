import React, { useMemo } from "react";

import type { DataTableColumn, DataTableLabels } from "@/components/molecules/data-table/data-table.molecule";

import { DataTable } from "@/components/molecules/data-table/data-table.molecule";

export interface MenuPageDish {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  isActive: boolean;
}

export interface MenuPageMenu {
  id: string;
  name: string;
  priceCents: number;
  dishCount: number;
  isActive: boolean;
}

export interface MenuPageLabels extends DataTableLabels {
  search: string;
  sectionMenus: string;
  sectionDishes: string;
  columnName: string;
  columnCategory: string;
  columnPrice: string;
  columnDishes: string;
  columnActive: string;
  active: string;
  inactive: string;
}

interface MenuPageProps {
  menus: ReadonlyArray<MenuPageMenu>;
  dishes: ReadonlyArray<MenuPageDish>;
  labels: MenuPageLabels;
  searchQuery?: string;
}

const CENTS_PER_EURO = 100;

const formatPrice = (cents: number): string => `${(cents / CENTS_PER_EURO).toFixed(2)} €`;

const MenuPage = ({ menus, dishes, labels, searchQuery }: MenuPageProps): React.JSX.Element => {
  const menuColumns = useMemo<ReadonlyArray<DataTableColumn<MenuPageMenu>>>(
    () => [
      { id: "name", header: labels.columnName, cell: (m) => m.name, sort: { getValue: (m) => m.name } },
      {
        id: "price",
        header: labels.columnPrice,
        cell: (m) => formatPrice(m.priceCents),
        sort: { getValue: (m) => m.priceCents }
      },
      { id: "dishes", header: labels.columnDishes, cell: (m) => m.dishCount, sort: { getValue: (m) => m.dishCount } },
      {
        id: "active",
        header: labels.columnActive,
        cell: (m) => (m.isActive ? labels.active : labels.inactive)
      }
    ],
    [labels]
  );

  const dishColumns = useMemo<ReadonlyArray<DataTableColumn<MenuPageDish>>>(
    () => [
      { id: "name", header: labels.columnName, cell: (d) => d.name, sort: { getValue: (d) => d.name } },
      { id: "category", header: labels.columnCategory, cell: (d) => d.category },
      {
        id: "price",
        header: labels.columnPrice,
        cell: (d) => formatPrice(d.priceCents),
        sort: { getValue: (d) => d.priceCents }
      },
      { id: "active", header: labels.columnActive, cell: (d) => (d.isActive ? labels.active : labels.inactive) }
    ],
    [labels]
  );

  return (
    <div className="gap-3xl flex h-full flex-col">
      <section className="flex min-h-0 flex-1 flex-col">
        <h3 className="typo-overline text-muted-foreground mb-xl">{labels.sectionMenus}</h3>
        <DataTable<MenuPageMenu>
          data={menus}
          columns={menuColumns}
          rowKey={(m) => m.id}
          labels={labels}
          searchQuery={searchQuery}
          getSearchableText={(m) => m.name}
        />
      </section>
      <section className="flex min-h-0 flex-1 flex-col">
        <h3 className="typo-overline text-muted-foreground mb-xl">{labels.sectionDishes}</h3>
        <DataTable<MenuPageDish>
          data={dishes}
          columns={dishColumns}
          rowKey={(d) => d.id}
          labels={labels}
          searchQuery={searchQuery}
          getSearchableText={(d) => `${d.name} ${d.category}`}
        />
      </section>
    </div>
  );
};

export { MenuPage };
