import sys
import os
sys.path.insert(0, os.path.abspath('.'))
from backend.model import RacePredictor

print("Initializing RacePredictor...")
try:
    predictor = RacePredictor()
    print(f"Model path: {predictor.model_path}")
    
    print("Attempting prediction...")
    result = predictor.predict('VER', 'red_bull', 1)
    print("Prediction result:", result)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
