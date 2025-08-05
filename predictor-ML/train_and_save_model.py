import pandas as pd
import xgboost as xgb
import joblib
import json
from sklearn.model_selection import train_test_split

# --- Load dataset ---
df = pd.read_csv('./data/student-por.csv')

# --- Features ---
behavior_features = [
    'age', 'traveltime', 'studytime', 'failures', 'schoolsup', 'famsup',
    'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'
]
perf_features = behavior_features + ['G1', 'G2']
target_column = 'G3'

# --- Prepare dataset ---
X = df[perf_features]
y = df[target_column]

# One-hot encode categorical columns
X = pd.get_dummies(X, drop_first=True)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost regressor
model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
model.fit(X_train, y_train)

# Calculate min and max prediction on training set for scaling
train_preds = model.predict(X_train)
min_val, max_val = train_preds.min(), train_preds.max()

# Save model, columns, and scaling parameters
joblib.dump(model, 'model_combined.pkl')
joblib.dump(X.columns, 'model_columns.pkl')

min_val, max_val = float(train_preds.min()), float(train_preds.max())

scaling_params = {'min_val': min_val, 'max_val': max_val}
with open('scaling_params.json', 'w') as f:
    json.dump(scaling_params, f)


print("Model training and saving complete.")
