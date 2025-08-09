import pandas as pd
import xgboost as xgb
from flask import Flask, request, jsonify, abort
from sklearn.model_selection import train_test_split
import os
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
API_TOKEN = os.getenv("API-KEY")

@app.before_request
def require_token():
    # Only secure the `/predict` endpoint (you could secure others if needed)
    if request.path == '/predict':
        token = request.headers.get("X-Internal-Token")
        if not token or token != API_TOKEN:
            abort(403, description="Forbidden: Missing or invalid API token")

from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    response = e.get_response()
    # Replace the default HTML body with JSON
    response.data = jsonify({
        "error": e.name,
        "message": e.description,
        "code": e.code
    }).data
    response.content_type = "application/json"
    return response

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

def predict_combined(student_input, w_behavior=0.5, w_perf=0.5):
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

    print(pred_behavior_scaled)

    if(pred_behavior_scaled < 9):
        # Its account for GAIN due to "inneficient" behavioural aspects
        if(pred_behavior_scaled < 8):
            pred_behavior_scaled = pred_behavior_scaled *  0.52
            pred_perf_scaled = pred_perf_scaled * 0.78
        else:
             pred_behavior_scaled = pred_behavior_scaled *  0.82
             pred_perf_scaled = pred_perf_scaled * 0.93

    elif(pred_behavior_scaled > 13.5):
        pred_behavior_scaled = pred_behavior_scaled *  1.3 # 1.3 is to account for LOSS due to "inneficient" behavioural aspects

    

    print(pred_behavior_scaled)

    # Over the scale, but rarely happens
    if(pred_behavior_scaled > 20):
        pred_behavior_scaled = 20

    if(pred_perf_scaled > 20):
        pred_perf_scaled = 20

    combined = pred_behavior_scaled * w_behavior + pred_perf_scaled * w_perf
    combined = max(0, min(20, combined)) 

    print(round(combined, 2))

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
        print(data)
        prediction = predict_combined(data)
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({'status': "Healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True)
