import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().delete(
    "/:id",

    {
      schema: {
        tags: ["Trips"],
        summary: "Delete a trip",
        description: "Delete a trip",
        params: Type.Object(
          {
            id: Type.String(),
          },
          {
            examples: [
              {
                id: "a749c866-7928-4d08-9d5c-a6821a583d1a",
              },
            ],
          }
        ),

        response: {
          204: Type.Null(),
          404: Type.Null(),
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
      const { id } = request.params;

      const existingTrip = fastify.db
        .prepare("SELECT id FROM trips WHERE id = ?")
        .get(id);

      if (!existingTrip) {
        response.code(404).send();
        return;
      }

      const deleteStm = fastify.db.prepare("DELETE FROM trips WHERE id = ?");

      deleteStm.run(id);

      response.code(204).send();
    }
  );
}
