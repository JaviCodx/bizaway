import server from "./server.js";
import GracefulServer from "@gquittet/graceful-server";
import Fastify from "fastify";

async function init() {
  const fastify = Fastify({
    logger: {
      level: "info",
      redact: ["headers.authorization"],
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname,host,remoteAddress,remotePort",
        },
      },
    },

    ajv: {
      customOptions: {
        keywords: ["example"],
      },
    },
  });

  await server(fastify);

  fastify.log.info("Routes: ");
  fastify.log.info(fastify.printRoutes());

  const gracefulServer = GracefulServer(fastify.server, {
    closePromises: [],
  });

  gracefulServer.on(GracefulServer.READY, () => {
    fastify.log.info("Server is ready");
  });

  gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
    fastify.log.info("Server is shutting down");
  });

  gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
    fastify.log.info("Server is down because of", error.message);
  });

  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    gracefulServer.setReady();
  } catch (error) {
    fastify.log.error(error);
    // eslint-disable-next-line n/no-process-exit,unicorn/no-process-exit
    process.exit(1);
  }
}

init();
