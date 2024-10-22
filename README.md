# Bizaway

A TypeScript-based REST API built with Fastify for managing trips and travel-related data.

## Considerations

I reached 429 status in the API provided trying to scrape the trips so I decided to seed a local database with some data that has the same structure as the returned from the API.

Project API is not protected with api keys or tokens, so you can use it freely. Although, it has rate limiting implemented.


## Going further

Some improvements can be made to the project for it to be a production-ready project:

1. Add more testing
2. Cache of heavy queries like searching all db for fastest and cheapest trips without origin or destination, there are indexes in place but we could improve performance by caching and deduping requests
3. Build auth



## Technologies

- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: SQLite
- **Documentation**: Swagger/OpenAPI

## Features

- RESTful API endpoints for trip management
- API documentation with Swagger
- Rate limiting for API protection
- Database seeding functionality
- Data scraping capabilities
- CORS support

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker (optional)


## Development

A devcontainer matching the requisites is provided for VSCode, but you can use any editor of your choice.

Start the development server:
```bash
npm run dev
```

The server will start on port 3000 with hot-reload enabled.

## Testing

Start test sutite:
```bash
npm run test
```

Only one test is available for now, but more can be added.

## Docker Support


Build and run separately:
```bash
docker build -t bizaway .
docker run -p 3000:3000 bizaway
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run scrapper:init` - Initialize scraper
- `npm run seeder` - Run database seeder

## API Endpoints

Api documentation is avaiable at `/docs`


## Database

The project uses SQLite as its database. The database file is located in the `db` directory. Some data is already seeded in the database, but you can use the seeder to populate it with more trips.

The seeder will insert around 10k trips, you can alter its parameters inside the script and also by applying a factor as script argument

To use seeder:

```bash
npm run seeder
```

Use seeder with a factor multipler so 4 with generate  around 4 * 10k with initial setup
```bash
npm run seeder -- 4
```