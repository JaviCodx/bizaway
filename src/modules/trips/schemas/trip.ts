import { Static, Type } from "@fastify/type-provider-typebox";

export enum AirportCode {
  ATL = "ATL",
  PEK = "PEK",
  LAX = "LAX",
  DXB = "DXB",
  HND = "HND",
  ORD = "ORD",
  LHR = "LHR",
  PVG = "PVG",
  CDG = "CDG",
  DFW = "DFW",
  AMS = "AMS",
  FRA = "FRA",
  IST = "IST",
  CAN = "CAN",
  JFK = "JFK",
  SIN = "SIN",
  DEN = "DEN",
  ICN = "ICN",
  BKK = "BKK",
  SFO = "SFO",
  LAS = "LAS",
  CLT = "CLT",
  MIA = "MIA",
  KUL = "KUL",
  SEA = "SEA",
  MUC = "MUC",
  EWR = "EWR",
  MAD = "MAD",
  HKG = "HKG",
  MCO = "MCO",
  PHX = "PHX",
  IAH = "IAH",
  SYD = "SYD",
  MEL = "MEL",
  GRU = "GRU",
  YYZ = "YYZ",
  LGW = "LGW",
  BCN = "BCN",
  MAN = "MAN",
  BOM = "BOM",
  DEL = "DEL",
  ZRH = "ZRH",
  SVO = "SVO",
  DME = "DME",
  JNB = "JNB",
  ARN = "ARN",
  OSL = "OSL",
  CPH = "CPH",
  HEL = "HEL",
  VIE = "VIE",
}

const example = {
  origin: "SYD",
  destination: "GRU",
  cost: 625,
  duration: 5,
  type: "flight",
  id: "a749c866-7928-4d08-9d5c-a6821a583d1a",
  display_name: "from SYD to GRU by flight",
};

export enum TripTypes {
  flight = "flight",
  train = "train",
  car = "car",
}

export enum TripSortBy {
  cost = "cost",
  duration = "duration",
}

export enum TripSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const TripDestination = Type.String({
  maxLength: 3,
  minLength: 3,
  description: "Destination IATA 3 Code",
  examples: ["JFK", "MAD", "LAX"],
});

export const TripOrigin = Type.String({
  maxLength: 3,
  minLength: 3,
  description: "Origin IATA 3 Code",
  examples: ["ATL", "PEK", "LAX"],
});


export const TripType = Type.Enum(TripTypes, {
    examples: [TripTypes.flight, TripTypes.train, TripTypes.car],
    description: "Transportation type",
  })

export const Trip = Type.Object(
  {
    destination: TripDestination,
    origin: TripOrigin,
    cost: Type.Number({ minimum: 0, description: "Cost in EUR" }),
    duration: Type.Number({ minimum: 0, description: "Duration in minutes" }),
    type: TripType,
    id: Type.String(),
    display_name: Type.String(),
  },
  { examples: [example] }
);

export type Trip = Static<typeof Trip>;
