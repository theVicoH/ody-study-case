const STORAGE_KEY = "ody.restaurant-models.v1";

type ModelMap = Record<string, string>;

const isBrowser = typeof window !== "undefined";

function read(): ModelMap {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw ? (JSON.parse(raw) as ModelMap) : {};
  } catch {
    return {};
  }
}

function write(map: ModelMap): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private mode */
  }
}

export const restaurantModelsStorage = {
  get(restaurantId: string): string | undefined {
    return read()[restaurantId];
  },
  getAll(): ModelMap {
    return read();
  },
  set(restaurantId: string, modelId: string): void {
    const map = read();

    map[restaurantId] = modelId;
    write(map);
  },
  remove(restaurantId: string): void {
    const map = read();

    delete map[restaurantId];
    write(map);
  }
};
