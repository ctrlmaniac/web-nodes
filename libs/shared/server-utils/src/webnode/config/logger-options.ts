export const DEFAULT_LOGGER_OPTIONS = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
  production: undefined,
};
