import Cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(Cors, {
    origin: false,
  });
}

export default fp(corsPlugin, {
  name: "cors",
});
