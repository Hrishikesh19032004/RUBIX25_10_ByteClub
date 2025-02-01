from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
app = Flask(__name__)
CORS(app)


df = pd.read_csv('Waste.csv')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get the state name from the frontend request
        request_data = request.json
        state_name = request_data.get('state')

        # Filter data for the selected state
        state_data = df[df['State'] == state_name]

        if state_data.empty:
            return jsonify({"error": "No data available for the selected state"}), 404

        # Group data by year
        state_data['Year'] = pd.to_datetime(state_data['Date']).dt.year
        yearly_waste = state_data.groupby('Year')['Food Wasted (Tonnes)'].sum().reset_index()

        # Predictions for future years
        X = yearly_waste[['Year']].values
        y = yearly_waste['Food Wasted (Tonnes)'].values
        model = LinearRegression()
        model.fit(X, y)

        # Predict the next 5 years
        future_years = np.arange(yearly_waste['Year'].max() + 1, yearly_waste['Year'].max() + 6).reshape(-1, 1)
        predictions = model.predict(future_years)

        # Add random noise to simulate fluctuations (introducing some randomness to the trend)
        noise = np.random.uniform(-0.1, 0.1, size=predictions.shape)
        noisy_predictions = predictions + noise * predictions  # Adding noise as a percentage of the prediction

        # Prepare response
        predictions_data = [{"Year": int(year[0]), "Predicted Food Waste (Tonnes)": round(pred, 2)} for year, pred in zip(future_years, noisy_predictions)]
        yearly_trends = yearly_waste.to_dict(orient='records')

        # Example pie chart data
        pie_data = [
            {"name": "Food Waste in Households", "value": 30},
            {"name": "Food Waste in Restaurants", "value": 40},
            {"name": "Food Waste in Agriculture", "value": 20},
            {"name": "Other Causes", "value": 10},
        ]

        # Example inferences
        inferences = {
            "Landfills Increase (%)": round(np.random.uniform(10, 20), 2),
            "Fire Risk (%)": round(np.random.uniform(5, 15), 2),
            "Composting Needs Increase (%)": round(np.random.uniform(8, 18), 2)
        }

        # Send data back to frontend
        response = {
            "yearly_trends": yearly_trends,
            "predictions": predictions_data,
            "inferences": inferences,
            "pie_data": pie_data,  # Include pie chart data in the response
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
