import Database from "better-sqlite3";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
  }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  const db = new Database("db/trips.db");
  // Optional: Configure pragmas for better performance
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");

  // Decorating fastify with db instance
  fastify.decorate("db", db);

  // Close database connection when fastify closes
  fastify.addHook("onClose", async (instance) => {
    instance.db.close();
  });
};

export default fp(dbPlugin, { name: "database" });
