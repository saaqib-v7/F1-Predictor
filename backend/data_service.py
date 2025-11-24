import fastf1
import pandas as pd
from datetime import datetime
import os




def get_next_race():
    current_year = 2025
    now = datetime.now()
    try:
        schedule = fastf1.get_event_schedule(current_year)

        remaining = schedule[schedule['EventDate'] >= now]
        if remaining.empty:
            return None
        next_race = remaining.iloc[0]
        return {
            "round": int(next_race['RoundNumber']),
            "race_name": next_race['EventName'],
            "date": next_race['EventDate'].strftime('%Y-%m-%d'),
            "time": next_race['Session1Date'].strftime('%H:%M:%S') if pd.notna(next_race['Session1Date']) else "00:00:00",
            "circuit_name": next_race['Location'],
            "location": next_race['Country']
        }
    except Exception as e:
        print(f"Error fetching next race: {e}")
        return None

def get_driver_standings():


    current_year = 2025
    now = datetime.now()
    try:
        schedule = fastf1.get_event_schedule(current_year)
        completed = schedule[schedule['EventDate'] < now]
        
        if completed.empty:
            return []

        last_event = completed.iloc[-1]
        session = fastf1.get_session(current_year, last_event['RoundNumber'], 'R')
        session.load()
        results = session.results
        
        standings = []
        for i, row in results.iterrows():
            standings.append({
                "position": int(row['Position']) if pd.notna(row['Position']) else 0,
                "points": float(row['Points']),
                "wins": 0,
                "driver": {
                    "driver_id": str(row['DriverId']),
                    "code": str(row['Abbreviation']),
                    "url": "",
                    "given_name": row['BroadcastName'].split(" ")[0] if " " in row['BroadcastName'] else row['BroadcastName'],
                    "family_name": row['BroadcastName'].split(" ")[-1] if " " in row['BroadcastName'] else "",
                    "date_of_birth": "",
                    "nationality": "",
                    "permanent_number": str(row['DriverNumber'])
                },
                "constructors": [{
                    "constructor_id": str(row['TeamId']),
                    "url": "",
                    "name": str(row['TeamName']),
                    "nationality": ""
                }]
            })
        return {
            "race_name": last_event['EventName'],
            "round": int(last_event['RoundNumber']),
            "season": current_year,
            "standings": standings
        }
    except Exception as e:
        print(f"Error fetching standings: {e}")
        return {
            "race_name": "Unknown Race",
            "round": 0,
            "season": current_year,
            "standings": []
        }

def get_race_data(year, round_num):
    try:
        session = fastf1.get_session(year, round_num, 'R')
        session.load()
        return session
    except Exception as e:
        print(f"Error fetching race data: {e}")
        return None
