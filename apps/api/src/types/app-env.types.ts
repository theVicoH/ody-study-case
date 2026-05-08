import type { PinoLogger } from "hono-pino";

export interface AppVariables {
  logger: PinoLogger;
}

export type AppEnv = {
  Variables: AppVariables;
};
