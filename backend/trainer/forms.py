from django import forms


class UploadFileForm(forms.Form):
    csv_file = forms.FileField(
        label="CSV file",
        help_text="Upload a CSV containing the training data."
    )

    def clean_csv_file(self):
        uploaded_file = self.cleaned_data["csv_file"]
        if not uploaded_file.name.lower().endswith(".csv"):
            raise forms.ValidationError("The uploaded file must have a .csv extension.")
        return uploaded_file
