import RateLimiter from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function rateLimiterPlugin(fastify: FastifyInstance) {
  await fastify.register(RateLimiter, {
    max: 100,
    timeWindow: "1 minute",
  });
}

export default fp(rateLimiterPlugin, {
  name: "rateLimiter",
});
