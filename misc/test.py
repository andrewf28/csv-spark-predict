"""Utility script to run the training routine on the sample CSV."""
from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from backend.trainer.training import train_model


def main() -> None:
    csv_path = Path(__file__).with_name("Hysterectomy Model Data.csv")
    results = train_model(str(csv_path))

    print("Performance Metrics on Test Set:")
    for label, value in results["metrics"].items():
        print(f"{label}: {value}")

    print("\nFeature Importances:")
    for item in results["feature_importances"]:
        print(f"{item['Feature']}: {item['Importance']:.4f}")


if __name__ == "__main__":
    main()
