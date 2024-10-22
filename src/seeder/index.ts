import { AirportCode, Trip, TripTypes } from "@/modules/trips/schemas/trip.js";
import fs from "fs";
import crypto from "node:crypto";
import Database from "better-sqlite3";

if (!fs.existsSync("db")) {
  fs.mkdirSync("db");
}

const tripsDb = new Database("db/trips.db");

function createTripsTable() {
  tripsDb.transaction(() => {
    tripsDb.exec(`
          CREATE TABLE IF NOT EXISTS trips (
            id TEXT PRIMARY KEY,
            origin TEXT NOT NULL CHECK (length(origin) = 3),
            destination TEXT NOT NULL CHECK (length(destination) = 3),
            cost INTEGER NOT NULL CHECK (cost >= 0),
            duration INTEGER NOT NULL CHECK (duration > 0),
            type TEXT NOT NULL CHECK (type IN ('${TripTypes.flight}', '${TripTypes.train}', '${TripTypes.car}')),
            display_name TEXT NOT NULL
          );
      
          -- Origin + Destination + Cost (for finding cheapest trips between cities)
          CREATE INDEX IF NOT EXISTS idx_trips_origin_dest_cost 
          ON trips(origin, destination, cost);

          -- Origin + Destination + Duration (for finding fastest trips between cities)
          CREATE INDEX IF NOT EXISTS idx_trips_origin_dest_duration 
          ON trips(origin, destination, duration);

          -- Type + Duration (for finding fastest trips by transport type)
          CREATE INDEX IF NOT EXISTS idx_trips_type_duration 
          ON trips(type, duration);

          -- Origin + Destination + Type (for finding trips between cities by transport type)
          CREATE INDEX IF NOT EXISTS idx_trips_origin_dest_type 
          ON trips(origin, destination, type);
        `);
  })();

  // Optional: Pragmas to optimize performance
  tripsDb.pragma("journal_mode = WAL");
  tripsDb.pragma("synchronous = NORMAL");
}

function randomType() {
  const types = [TripTypes.flight, TripTypes.train, TripTypes.car];

  return types[Math.floor(Math.random() * types.length)];
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDestinationAirports({
  origin,
  minDestinationAirports = 1,
  maxDestinationAirports = 5,
  minTripsByDestinationAirport = 1,
  maxTripsByDestinationAirport = 5,
}: {
  origin: AirportCode;
  minDestinationAirports?: number;
  maxDestinationAirports?: number;
  minTripsByDestinationAirport?: number;
  maxTripsByDestinationAirport?: number;
}) {
  // Get possible destinations by filtering out the origin airport
  const possibleDestinations = Object.values(AirportCode).filter(
    (a) => a !== origin
  );

  const numAirports = randomIntFromInterval(
    minDestinationAirports,
    maxDestinationAirports
  );

  // Shuffle and slice the array to get random airports
  const randomDestinations = possibleDestinations
    .sort(() => Math.random() - 0.5)
    .slice(0, numAirports);

  const tripsByAirport = randomDestinations.map((destination) => {
    const numTrips = randomIntFromInterval(
      minTripsByDestinationAirport,
      maxTripsByDestinationAirport
    );
    return Array.from({ length: numTrips }, () => {
      const type = randomType();

      return {
        origin,
        destination,
        cost: randomIntFromInterval(100, 5000),
        duration: randomIntFromInterval(1, 50),
        type: type,
        id: crypto.randomUUID(),
        display_name: `from ${origin} to ${destination} by ${type}`,
      };
    });
  });

  return tripsByAirport.flat();
}

function seedTrips() {
  const seed: Trip[] = [];

  for (const airport of Object.values(AirportCode)) {
    const tripsByAirport = randomDestinationAirports({
      origin: airport,
      minDestinationAirports: 20,
      maxDestinationAirports: 40,
      minTripsByDestinationAirport: 3,
      maxTripsByDestinationAirport: 10,
    });
    seed.push(...tripsByAirport);
  }

  console.log(
    "Generated seed of " + seed.length + " trips, inserting into database..."
  );
  createTripsTable();

  const insertStm = tripsDb.prepare(
    "INSERT INTO trips VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const trip of seed) {
    insertStm.run(
      trip.id,
      trip.origin,
      trip.destination,
      trip.cost,
      trip.duration,
      trip.type,
      trip.display_name
    );
  }

  const countStm = tripsDb.prepare("SELECT count(*) as count FROM trips");

  console.log("Seeding complete, total trips: " + countStm.get().count);
}

function getCountFromArgs(): number {
  const arg = process.argv[2];

  if (!arg) return 1; // default value if no argument provided

  const count = parseInt(arg, 10);
  if (isNaN(count) || count < 1) {
    console.warn("Invalid count provided. Using default of 1");
    return 1;
  }

  return count;
}

const count = getCountFromArgs();

console.log(`Seeding  factor ${count}`);
for (let i = 0; i < count; i++) {
  seedTrips();
}
