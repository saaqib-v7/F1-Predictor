export interface Driver {
    driver_id: string;
    code: string;
    url: string;
    given_name: string;
    family_name: string;
    date_of_birth: string;
    nationality: string;
    permanent_number: string;
}

export interface Constructor {
    constructor_id: string;
    url: string;
    name: string;
    nationality: string;
}

export interface RaceSchedule {
    round: number;
    race_name: string;
    date: string;
    time: string;
    circuit_name: string;
    location: string;
}

export interface DriverStanding {
    position: number;
    points: number;
    wins: number;
    driver: Driver;
    constructors: Constructor[];
}

export interface StandingsResponse {
    race_name: string;
    round: number;
    season: number;
    standings: DriverStanding[];
}

export interface PredictionInput {
    driver_id: string;
    constructor_id: string;
    grid_position: number;
}

export interface PredictionOutput {
    driver_id: string;
    predicted_position: number;
    win_probability: number;
}
