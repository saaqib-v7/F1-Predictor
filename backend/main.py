from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from . import data_service, schemas, model
import uvicorn

app = FastAPI(title="F1 Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "F1 Predictor API is running"}

@app.get("/next-race", response_model=schemas.RaceSchedule)
def get_next_race():
    race = data_service.get_next_race()
    if not race:
        raise HTTPException(status_code=404, detail="No upcoming races found")
    return race

@app.get("/standings", response_model=schemas.StandingsResponse)
def get_standings():
    return data_service.get_driver_standings()

@app.post("/predict", response_model=schemas.PredictionOutput)
def predict_race(input: schemas.PredictionInput):
    prediction = model.predictor.predict(
        input.driver_id, 
        input.constructor_id, 
        input.grid_position
    )
    
    return {
        "driver_id": input.driver_id,
        "predicted_position": prediction['predicted_position'],
        "win_probability": prediction['win_probability'],
        "podium_probability": prediction.get('podium_probability', 0.0),
        "confidence": prediction.get('confidence', 0.5)
    }

@app.post("/train-model")
def train_model_endpoint():
    try:
        from . import model as model_module
        result = model_module.train_model_from_data()
        return {
            "status": "success",
            "message": "Model trained successfully",
            "metrics": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
