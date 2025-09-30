from __future__ import annotations

import os
from typing import Any

from django.conf import settings
from django.core.files.storage import default_storage
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View

from .forms import UploadFileForm
from .training import TrainingError, train_model


class UploadCSVView(View):
    template_name = "trainer/upload.html"

    def get(self, request: HttpRequest) -> HttpResponse:
        form = UploadFileForm()
        return render(request, self.template_name, {"form": form})

    def post(self, request: HttpRequest) -> HttpResponse:
        form = UploadFileForm(request.POST, request.FILES)
        context: dict[str, Any] = {
            "form": form,
            "metrics": None,
            "feature_importances": None,
            "dataset_columns": None,
            "dataset_preview": None,
        }

        if form.is_valid():
            upload = form.cleaned_data["csv_file"]
            os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
            saved_path = default_storage.save(os.path.join("uploads", upload.name), upload)
            file_path = os.path.join(settings.MEDIA_ROOT, saved_path)

            try:
                metrics = train_model(file_path)
            except TrainingError as exc:
                form.add_error("csv_file", str(exc))
                default_storage.delete(saved_path)
            else:
                context.update(
                    {
                        "metrics": metrics["metrics"],
                        "feature_importances": metrics["feature_importances"],
                        "dataset_columns": metrics["dataset_columns"],
                        "dataset_preview": metrics["dataset_preview"],
                    }
                )

        return render(request, self.template_name, context)
