type QueryValue = string | number | boolean | null | undefined;

const encode = (value: string): string => encodeURIComponent(value);

export const buildQuery = (params: Readonly<Record<string, QueryValue>>): string => {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    parts.push(`${encode(key)}=${encode(String(value))}`);
  }

  return parts.length === 0 ? "" : `?${parts.join("&")}`;
};
