from pydantic import BaseModel
from typing import List, Optional, Dict

class Driver(BaseModel):
    driver_id: str
    code: str
    url: str
    given_name: str
    family_name: str
    date_of_birth: str
    nationality: str
    permanent_number: str

class Constructor(BaseModel):
    constructor_id: str
    url: str
    name: str
    nationality: str

class Race(BaseModel):
    season: int
    round: int
    url: str
    race_name: str
    circuit_id: str
    date: str
    time: str

class PredictionInput(BaseModel):
    driver_id: str
    constructor_id: str
    grid_position: int

class PredictionOutput(BaseModel):
    driver_id: str
    predicted_position: int
    win_probability: float
    podium_probability: float
    confidence: float


class RaceSchedule(BaseModel):
    round: int
    race_name: str
    date: str
    time: str
    circuit_name: str
    location: str

class DriverStanding(BaseModel):
    position: int
    points: float
    wins: int
    driver: Driver
    constructors: List[Constructor]

class StandingsResponse(BaseModel):
    race_name: str
    round: int
    season: int
    standings: List[DriverStanding]
