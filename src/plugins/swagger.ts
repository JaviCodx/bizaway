import Swagger from '@fastify/swagger';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import ScalarApiReference from '@scalar/fastify-api-reference'

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Trips API Doc',
        description:
          'Trips API Doc',
        version: process.env.npm_package_version ?? '0.0.0',
      },
    },
  
  });

  await fastify.register(ScalarApiReference, {
    routePrefix: '/docs',
    // Additional hooks for the API reference routes. You can provide the onRequest and preHandler hooks
   
  })

  fastify.log.info(`Swagger documentation is available at /docs`);
}

export default fp(swaggerGeneratorPlugin, {
  name: 'swaggerGenerator',
});