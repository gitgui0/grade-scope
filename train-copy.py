import pandas as pd
import xgboost as xgb
import shap
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error

# --- Load dataset ---
df = pd.read_csv('./data/student-por.csv')

# --- Features ---
behavior_features = [
    'age', 'traveltime', 'studytime', 'failures', 'schoolsup', 'famsup',
    'famrel', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'absences'
]
target_column = 'G3'

# --- Prepare behavior dataset ---
X_behavior = df[behavior_features]
y_behavior = df[target_column]

# One-hot encode categorical columns (schoolsup, famsup)
X_behavior = pd.get_dummies(X_behavior, drop_first=True)

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

# --- Calculate min/max for scaling ---
train_pred_behavior = model_behavior.predict(Xb_train)
train_pred_perf = model_perf.predict(Xp_train)

min_behavior, max_behavior = train_pred_behavior.min(), train_pred_behavior.max()
min_perf, max_perf = train_pred_perf.min(), train_pred_perf.max()

def scale_to_20(pred, min_val, max_val):
    if max_val - min_val == 0:
        return 0
    scaled = (pred - min_val) / (max_val - min_val) * 20
    return max(0, min(20, scaled))  # clip between 0 and 20

# --- Combined prediction function ---
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
    combined = max(0, min(20, combined))  # final clip

    return round(combined, 2), round(pred_behavior_scaled, 2), round(pred_perf_scaled, 2)

# --- Test Example Students ---
test_students = [
    # 1. Worst-case behavior
    {"age": 22, "traveltime": 4, "studytime": 1, "failures": 3, "schoolsup": "no", "famsup": "no",
     "famrel": 1, "freetime": 1, "goout": 5, "Dalc": 5, "Walc": 5, "health": 1, "absences": 5, "G1": 0, "G2": 0},

    # 2. Perfect behavior
    {"age": 17, "traveltime": 1, "studytime": 4, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 5, "freetime": 3, "goout": 1, "Dalc": 1, "Walc": 1, "health": 5, "absences": 0, "G1": 9.5, "G2": 9.5},

    # 3. Social partygoer but no study
    {"age": 18, "traveltime": 2, "studytime": 1, "failures": 0, "schoolsup": "no", "famsup": "no",
     "famrel": 3, "freetime": 5, "goout": 5, "Dalc": 3, "Walc": 4, "health": 3, "absences": 5, "G1": 9.5, "G2": 9.5},

    # 4. Quiet & reclusive, no support
    {"age": 19, "traveltime": 1, "studytime": 2, "failures": 1, "schoolsup": "no", "famsup": "no",
     "famrel": 2, "freetime": 1, "goout": 1, "Dalc": 1, "Walc": 1, "health": 4, "absences": 2, "G1": 9.5, "G2": 9.5},

    # 5. Always sick, absent, no support
    {"age": 18, "traveltime": 2, "studytime": 3, "failures": 0, "schoolsup": "no", "famsup": "no",
     "famrel": 3, "freetime": 2, "goout": 2, "Dalc": 1, "Walc": 2, "health": 1, "absences": 5, "G1": 9.5, "G2": 9.5},

    # 6. Low discipline but healthy
    {"age": 17, "traveltime": 3, "studytime": 1, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 4, "freetime": 4, "goout": 4, "Dalc": 2, "Walc": 3, "health": 5, "absences": 2, "G1": 9.5, "G2": 9.5},

    # 7. Strong family support, bad school behavior
    {"age": 16, "traveltime": 2, "studytime": 2, "failures": 1, "schoolsup": "no", "famsup": "yes",
     "famrel": 5, "freetime": 4, "goout": 4, "Dalc": 2, "Walc": 4, "health": 4, "absences": 3, "G1": 9.5, "G2": 9.5},

    # 8. Burnout case — studied too hard, sick
    {"age": 20, "traveltime": 1, "studytime": 4, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 3, "freetime": 1, "goout": 1, "Dalc": 1, "Walc": 1, "health": 1, "absences": 5, "G1": 9.5, "G2": 9.5},

    # 9. Balanced but absent
    {"age": 18, "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 3, "freetime": 3, "goout": 3, "Dalc": 1, "Walc": 2, "health": 3, "absences": 5, "G1": 9.5, "G2": 9.5},

    # 10. Average across the board
    {"age": 17, "traveltime": 2, "studytime": 2, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 3, "freetime": 3, "goout": 3, "Dalc": 2, "Walc": 2, "health": 3, "absences": 3, "G1": 9.5, "G2": 9.5},
     
    # 11. Hardworking but bad start
    {"age": 17, "traveltime": 1, "studytime": 4, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 4, "freetime": 2, "goout": 1, "Dalc": 1, "Walc": 1, "health": 4, "absences": 2, "G1": 4, "G2": 5},

    # 12. Slacker but smart
    {"age": 17, "traveltime": 3, "studytime": 1, "failures": 0, "schoolsup": "no", "famsup": "no",
     "famrel": 2, "freetime": 5, "goout": 5, "Dalc": 3, "Walc": 4, "health": 3, "absences": 4, "G1": 13, "G2": 14},

    # 13. Improving student
    {"age": 18, "traveltime": 2, "studytime": 3, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 3, "freetime": 3, "goout": 2, "Dalc": 2, "Walc": 2, "health": 4, "absences": 3, "G1": 6, "G2": 10},

    # 14. Declining student
    {"age": 15, "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 4, "freetime": 3, "goout": 2, "Dalc": 1, "Walc": 1, "health": 5, "absences": 2, "G1": 12, "G2": 6},

    # 15. Failing across the board
    {"age": 18, "traveltime": 4, "studytime": 1, "failures": 3, "schoolsup": "no", "famsup": "no",
     "famrel": 1, "freetime": 1, "goout": 5, "Dalc": 5, "Walc": 5, "health": 1, "absences": 5, "G1": 2, "G2": 1},

    # 16. Perfect student
    {"age": 17, "traveltime": 1, "studytime": 4, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 5, "freetime": 2, "goout": 1, "Dalc": 1, "Walc": 1, "health": 4, "absences": 0, "G1": 20, "G2": 20},

    # 17. Stereotypical average
    {"age": 17, "traveltime": 2, "studytime": 3, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 3, "freetime": 3, "goout": 3, "Dalc": 2, "Walc": 2, "health": 3, "absences": 2, "G1": 12, "G2": 12},

    # 18. Inconsistent student
    {"age": 18, "traveltime": 2, "studytime": 1, "failures": 1, "schoolsup": "no", "famsup": "yes",
     "famrel": 2, "freetime": 5, "goout": 4, "Dalc": 3, "Walc": 4, "health": 2, "absences": 4, "G1": 5, "G2": 12},

    # 19. Motivated repeater
    {"age": 21, "traveltime": 2, "studytime": 4, "failures": 2, "schoolsup": "yes", "famsup": "yes",
     "famrel": 4, "freetime": 2, "goout": 1, "Dalc": 1, "Walc": 1, "health": 4, "absences": 3, "G1": 8, "G2": 9},

    # 20. Underachiever with all support
    {"age": 16, "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "yes", "famsup": "yes",
     "famrel": 5, "freetime": 3, "goout": 1, "Dalc": 1, "Walc": 1, "health": 5, "absences": 1, "G1": 6, "G2": 6}
]

print("\n--- Student Predictions ---")
for i, student in enumerate(test_students, 1):
    final_pred, behav_pred, perf_pred = predict_combined(student)
    print(f"Student {i}: 🎯 Final Prediction: {final_pred} | 🧠 Behavior Only: {behav_pred} | 📘 G1/G2 Model: {perf_pred}")

# --- Behavior Model MAE ---
y_pred_behavior = model_behavior.predict(Xb_test)
mae_behavior = mean_absolute_error(yb_test, y_pred_behavior)
print(f"\n🧠 Behavior Model MAE: {mae_behavior:.2f}")

# --- G1/G2 Model MAE ---
y_pred_perf = model_perf.predict(Xp_test)
mae_perf = mean_absolute_error(yp_test, y_pred_perf)
print(f"📘 G1/G2 Model MAE: {mae_perf:.2f}")

# --- Combined Model MAE ---
# Ensure aligned test set for combined model
combined_pred = y_pred_behavior * 0.6 + y_pred_perf * 0.4
combined_actual = yp_test  # G3 as actual

mae_combined = mean_absolute_error(combined_actual, combined_pred)
print(f"🎯 Combined Model MAE: {mae_combined:.2f}")



# --- Optimize to find max behavior prediction ---
from scipy.optimize import minimize

# Separate numeric and categorical features for behavior
numeric_features = [f for f in behavior_features if f not in ['schoolsup', 'famsup']]
categorical_features = ['schoolsup', 'famsup']

# Bounds for numeric features from dataset min/max
bounds_numeric = [(df[f].min(), df[f].max()) for f in numeric_features]
# Categorical features: 0 or 1 (no=0, yes=1), optimize continuous then round
bounds_categorical = [(0, 1) for _ in categorical_features]

bounds = bounds_numeric + bounds_categorical

# Initial guess: mean of numeric features, categorical = 1 ('yes')
x0_numeric = [df[f].mean() for f in numeric_features]
x0_categorical = [1 for _ in categorical_features]
x0 = x0_numeric + x0_categorical

def behavior_predict_neg(x):
    # Split numeric and categorical
    numeric_vals = x[:len(numeric_features)]
    categorical_vals = x[len(numeric_features):]
    categorical_vals_rounded = [int(round(v)) for v in categorical_vals]

    # Build input dict
    input_dict = {}
    for i, f in enumerate(numeric_features):
        input_dict[f] = numeric_vals[i]
    for i, f in enumerate(categorical_features):
        input_dict[f] = 'yes' if categorical_vals_rounded[i] == 1 else 'no'

    df_input = pd.DataFrame([input_dict])
    df_input_encoded = pd.get_dummies(df_input[behavior_features], drop_first=True)
    df_input_encoded = df_input_encoded.reindex(columns=X_behavior.columns, fill_value=0)

    pred = model_behavior.predict(df_input_encoded)[0]
    return -pred  # negative because minimize => maximize

res = minimize(behavior_predict_neg, x0, bounds=bounds, method='L-BFGS-B')

opt_x = res.x
opt_numeric = opt_x[:len(numeric_features)]
opt_categorical = opt_x[len(numeric_features):]
opt_categorical_rounded = [int(round(v)) for v in opt_categorical]

opt_input = {}
for i, f in enumerate(numeric_features):
    opt_input[f] = opt_numeric[i]
for i, f in enumerate(categorical_features):
    opt_input[f] = 'yes' if opt_categorical_rounded[i] == 1 else 'no'

df_opt = pd.DataFrame([opt_input])
df_opt_encoded = pd.get_dummies(df_opt[behavior_features], drop_first=True)
df_opt_encoded = df_opt_encoded.reindex(columns=X_behavior.columns, fill_value=0)
opt_pred_raw = model_behavior.predict(df_opt_encoded)[0]
opt_pred_scaled = scale_to_20(opt_pred_raw, min_behavior, max_behavior)

print("\n🚀 Optimized Max Behavior Prediction (scaled 0-20):", round(opt_pred_scaled, 2))
print("🔍 Optimized behavior features for max prediction:")
for k, v in opt_input.items():
    print(f" - {k}: {v}")
