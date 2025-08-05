import pandas as pd
import xgboost as xgb
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# --- Load and train on startup ---
df = pd.read_csv('./data/student-por.csv')

behavior_features = [
    'age', 'traveltime', 'studytime', 'failures', 'schoolsup', 'famsup',
    'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'
]
target_column = 'G3'

X_behavior = df[behavior_features]
y_behavior = df[target_column]

X_behavior = pd.get_dummies(X_behavior, drop_first=True)

Xb_train, Xb_test, yb_train, yb_test = train_test_split(X_behavior, y_behavior, test_size=0.2, random_state=42)

model_behavior = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
model_behavior.fit(Xb_train, yb_train)

perf_features = behavior_features + ['G1', 'G2']
X_perf = df[perf_features]
y_perf = df[target_column]

X_perf = pd.get_dummies(X_perf, drop_first=True)
Xp_train, Xp_test, yp_train, yp_test = train_test_split(X_perf, y_perf, test_size=0.2, random_state=42)

model_perf = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
model_perf.fit(Xp_train, yp_train)

train_pred_behavior = model_behavior.predict(Xb_train)
train_pred_perf = model_perf.predict(Xp_train)

min_behavior, max_behavior = train_pred_behavior.min(), train_pred_behavior.max()
min_perf, max_perf = train_pred_perf.min(), train_pred_perf.max()

def scale_to_20(pred, min_val, max_val):
    if max_val - min_val == 0:
        return 0
    scaled = (pred - min_val) / (max_val - min_val) * 20
    return max(0, min(20, scaled))  # clip between 0 and 20

def predict_combined(student_input, w_behavior=0.6, w_perf=0.4):
    student_df = pd.DataFrame([student_input])

    # Behavior model input
    student_behavior = student_df[behavior_features]
    student_behavior = pd.get_dummies(student_behavior)
    student_behavior = student_behavior.reindex(columns=X_behavior.columns, fill_value=0)

    # Performance model input
    student_perf = student_df[perf_features]
    student_perf = pd.get_dummies(student_perf)
    student_perf = student_perf.reindex(columns=X_perf.columns, fill_value=0)

    pred_behavior_raw = model_behavior.predict(student_behavior)[0]
    pred_perf_raw = model_perf.predict(student_perf)[0]

    pred_behavior_scaled = scale_to_20(pred_behavior_raw, min_behavior, max_behavior)
    pred_perf_scaled = scale_to_20(pred_perf_raw, min_perf, max_perf)

    combined = pred_behavior_scaled * w_behavior + pred_perf_scaled * w_perf
    combined = max(0, min(20, combined)) 

    return {
        "final_prediction": round(combined, 2),
        "behavior_prediction": round(pred_behavior_scaled, 2),
        "performance_prediction": round(pred_perf_scaled, 2)
    }


# --- Flask prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        prediction = predict_combined(data)
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
