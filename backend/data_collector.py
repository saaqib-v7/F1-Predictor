import fastf1
import pandas as pd
import numpy as np
from datetime import datetime
import os
import pickle

class F1DataCollector:
    def __init__(self, cache_dir='f1_cache'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)




        
    def collect_historical_data(self, start_year=2025, end_year=2025):
        cache_file = os.path.join(self.cache_dir, f'training_data_{start_year}_{end_year}.pkl')
        
        if os.path.exists(cache_file):
            print(f"Loading cached training data from {cache_file}")
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        
        print(f"Collecting F1 data from {start_year} to {end_year}...")
        all_race_data = []
        
        for year in range(start_year, end_year + 1):
            print(f"Processing {year} season...")
            try:
                schedule = fastf1.get_event_schedule(year)
                
                for idx, event in schedule.iterrows():
                    if event['EventFormat'] != 'conventional':
                        continue
                    
                    round_num = event['RoundNumber']
                    event_name = event['EventName']
                    
                    try:
                        print(f"  Fetching {event_name} (Round {round_num})...")
                        
                        quali_session = fastf1.get_session(year, round_num, 'Q')
                        race_session = fastf1.get_session(year, round_num, 'R')
                        
                        quali_session.load()
                        race_session.load()
                        
                        quali_results = quali_session.results
                        race_results = race_session.results
                        
                        for i, race_row in race_results.iterrows():
                            driver_abbr = race_row['Abbreviation']
                            
                            quali_row = quali_results[quali_results['Abbreviation'] == driver_abbr]
                            
                            if quali_row.empty:
                                continue
                            
                            quali_row = quali_row.iloc[0]
                            
                            grid_pos = race_row['GridPosition']
                            finish_pos = race_row['Position']
                            
                            if pd.isna(grid_pos) or pd.isna(finish_pos):
                                continue
                            
                            race_data = {
                                'year': year,
                                'round': round_num,
                                'event_name': event_name,
                                'driver': str(driver_abbr),
                                'driver_number': int(race_row['DriverNumber']) if pd.notna(race_row['DriverNumber']) else 0,
                                'team': str(race_row['TeamName']),
                                'grid_position': int(grid_pos),
                                'finish_position': int(finish_pos),
                                'points': float(race_row['Points']) if pd.notna(race_row['Points']) else 0.0,
                                'status': str(race_row['Status']) if pd.notna(race_row['Status']) else 'Unknown',
                                'q1_time': quali_row['Q1'].total_seconds() if pd.notna(quali_row['Q1']) else None,
                                'q2_time': quali_row['Q2'].total_seconds() if pd.notna(quali_row['Q2']) else None,
                                'q3_time': quali_row['Q3'].total_seconds() if pd.notna(quali_row['Q3']) else None,
                            }
                            
                            all_race_data.append(race_data)
                    
                    except Exception as e:
                        print(f"    Error processing {event_name}: {e}")
                        continue
            
            except Exception as e:
                print(f"Error processing {year} season: {e}")
                continue
        
        df = pd.DataFrame(all_race_data)
        
        with open(cache_file, 'wb') as f:
            pickle.dump(df, f)
        
        print(f"Collected {len(df)} race entries. Saved to {cache_file}")
        return df
    
    def engineer_features(self, df):
        df = df.copy()
        
        df = df.sort_values(['year', 'round', 'grid_position'])
        
        driver_stats = []
        for driver in df['driver'].unique():
            driver_df = df[df['driver'] == driver].sort_values(['year', 'round'])
            
            for idx in range(len(driver_df)):
                if idx < 3:
                    avg_finish = driver_df.iloc[:idx+1]['finish_position'].mean() if idx > 0 else 10.0
                    recent_points = driver_df.iloc[:idx+1]['points'].sum() if idx > 0 else 0.0
                else:
                    avg_finish = driver_df.iloc[idx-3:idx]['finish_position'].mean()
                    recent_points = driver_df.iloc[idx-3:idx]['points'].sum()
                
                driver_stats.append({
                    'year': driver_df.iloc[idx]['year'],
                    'round': driver_df.iloc[idx]['round'],
                    'driver': driver,
                    'avg_recent_finish': avg_finish,
                    'recent_points': recent_points
                })
        
        stats_df = pd.DataFrame(driver_stats)
        df = df.merge(stats_df, on=['year', 'round', 'driver'], how='left')
        
        team_stats = []
        for team in df['team'].unique():
            team_df = df[df['team'] == team].sort_values(['year', 'round'])
            
            for idx in range(len(team_df)):
                if idx < 3:
                    avg_finish = team_df.iloc[:idx+1]['finish_position'].mean() if idx > 0 else 10.0
                else:
                    avg_finish = team_df.iloc[idx-3:idx]['finish_position'].mean()
                
                team_stats.append({
                    'year': team_df.iloc[idx]['year'],
                    'round': team_df.iloc[idx]['round'],
                    'team': team,
                    'team_avg_finish': avg_finish
                })
        
        team_stats_df = pd.DataFrame(team_stats)
        df = df.merge(team_stats_df, on=['year', 'round', 'team'], how='left')
        
        df['finished'] = df['status'].apply(lambda x: 1 if 'Finished' in str(x) or '+' in str(x) else 0)
        
        df['grid_to_finish_delta'] = df['finish_position'] - df['grid_position']
        
        return df

if __name__ == "__main__":
    collector = F1DataCollector()
    raw_data = collector.collect_historical_data(start_year=2025, end_year=2025)
    
    print(f"\nRaw data shape: {raw_data.shape}")
    print(f"Columns: {raw_data.columns.tolist()}")
    print(f"\nSample data:")
    print(raw_data.head())
    
    featured_data = collector.engineer_features(raw_data)
    print(f"\nFeatured data shape: {featured_data.shape}")
    print(f"New columns: {featured_data.columns.tolist()}")
    print(f"\nSample featured data:")
    print(featured_data.head())
