import pandas as pd
import xgboost as xgb
import joblib
from student_model import StudentPerformanceModel


# --- Load dataset ---
df = pd.read_csv('./data/student-por.csv')

# --- Define features and target ---
behavior_features = [
    'age', 'traveltime', 'studytime', 'failures', 'schoolsup', 'famsup',
    'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'
]
target_column = 'G3'

# --- Prepare behavior dataset ---
X_behavior = df[behavior_features]
y_behavior = df[target_column]

X_behavior = pd.get_dummies(X_behavior, drop_first=True)

from sklearn.model_selection import train_test_split

Xb_train, Xb_test, yb_train, yb_test = train_test_split(X_behavior, y_behavior, test_size=0.2, random_state=42)

model_behavior = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
model_behavior.fit(Xb_train, yb_train)

# --- Prepare performance dataset (behavior + G1, G2) ---
perf_features = behavior_features + ['G1', 'G2']
X_perf = df[perf_features]
y_perf = df[target_column]

X_perf = pd.get_dummies(X_perf, drop_first=True)

Xp_train, Xp_test, yp_train, yp_test = train_test_split(X_perf, y_perf, test_size=0.2, random_state=42)

model_perf = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
model_perf.fit(Xp_train, yp_train)

# --- Calculate scaling min/max ---
train_pred_behavior = model_behavior.predict(Xb_train)
train_pred_perf = model_perf.predict(Xp_train)

min_behavior, max_behavior = train_pred_behavior.min(), train_pred_behavior.max()
min_perf, max_perf = train_pred_perf.min(), train_pred_perf.max()





# --- Create the combined model instance ---
combined_model = StudentPerformanceModel(
    model_behavior=model_behavior,
    model_perf=model_perf,
    behavior_features=behavior_features,
    perf_features=perf_features,
    X_behavior_cols=X_behavior.columns.tolist(),
    X_perf_cols=X_perf.columns.tolist(),
    scaling_params={
        'min_behavior': float(min_behavior),
        'max_behavior': float(max_behavior),
        'min_perf': float(min_perf),
        'max_perf': float(max_perf)
    }
)

import joblib

# Assuming you already trained your models:
# model_behavior = ...
# model_perf = ...
# X_behavior = ...
# X_perf = ...

combined_model = StudentPerformanceModel(
    model_behavior=model_behavior,
    model_perf=model_perf,
    behavior_features=behavior_features,
    perf_features=perf_features,
    X_behavior_cols=X_behavior.columns.tolist(),
    X_perf_cols=X_perf.columns.tolist(),
    scaling_params={
        'min_behavior': X_behavior.min().tolist(),
        'max_behavior': X_behavior.max().tolist(),
        'min_perf': X_perf.min().tolist(),
        'max_perf': X_perf.max().tolist()
    }
)

# Save it
joblib.dump(combined_model, "model/combined_model.pkl")
