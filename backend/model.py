import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import os
try:
    from .data_collector import F1DataCollector
except ImportError:
    from data_collector import F1DataCollector


class RacePredictor:
    def __init__(self):
        self.position_model = RandomForestRegressor(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        self.win_prob_model = RandomForestRegressor(
            n_estimators=150,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        self.le_driver = LabelEncoder()
        self.le_team = LabelEncoder()
        self.is_trained = False
        self.model_path = os.path.join(os.path.dirname(__file__), 'race_predictor_v2.joblib')
        
        self.driver_stats = {}
        self.team_stats = {}
        self.feature_names = []

    def prepare_features(self, data):
        df = data.copy()
        
        required_cols = ['driver', 'team', 'grid_position', 'avg_recent_finish', 
                        'recent_points', 'team_avg_finish', 'finished']
        
        for col in required_cols:
            if col not in df.columns:
                if col == 'avg_recent_finish':
                    df[col] = 10.0
                elif col == 'recent_points':
                    df[col] = 0.0
                elif col == 'team_avg_finish':
                    df[col] = 10.0
                elif col == 'finished':
                    df[col] = 1
        
        df['driver_enc'] = self.le_driver.fit_transform(df['driver'])
        df['team_enc'] = self.le_team.fit_transform(df['team'])
        
        feature_cols = ['driver_enc', 'team_enc', 'grid_position', 
                       'avg_recent_finish', 'recent_points', 'team_avg_finish']
        
        self.feature_names = feature_cols
        
        return df[feature_cols], df['finish_position']

    def train(self, data):
        print("Training F1 race prediction model...")
        print(f"Training data shape: {data.shape}")
        
        X, y = self.prepare_features(data)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print("Training position prediction model...")
        self.position_model.fit(X_train, y_train)
        
        y_pred = self.position_model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        print(f"Position Model - MAE: {mae:.2f}, RMSE: {rmse:.2f}")
        

        data_with_pred = data.copy()
        X_pred, _ = self.prepare_features(data_with_pred)
        

        data_with_pred['predicted_position'] = self.position_model.predict(X_pred)
        data_with_pred['won'] = (data_with_pred['finish_position'] == 1).astype(int)
        

        X_win = X_pred.copy()
        X_win['predicted_position'] = data_with_pred['predicted_position'].values
        y_win = data_with_pred['won']
        
        print("Training win probability model...")
        self.win_prob_model.fit(X_win, y_win)
        
        for driver in data['driver'].unique():
            driver_data = data[data['driver'] == driver]
            self.driver_stats[driver] = {
                'avg_finish': driver_data['finish_position'].mean(),
                'avg_grid': driver_data['grid_position'].mean(),
                'wins': (driver_data['finish_position'] == 1).sum(),
                'podiums': (driver_data['finish_position'] <= 3).sum(),
                'total_races': len(driver_data),
                'avg_points': driver_data['points'].mean()
            }
        
        for team in data['team'].unique():
            team_data = data[data['team'] == team]
            self.team_stats[team] = {
                'avg_finish': team_data['finish_position'].mean(),
                'wins': (team_data['finish_position'] == 1).sum(),
                'total_races': len(team_data)
            }
        
        self.is_trained = True
        
        print(f"Saving model to {self.model_path}...")
        joblib.dump(self, self.model_path)
        
        print("Model training complete!")
        return {'mae': mae, 'rmse': rmse}

    def predict(self, driver, team, grid, avg_recent_finish=None, recent_points=None):
        if not self.is_trained:
            if os.path.exists(self.model_path):
                print(f"Loading model from {self.model_path}...")
                loaded = joblib.load(self.model_path)
                self.position_model = loaded.position_model
                self.win_prob_model = loaded.win_prob_model
                self.le_driver = loaded.le_driver
                self.le_team = loaded.le_team
                self.driver_stats = loaded.driver_stats
                self.team_stats = loaded.team_stats
                self.feature_names = loaded.feature_names
                self.is_trained = True
            else:
                return {
                    'predicted_position': grid,
                    'win_probability': 0.05,
                    'podium_probability': 0.15,
                    'confidence': 0.0
                }

        try:
            if driver not in self.le_driver.classes_:
                driver_similar = self._find_similar_driver(driver)
                if driver_similar:
                    driver = driver_similar
                else:
                    return self._fallback_prediction(grid)
            
            if team not in self.le_team.classes_:
                team_similar = self._find_similar_team(team)
                if team_similar:
                    team = team_similar
                else:
                    return self._fallback_prediction(grid)
            
            driver_enc = self.le_driver.transform([driver])[0]
            team_enc = self.le_team.transform([team])[0]
            
            if avg_recent_finish is None:
                avg_recent_finish = self.driver_stats.get(driver, {}).get('avg_finish', 10.0)
            if recent_points is None:
                recent_points = self.driver_stats.get(driver, {}).get('avg_points', 0.0) * 3
            
            team_avg_finish = self.team_stats.get(team, {}).get('avg_finish', 10.0)
            
            features = pd.DataFrame([{
                'driver_enc': driver_enc,
                'team_enc': team_enc,
                'grid_position': grid,
                'avg_recent_finish': avg_recent_finish,
                'recent_points': recent_points,
                'team_avg_finish': team_avg_finish
            }])
            
            predicted_position = self.position_model.predict(features)[0]
            predicted_position = max(1, min(20, int(round(predicted_position))))
            
            features_with_pred = features.copy()
            features_with_pred['predicted_position'] = predicted_position
            
            win_prob_raw = self.win_prob_model.predict(features_with_pred)[0]

            win_prob = max(0.01, min(0.95, win_prob_raw))
            
            podium_prob = self._calculate_podium_probability(
                predicted_position, grid, driver, team
            )
            
            confidence = self._calculate_confidence(driver, team, grid)
            
            return {
                'predicted_position': predicted_position,
                'win_probability': round(win_prob, 4),
                'podium_probability': round(podium_prob, 4),
                'confidence': round(confidence, 4)
            }
        
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._fallback_prediction(grid)
    
    def _find_similar_driver(self, driver):
        if self.driver_stats:
            return list(self.driver_stats.keys())[0]
        return None
    
    def _find_similar_team(self, team):
        if self.team_stats:
            return list(self.team_stats.keys())[0]
        return None
    
    def _fallback_prediction(self, grid):
        base_prob = max(0.01, 0.5 / grid)
        return {
            'predicted_position': grid,
            'win_probability': round(base_prob, 4),
            'podium_probability': round(base_prob * 3, 4),
            'confidence': 0.3
        }
    
    def _calculate_podium_probability(self, predicted_pos, grid, driver, team):
        base_prob = 0.0
        
        if predicted_pos <= 3:
            base_prob = 0.7
        elif predicted_pos <= 5:
            base_prob = 0.4
        elif predicted_pos <= 10:
            base_prob = 0.1
        else:
            base_prob = 0.02
        
        if driver in self.driver_stats:
            podium_rate = self.driver_stats[driver]['podiums'] / max(1, self.driver_stats[driver]['total_races'])
            base_prob = (base_prob + podium_rate) / 2
        
        if grid <= 3:
            base_prob *= 1.2
        elif grid <= 5:
            base_prob *= 1.1
        
        return max(0.0, min(1.0, base_prob))
    
    def _calculate_confidence(self, driver, team, grid):
        confidence = 0.7
        
        if driver in self.driver_stats:
            races = self.driver_stats[driver]['total_races']
            confidence += min(0.2, races / 100)
        
        if 1 <= grid <= 10:
            confidence += 0.1
        
        return min(1.0, confidence)

def train_model_from_data():
    print("Collecting F1 data from 2025 season...")
    collector = F1DataCollector()
    
    raw_data = collector.collect_historical_data(start_year=2025, end_year=2025)
    
    print("Engineering features...")
    featured_data = collector.engineer_features(raw_data)
    
    print(f"Total training samples: {len(featured_data)}")
    
    global predictor
    predictor = RacePredictor()
    metrics = predictor.train(featured_data)
    
    return metrics

predictor = RacePredictor()

if __name__ == "__main__":
    train_model_from_data() 
