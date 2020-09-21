import * as dotenv from 'dotenv';
dotenv.config();
import {resolve} from 'path';
import * as hapi from '@hapi/hapi';
import * as inert from '@hapi/inert';
// @ts-ignore
import * as graphi from 'graphi';
// @ts-ignore
import * as blipp from 'blipp';
import {schema} from './database/schema';

(async () => {
  const publicPath = resolve(__dirname, '..', 'src', 'public');
  const server: hapi.Server = hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    debug: false,
  });

  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization']
    }
  });
  await server.register(blipp);
  await server.register(inert);
  await server.register({
    plugin: graphi,
    options: {
      schema
    }
  });

  server.route({
    method: 'graphql',
    path: '/graphql',
    handler: async (request: hapi.Request, response: hapi.ResponseToolkit) => {
      request.logger.log('Hitting GraphQL handler');
      return {};
    }
  });

  server.route({
    method: 'GET',
    path: '/js/{any*}',
    handler: {
      directory: {
        path: resolve(publicPath, 'js'),
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/stylesheets/{any*}',
    handler: {
      directory: {
        path: resolve(publicPath, 'stylesheets'),
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request: hapi.Request, response: hapi.ResponseToolkit) => {
      return response.file(
          resolve(__dirname, '..', 'src', 'views', 'index.html')
      );
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
})();

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});
