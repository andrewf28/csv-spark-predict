from __future__ import annotations

from dataclasses import dataclass
from typing import Final

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


FEATURE_COLUMNS: Final[list[str]] = [
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
    "is_supracervical",
]
TARGET_COLUMN: Final[str] = "Duration of surgery in minutes"


@dataclass(slots=True)
class TrainingError(Exception):
    """Raised when the uploaded dataset cannot be processed."""

    message: str

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.message


def train_model(csv_path: str) -> dict[str, object]:
    """Train a RandomForestRegressor on the uploaded CSV file.

    Returns a dictionary containing model metrics and feature importances.
    """

    try:
        data = pd.read_csv(csv_path)
    except Exception as exc:  # pragma: no cover - delegated to pandas
        raise TrainingError(f"Unable to read the uploaded CSV file: {exc}") from exc

    missing_columns = [column for column in FEATURE_COLUMNS + [TARGET_COLUMN] if column not in data.columns]
    if missing_columns:
        formatted = ", ".join(missing_columns)
        raise TrainingError(
            "The uploaded dataset is missing required columns: "
            f"{formatted}. Please upload a file that matches the template."
        )

    features = data[FEATURE_COLUMNS]
    target = data[TARGET_COLUMN]

    if features.empty:
        raise TrainingError("The uploaded dataset does not contain any rows to train on.")

    x_train, x_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        bootstrap=True,
        max_features="sqrt",
    )

    model.fit(x_train, y_train)
    predictions = model.predict(x_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions, squared=False)
    r2 = r2_score(y_test, predictions)
    bias = float(np.mean(predictions - y_test))

    feature_importances = (
        pd.DataFrame({"Feature": FEATURE_COLUMNS, "Importance": model.feature_importances_})
        .sort_values(by="Importance", ascending=False)
        .reset_index(drop=True)
    )

    preview = data.head(10)

    dataset_columns = list(preview.columns)
    dataset_preview = preview.to_numpy().tolist()

    return {
        "metrics": {
            "R²": round(r2, 4),
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "Bias": round(bias, 2),
        },
        "feature_importances": feature_importances.to_dict(orient="records"),
        "dataset_columns": dataset_columns,
        "dataset_preview": dataset_preview,
    }
