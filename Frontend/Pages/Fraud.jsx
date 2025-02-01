import React, { useState } from 'react';
import axios from 'axios';
import { FaStoreAlt } from 'react-icons/fa';

function FraudDetection() {
    const [foodbankId, setFoodbankId] = useState('');
    const [foodbankName, setFoodbankName] = useState('');
    const [location, setLocation] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [fraudChecked, setFraudChecked] = useState(false);

    const handleSubmitFraud = async (e) => {
        e.preventDefault();

        const searchData = {
            foodbank_id: foodbankId,
            foodbank_name: foodbankName,
            location: location,
        };

        try {
            // Make a request to the Flask backend to check the fraud status
            const response = await axios.post('http://127.0.0.1:5001/detect_fraud', searchData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.fraud === 'Yes') {
                setPrediction('Yes, this foodbank is flagged for fraud.');
                setFraudChecked(true);
            } else {
                setPrediction('No, this foodbank is not flagged for fraud.');
                setFraudChecked(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: `url('https://source.unsplash.com/1600x900/?foodbank,fraud')`,
            }}
        >
            {/* Overlay for background */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
                    Fraud Detection
                </h2>
                <form onSubmit={handleSubmitFraud} className="space-y-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="foodbankId">
                            Foodbank ID
                        </label>
                        <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-green-500">
                            <FaStoreAlt className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                id="foodbankId"
                                className="w-full py-2 border-none focus:outline-none focus:ring-0"
                                placeholder="Enter Foodbank ID"
                                value={foodbankId}
                                onChange={(e) => setFoodbankId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="foodbankName">
                            Foodbank Name
                        </label>
                        <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-green-500">
                            <FaStoreAlt className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                id="foodbankName"
                                className="w-full py-2 border-none focus:outline-none focus:ring-0"
                                placeholder="Enter Foodbank Name"
                                value={foodbankName}
                                onChange={(e) => setFoodbankName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="location">
                            Location
                        </label>
                        <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-green-500">
                            <FaStoreAlt className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                id="location"
                                className="w-full py-2 border-none focus:outline-none focus:ring-0"
                                placeholder="Enter Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
                    >
                        Check Fraud
                    </button>
                </form>

                {prediction && (
                    <div className="mt-4 text-lg font-semibold text-gray-800">
                        {prediction}
                    </div>
                )}
                {fraudChecked && (
                    <div className="mt-4 text-lg font-semibold text-red-600">
                        Fraud Detected!
                    </div>
                )}
            </div>
        </div>
    );
}

export default FraudDetection;
