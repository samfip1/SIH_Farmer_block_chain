from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from datetime import datetime

app = FastAPI(title="Agriculture Price Prediction API", version="1.0")

# --- CORS Configuration ---
origins = [
    "http://localhost",
    "http://localhost:5173", # Your React app's origin
    "http://127.0.0.1:5173",
    "http://localhost:5175", # Your React app's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

try:
    artifacts = joblib.load('artifacts/artifacts.joblib')
    model = artifacts['model']
    encoders = artifacts['encoders']
    grade_columns = artifacts['grade_columns']
except FileNotFoundError:
    raise RuntimeError("Artifacts not found. Please run train.py first.")

class PredictionInput(BaseModel):
    State: str
    District: str
    Market: str
    Commodity: str
    Grade: str 
    harvest_date: str 

class PredictionOutput(BaseModel):
    predicted_price: float
    price_range: dict[str, float]

def predict_price_range(model, input_data: pd.DataFrame):
    """Calculates the prediction and a confidence interval."""
    all_tree_preds = [tree.predict(input_data) for tree in model.estimators_]
    preds_matrix = np.stack(all_tree_preds, axis=0)
    
    point_pred = np.mean(preds_matrix, axis=0)[0]
    lower_bound = np.percentile(preds_matrix, 10, axis=0)[0]
    upper_bound = np.percentile(preds_matrix, 90, axis=0)[0]
    
    return point_pred, lower_bound, upper_bound


@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    """
    Predicts the modal price of a commodity based on input features.
    """
    try:

        input_dict = {
            'State': data.State,
            'District': data.District,
            'Market': data.Market,
            'Commodity': data.Commodity,
        }
        
        date = datetime.strptime(data.harvest_date, "%d-%m-%Y")
        input_dict['Day'] = date.day
        input_dict['Month'] = date.month
        input_dict['Year'] = date.year

        input_df = pd.DataFrame([input_dict])
        
        for col, le in encoders.items():
            try:
                input_df[col] = le.transform(input_df[col])
            except ValueError as e:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid value for '{col}': '{input_df[col].iloc[0]}'. This value was not seen during model training."
                )

        input_grades = pd.Series([data.Grade]).str.get_dummies(sep='|')
        input_grades = input_grades.reindex(columns=grade_columns, fill_value=0)
        
        final_df = pd.concat([input_df, input_grades], axis=1)
        
        final_df = final_df[model.feature_names_in_]

        pred, lower, upper = predict_price_range(model, final_df)

        return {
            "predicted_price": round(pred, 2),
            "price_range": {
                "lower_bound": round(lower, 2),
                "upper_bound": round(upper, 2)
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Price Prediction API. Go to /docs for more info."}