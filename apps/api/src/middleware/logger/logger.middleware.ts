import { pinoLogger } from "hono-pino";
import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const loggerMiddleware = pinoLogger({
  pino: pino(
    {
      level: isDev ? "debug" : "info"
    },
    isDev ? pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname"
      }
    }) : undefined
  ),
  http: {
    reqId: () => crypto.randomUUID(),
    onReqMessage: () => "incoming request",
    onResMessage: () => "request completed"
  }
});
