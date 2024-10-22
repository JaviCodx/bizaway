import { AirportCode, Trip } from "@/modules/trips/schemas/trip.js";
import fs from "fs";
import pLimit from 'p-limit';

async function fetchTrips(origin: AirportCode, destination: AirportCode) {
  const res = await fetch(
    `https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips?destination=${destination}&origin=${origin}`,
    {
      headers: {
        "x-api-key": ``,
      },
    }
  );

  const trips = (await res.json()) as Trip[];
  return trips;
}



async function fetchFullTrips(origin: AirportCode) {
  console.log(`Fetching trips from ${origin}`);
  const filePath = `./tmp/${origin}.json`;
  const data: Trip[] = [];
  for (const otherAirport of Object.values(AirportCode).filter(
    (v) => v !== origin
  )) {
    const trips = await fetchTrips(origin, otherAirport);
    if(!trips.length) {console.log(trips)}
    console.log(`Found ${trips.length} trips from ${origin} to ${otherAirport}`);
    data.push(...(trips || []));
  }

 
  console.log(`Writing ${data.length} trips to ${filePath}`);
  fs.writeFileSync(filePath, JSON.stringify(data));

}

async function main() {
  fs.rmSync("tmp", { recursive: true, force: true });

  if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
  }


  const limit = pLimit(2);


  const promises:Promise<void>[] =[]
  for (const airport of Object.values(AirportCode)) {
   
    promises.push(limit(()=>fetchFullTrips(airport)))
  }

  await Promise.all(promises);

}

main();
