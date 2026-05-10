import React, { useCallback, useMemo } from "react";

import { useRestaurantHours, useRestaurantTables } from "@workspace/client";

import type {
  OpeningHourValue,
  SettingsTableValue,
  SheetSettingsLabels
} from "@/components/organisms/sheet-settings/sheet-settings.organism";
import type {
  ApiOpeningHour,
  ApiRestaurantTable,
  ApiTableStatus,
  ApiTableZone,
  RestaurantSettings
} from "@workspace/client";

import { SheetSettings } from "@/components/organisms/sheet-settings/sheet-settings.organism";


interface ConnectedSettingsProps {
  restaurantId: string;
  labels: SheetSettingsLabels;
  settings: RestaurantSettings;
  onDelete?: () => void;
  onSaveGeneral?: (input: { name: string; address: string; phone: string; maxCovers: number }) => Promise<void> | void;
}

const toSettingsTable = (t: ApiRestaurantTable): SettingsTableValue => ({
  id: t.id,
  number: t.number,
  name: t.name,
  capacity: t.capacity,
  zone: t.zone as ApiTableZone,
  status: t.status as ApiTableStatus,
  isActive: t.isActive
});

const toApiOpeningHours = (hours: ReadonlyArray<OpeningHourValue>): ApiOpeningHour[] =>
  hours.map((h) => ({ ...h }));

const ConnectedSettings = ({
  restaurantId,
  labels,
  settings,
  onDelete,
  onSaveGeneral
}: ConnectedSettingsProps): React.JSX.Element => {
  const hours = useRestaurantHours(restaurantId);
  const tables = useRestaurantTables(restaurantId);

  const tablesPaged = useMemo(
    () => tables.tables.map(toSettingsTable),
    [tables.tables]
  );

  const handleSaveHours = useCallback(async (next: ReadonlyArray<OpeningHourValue>): Promise<void> => {
    await hours.save(toApiOpeningHours(next));
  }, [hours]);

  const handleCreate = useCallback(async (data: Omit<SettingsTableValue, "id">): Promise<void> => {
    await tables.create({
      number: data.number,
      name: data.name ?? undefined,
      capacity: data.capacity,
      zone: data.zone,
      status: data.status,
      isActive: data.isActive
    });
  }, [tables]);

  const handleUpdate = useCallback(async (id: string, data: Omit<SettingsTableValue, "id">): Promise<void> => {
    await tables.update(id, {
      number: data.number,
      name: data.name,
      capacity: data.capacity,
      zone: data.zone,
      status: data.status,
      isActive: data.isActive
    });
  }, [tables]);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    await tables.remove(id);
  }, [tables]);

  return (
    <SheetSettings
      labels={labels}
      settings={settings}
      onDelete={onDelete}
      onSaveGeneral={onSaveGeneral}
      openingHours={hours.hours}
      onSaveOpeningHours={handleSaveHours}
      tablesPaged={tablesPaged}
      tablesPage={tables.page}
      tablesTotalPages={tables.totalPages}
      tablesTotal={tables.total}
      tablesLoading={tables.loading}
      onTablesPageChange={tables.setPage}
      onCreateTable={handleCreate}
      onUpdateTable={handleUpdate}
      onDeleteTable={handleDelete}
    />
  );
};

export { ConnectedSettings };

export type { ConnectedSettingsProps };
