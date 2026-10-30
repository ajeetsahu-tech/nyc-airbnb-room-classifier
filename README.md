# NYC Airbnb Room Classifier

A FastAPI app with a browser interface that predicts an NYC Airbnb listing's room type.

## Requirements

- Python 3.10 or newer
- The trained model file `Model_pipeline.pkl` in this project folder

The model file is intentionally excluded from Git because it is large. If it is missing, obtain the trained artifact separately and place it next to `main.py` before starting the app.

## Run locally

In PowerShell, from this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Then open <http://127.0.0.1:8000>. The interface and API are served from the same origin.

## API

- `GET /health` checks that the model loaded.
- `POST /predict` accepts the listing features and returns the predicted room type, per-class probabilities, and class names.
- `GET /docs` opens the interactive API documentation.

# Types of Room

1. Entire home/apt
2. Private room
3. Shared room
