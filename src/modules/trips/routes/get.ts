import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import {
  Trip,
  TripDestination,
  TripOrigin,
  TripSortBy,
  TripSortDirection,
  TripType,
  TripTypes,
} from "@/modules/trips/schemas/trip.js";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    "/",

    {
      schema: {
        tags: ["Trips"],
        summary: "Get trips",
        description: "Get trips",
        querystring: Type.Object(
          {
            destination: Type.Optional(TripDestination),
            origin: Type.Optional(TripOrigin),
            sort_by: Type.Optional(Type.Enum(TripSortBy)),
            sort: Type.Optional(
              Type.Enum(TripSortDirection, { default: TripSortDirection.ASC })
            ),
            type: Type.Optional(TripType),
            limit: Type.Optional(Type.Number({ minimum: 1, default: 100 })),
            offset: Type.Optional(Type.Number({ minimum: 0, default: 0 })),
          },
          {
            examples: [
              {
                destination: "ATL",
                origin: "BCN",
                sort: "ASC",
                sort_by: "cost",
              },
              { destination: "PEK", origin: "BCN" },
            ],
          }
        ),

        response: {
          200: Type.Array(Trip),
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
    async (request) => {
      const { origin, destination, sort_by, sort, limit, offset, type } =
        request.query;


        const where = buildWhereClause({origin, destination, type});
        const order = buildOrderClause({sort_by, sort});
        
        const query = `
          SELECT * 
          FROM trips 
          ${where.clause}
          ${order}
          ${buildPaginationClause()}
        `.trim();
        
        const findStm = fastify.db.prepare(query);
        
        // Combine where clause params with pagination params
        const params = [...where.params, limit, offset];
        
        return findStm.all(params);
    }
  );
}


type WhereClauseResult = {
    clause: string;
    params: (string | number)[];
  }
  

  const buildWhereClause = ({ origin, destination, type }: {origin?: string, destination?: string, type?: TripTypes}): WhereClauseResult => {
    const conditions: string[] = [];
    const params: (string | number)[] = [];
  
    if (origin) {
      conditions.push('origin = ?');
      params.push(origin);
    }
  
    if (destination) {
      conditions.push('destination = ?');
      params.push(destination);
    }
  
    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }
  
    if (conditions.length === 0) {
      return { clause: '', params: [] };
    }
  
    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params
    };
  };
  
  const buildOrderClause = ({ sort_by, sort }: { sort_by?: TripSortBy, sort?: TripSortDirection }): string => {
    return sort_by ? `ORDER BY ${sort_by} ${sort}` : '';
  };
  
  const buildPaginationClause = (): string => {
    return 'LIMIT ? OFFSET ?';
  };