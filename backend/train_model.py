
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("F1 Predictor - Model Training Script")
print("=" * 70)

print("\nThis script will train the ML model on 2025 F1 season data.")
print("Training data: 2025 season only (most relevant)")
print("This may take 5-10 minutes on first run (downloading race data).")
print("Subsequent runs will be faster due to caching.\n")

try:
    from model import train_model_from_data
    
    print("Starting model training...\n")
    predictor = train_model_from_data()
    
    print("\n" + "=" * 70)
    print("SUCCESS! Model trained and saved.")
    print("=" * 70)
    print("\nThe model is now ready to use with the F1 Predictor API.")
    print("You can start the backend server with: uvicorn backend.main:app --reload")
    
except KeyboardInterrupt:
    print("\n\nTraining interrupted by user.")
    sys.exit(1)
except Exception as e:
    print(f"\n\nERROR during training: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
