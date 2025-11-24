#!/bin/bash
# Navigate to the script's directory (project root)
cd "$(dirname "$0")"

# Activate virtual environment
if [ -f "backend/venv/bin/activate" ]; then
    source backend/venv/bin/activate
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Please create it first."
    exit 1
fi

# Run uvicorn
echo "Starting F1 Predictor Backend..."
uvicorn backend.main:app --reload
