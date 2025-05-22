import { webnodeOptionsSchema } from './webnode-options';

export const webnodeOptionsWithDefaultsSchema = webnodeOptionsSchema.extend({
  port: webnodeOptionsSchema.shape.port.default(3000),
  secure: webnodeOptionsSchema.shape.secure.default(false),
  environment: webnodeOptionsSchema.shape.environment.default('development'),
  baseDomain: webnodeOptionsSchema.shape.baseDomain.default('localhost'),
  logger: webnodeOptionsSchema.shape.logger.default({
    development: {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    },
    production: undefined,
  }),
  bodyParsers: webnodeOptionsSchema.shape.bodyParser.default({
    jsonLimit: '1mb',
    urlEncodedLimit: '1mb',
    extended: true,
  }),
});
