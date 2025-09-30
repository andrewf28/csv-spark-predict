import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# --- Step 1: Load the dataset ---
# Replace 'data.csv' with the path to your actual CSV file
df = pd.read_csv(r"C:\Users\connc\Downloads\Hysterectomy Model Data.csv")

# --- Step 2: Define features and target ---
feature_columns = [
    "BMI",
    "uterine_length",
    "uterine_width",
    "uterine_height",
    "Robot",
    "cesarean_count",
    "myomectomy_count",
    "other_laparoscopy_count",
    "has_endometriosis",
    "has_fibroids_or_myomas",
    "is_supracervical"
]

X = df[feature_columns]
y = df["Duration of surgery in minutes"]

# --- Step 3: Train-test split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --- Step 4: Define RandomForestRegressor with given hyperparameters ---
rf_regressor = RandomForestRegressor(
    n_estimators=100,
    max_depth=20,
    min_samples_split=4,
    min_samples_leaf=2,
    random_state=42,
    bootstrap=True,
    max_features='sqrt'
)

# --- Step 5: Train the model ---
rf_regressor.fit(X_train, y_train)

# --- Step 6: Evaluate the model ---
y_pred = rf_regressor.predict(X_test)

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print(f"R² Score: {r2:.3f}")
print(f"Mean Absolute Error: {mae:.2f} minutes")

mae = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred, squared=False)
r2 = r2_score(y_test, y_pred)
bias = np.mean(y_pred - y_test)

print("Performance Metrics on Test Set:")
print(f"MAE: {mae:.2f} minutes")
print(f"RMSE: {rmse:.2f} minutes")
print(f"R²: {r2:.4f}")
print(f"Bias (Mean Prediction - Actual): {bias:+.2f} minutes")

# --- Step 7: Feature importance ---
importances = rf_regressor.feature_importances_
feature_importance = pd.DataFrame({
    "Feature": feature_columns,
    "Importance": importances
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importances:")
print(feature_importance.to_string(index=False))