import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import Autoload from "@fastify/autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function createServer(fastify: FastifyInstance) {
 
  await fastify.register(Autoload, {
    dir: join(__dirname, "plugins"),
  });

  await fastify.register(Autoload, {
    dir: join(__dirname, "modules"),
    encapsulate: false,
    maxDepth: 1,
  });

  return fastify.withTypeProvider<TypeBoxTypeProvider>();
}
