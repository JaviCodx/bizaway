import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import {
  Trip,
  TripDestination,
  TripOrigin,
  TripType,
} from "@/modules/trips/schemas/trip.js";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    "/",

    {
      schema: {
        tags: ["Trips"],
        summary: "Create a trip",
        description: "Create a trip",
        body: Type.Object(
          {
            destination: TripDestination,
            origin: TripOrigin,
            cost: Type.Number({ minimum: 0, description: "Cost in EUR" }),
            duration: Type.Number({
              minimum: 0,
              description: "Duration in minutes",
            }),
            type: TripType,
          },
          {
            examples: [
              {
                destination: "ATL",
                origin: "BCN",
                cost: 625,
                duration: 5,
                type: "flight",
              },
            ],
          }
        ),

        response: {
          201: Trip,
          400: Type.Object(
            {
              statusCode: Type.Number(),
              code: Type.String(),
              error: Type.String(),
              message: Type.String(),
            },
            {
              examples: [
                {
                  statusCode: 400,
                  code: "FST_ERR_VALIDATION",
                  error: "Bad Request",
                  message:
                    "querystring/sort must be equal to constant, querystring/sort must be equal to constant, querystring/sort must match a schema in anyOf",
                },
              ],
            }
          ),
          500: Type.Null(),
        },
      },
    },
    async (request, response) => {
      const { origin, destination, cost, duration, type } = request.body;

      const id = crypto.randomUUID();
      const displayName = `from ${origin} to ${destination} by ${type}`;

      const insertedTrip = fastify.db
        .prepare(
          `
    INSERT INTO trips (id, origin, destination, cost, duration, type, display_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?) 
    RETURNING *
  `
        )
        .get(id, origin, destination, cost, duration, type, displayName);

      return response.status(201).send(insertedTrip);
    }
  );
}
