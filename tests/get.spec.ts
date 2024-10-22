import createServer from "../src/server.js";
import { test } from "node:test";
import assert from "assert";

import Fastify from "fastify";

const fastify = Fastify();
const app = await createServer(fastify);

test("GET /trips gets some data", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/trips",
  });

  const data = response.json();
  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(data?.length > 0, true);
});

test("GET /trips gets data by origin and destination", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/trips",
    query: {
      origin: "MAD",
      destination: "BCN",
    },
  });

  const data = response.json();
  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(
    data.every((trip) => trip.origin === "MAD" && trip.destination === "BCN"),
    true
  );
});

test("GET /trips gets data sorted by cost", async () => {
  const responseASC = await app.inject({
    method: "GET",
    url: "/trips",
    query: {
      origin: "MAD",
      destination: "BCN",
      sort_by: "cost",
      sort: "ASC",
    },
  });

  const dataASC = responseASC.json();
  assert.strictEqual(responseASC.statusCode, 200);
  assert.strictEqual(
    dataASC.every((trip, index) => {
      if (index === 0) return true;

      return dataASC[index - 1].cost <= trip.cost;
    }),

    true
  );

  const responseDSC = await app.inject({
    method: "GET",
    url: "/trips",
    query: {
      origin: "MAD",
      destination: "BCN",
      sort_by: "cost",
      sort: "DESC",
    },
  });

  const dataDSC = responseDSC.json();
  assert.strictEqual(responseDSC.statusCode, 200);
  assert.strictEqual(
    dataDSC.every((trip, index) => {
      if (index === 0) return true;

      return dataDSC[index - 1].cost >= trip.cost;
    }),

    true
  );
});


test.only("GET /trips gets data sorted by duration", async () => {
  const responseASC = await app.inject({
    method: "GET",
    url: "/trips",
    query: {
      origin: "MAD",
      destination: "BCN",
      sort_by: "duration",
      sort: "ASC",
    },
  });

  const dataASC = responseASC.json();
  assert.strictEqual(responseASC.statusCode, 200);
  assert.strictEqual(
    dataASC.every((trip, index) => {
      if (index === 0) return true;

      return dataASC[index - 1].duration <= trip.duration;
    }),

    true
  );

  const responseDSC = await app.inject({
    method: "GET",
    url: "/trips",
    query: {
      origin: "MAD",
      destination: "BCN",
      sort_by: "duration",
      sort: "DESC",
    },
  });

  const dataDSC = responseDSC.json();
  assert.strictEqual(responseDSC.statusCode, 200);
  assert.strictEqual(
    dataDSC.every((trip, index) => {
      if (index === 0) return true;

      return dataDSC[index - 1].duration >= trip.duration;
    }),

    true
  );
});
