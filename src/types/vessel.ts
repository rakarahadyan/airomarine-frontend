export interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  callSign?: string;
  imo?: string;
  shipType: VesselType;
  latitude: number;
  longitude: number;
  course: number; // COG - Course Over Ground
  speed: number; // SOG - Speed Over Ground
  heading: number; // True heading
  navStatus: NavigationStatus;
  destination?: string;
  eta?: string;
  length?: number;
  width?: number;
  draught?: number;
  lastUpdate: Date;
}

export enum VesselType {
  CARGO = 'cargo',
  TANKER = 'tanker',
  PASSENGER = 'passenger',
  FISHING = 'fishing',
  TUG = 'tug',
  MILITARY = 'military',
  SAILING = 'sailing',
  PLEASURE = 'pleasure',
  HIGH_SPEED = 'high_speed',
  PILOT = 'pilot',
  SAR = 'sar',
  OTHER = 'other',
}

export enum NavigationStatus {
  UNDERWAY_ENGINE = 0,
  AT_ANCHOR = 1,
  NOT_UNDER_COMMAND = 2,
  RESTRICTED_MANEUVERABILITY = 3,
  CONSTRAINED_BY_DRAUGHT = 4,
  MOORED = 5,
  AGROUND = 6,
  FISHING = 7,
  UNDERWAY_SAILING = 8,
  RESERVED_HSC = 9,
  RESERVED_WIG = 10,
  RESERVED_1 = 11,
  RESERVED_2 = 12,
  RESERVED_3 = 13,
  AIS_SART = 14,
  NOT_DEFINED = 15,
}

export interface VesselFilter {
  types?: VesselType[];
  status?: NavigationStatus[];
  searchQuery?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface VesselTrack {
  vesselId: string;
  positions: {
    latitude: number;
    longitude: number;
    timestamp: Date;
    speed: number;
    course: number;
  }[];
}