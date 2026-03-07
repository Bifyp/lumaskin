// lib/logger.ts
// Pino логер — единственный инстанс на всё приложение

import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    // В проде — JSON, в dev — красивый вывод через pino-pretty
    ...(isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:HH:MM:ss',
              ignore: 'pid,hostname',
            },
          },
        }
      : {}),
    // Добавляем сервис в каждый лог
    base: { service: 'app' },
    // Redact чувствительных полей
    redact: {
      paths: ['*.password', '*.token', '*.secret', '*.authorization', 'req.headers.cookie'],
      censor: '[REDACTED]',
    },
    serializers: {
      err: pino.stdSerializers.err,
    },
  },
);

// Дочерние логеры для разных модулей
export const authLogger    = logger.child({ module: 'auth' });
export const dbLogger      = logger.child({ module: 'db' });
export const securityLogger = logger.child({ module: 'security' });
export const apiLogger     = logger.child({ module: 'api' });
// Добавь после последней строки:
export function createLogger(module: string) {
  return logger.child({ module });
}