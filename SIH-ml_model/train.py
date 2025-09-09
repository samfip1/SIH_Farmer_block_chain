import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("--- Step 1: Loading Data ---")

df = pd.read_csv("data/price_data.csv")

print("--- Step 2: Preprocessing Data ---")

grade_dummies = df['Grade'].str.get_dummies(sep='|')
df = pd.concat([df, grade_dummies], axis=1)
grade_columns = grade_dummies.columns.tolist()

df['harvest_date'] = pd.to_datetime(df['Arrival_Date'], format='%d-%m-%Y')
df['Day'] = df['harvest_date'].dt.day
df['Month'] = df['harvest_date'].dt.month
df['Year'] = df['harvest_date'].dt.year

categorical_cols = ['State', 'District', 'Market', 'Commodity']
encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = df[col].astype(str)
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

features_to_drop = ['Modal Price', 'Min Price', 'Max Price', 'Arrival_Date', 'harvest_date', 'Grade', 'Variety']
X = df.drop(columns=features_to_drop)
y = df['Modal Price']

print("--- Step 3: Training Model on Full Dataset ---")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X, y)
print("Model training complete.")

print("--- Step 4: Saving Artifacts ---")
artifacts = {
    'model': model,
    'encoders': encoders,
    'grade_columns': grade_columns
}
os.makedirs('artifacts', exist_ok=True)
joblib.dump(artifacts, 'artifacts/artifacts.joblib')

print("✅ Model and artifacts have been saved to 'artifacts/artifacts.joblib'.")