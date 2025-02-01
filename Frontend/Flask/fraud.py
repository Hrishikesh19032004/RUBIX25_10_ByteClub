from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

DATASET_PATH = 'fraud.csv'  # Path to your dataset file

def load_data(file_path):
    """Loads the dataset from the provided file path."""
    df = pd.read_csv(file_path)
    return df

def detect_fraud_by_foodbank(foodbank_id):
    """Detects if a food bank is fraudulent by matching foodbank ID."""
    df = load_data(DATASET_PATH)

    # Find the food bank by ID
    foodbank_data = df[df['foodbank_id'] == foodbank_id]

    # If the food bank is found in the dataset
    if not foodbank_data.empty:
        # Check the fraud status based on the 'fraud' column
        fraud_status = foodbank_data['fraud'].values[0]
        
        # Return 1 if fraud is detected, else 0
        if fraud_status.lower() == "yes":
            return 1  # Fraud detected
        else:
            return 0  # No fraud
    else:
        return None  # Food bank not found

@app.route('/detect_fraud', methods=['POST'])
def detect_fraud_route():
    """Handles the POST request to detect fraud."""
    # Check if the request has the required JSON data
    if not request.json:
        return jsonify({"error": "No data provided"}), 400

    # Get new data from the request
    new_data = request.json
    foodbank_id = new_data.get('foodbank_id')

    # Call function to detect fraud for the given food bank
    fraud_status = detect_fraud_by_foodbank(foodbank_id)

    if fraud_status is None:
        return jsonify({"error": "Food bank not found"}), 404
    
    # Return the fraud status response
    return jsonify({
        "fraud": fraud_status == 1, 
        "fraud_status": "Yes" if fraud_status == 1 else "No"
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)
