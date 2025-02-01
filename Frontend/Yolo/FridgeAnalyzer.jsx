import React, { useState, useEffect } from "react";
import axios from "axios";
import './FridgeAnalyzer.css';
import FridgeSender from "./FridgeSender"; // Import the FridgeSender component
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FridgeAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fridgeData, setFridgeData] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  // Fetch fridge data from the backend when the component mounts
  useEffect(() => {
    const fetchFridgeData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3100/getFridgeData");
        setFridgeData(response.data);
      } catch (error) {
        console.error("Error fetching fridge data:", error);
        setError("Failed to load fridge data.");
      }
    };

    fetchFridgeData();
  }, []);

  const handleFileChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Create a preview of the image
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    setResults(null); // Reset previous results
    setError(null);   // Reset previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image!");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", image);
  
    setLoading(true);
  
    try {
      // Send image to the backend for analysis
      const response = await axios.post("http://127.0.0.1:3200/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Process and display the response from the backend
      setResults(response.data);
    } catch (error) {
      console.error("Error analyzing the image", error);
      setError("An error occurred while analyzing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Data for the line graph
  const graphData = {
    labels: fridgeData ? fridgeData.map(data => new Date(data.timestamp).toLocaleDateString()) : [],
    datasets: [
      {
        label: "Detected Items Count",
        data: fridgeData ? fridgeData.map(data => data.detectedItemsCount) : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="fridge-analyzer" style={{ background: "linear-gradient(135deg, #f0f4f8, #d6e1e9)", minHeight: "100vh", padding: "20px" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">Fridge Analyzer</h1>
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center">
          <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 mb-4 border rounded" style={{ fontSize: "16px" }} />
          <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all text-lg mb-4">Analyze</button>
        </form>

        {/* Display the image preview */}
        {imagePreview && (
          <div className="image-preview mb-4">
            <img src={imagePreview} alt="Preview" className="w-full rounded-md" style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }} />
          </div>
        )}

        {loading && <p className="text-center text-gray-600">Analyzing...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {results && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Analysis Results:</h3>

            <div className="inventory-status mb-6">
              <strong className="text-lg">Inventory Status:</strong> <span className="text-green-600">{results.inventory_status}</span>
            </div>

            <div className="todo-list mb-6">
              <h4 className="text-lg font-semibold mb-2">Items Detected:</h4>
              <ul>
                {results.detected_items.map((item, index) => (
                  <li key={index} className="todo-item mb-2 flex justify-between p-2 bg-gray-100 rounded shadow-md">
                    <input type="checkbox" disabled checked />
                    <span>{item.item} - {Math.round(item.confidence * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            {results.grocery_needed.length > 0 && (
              <div className="grocery-recommendations mb-6">
                <h4 className="text-lg font-semibold mb-2">Grocery Recommendations:</h4>
                <ul>
                  {results.grocery_needed.map((msg, index) => (
                    <li key={index} className="todo-item mb-2 flex justify-between p-2 bg-yellow-100 rounded shadow-md">
                      <input type="checkbox" disabled />
                      <span>{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.food_waste_warning.length > 0 && (
              <div className="food-waste-warnings mb-6">
                <h4 className="text-lg font-semibold mb-2">Food Waste Warnings:</h4>
                <ul>
                  {results.food_waste_warning.map((msg, index) => (
                    <li key={index} className="todo-item mb-2 flex justify-between p-2 bg-red-100 rounded shadow-md">
                      <input type="checkbox" disabled />
                      <span>{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Send results to database */}
            <FridgeSender results={results} />
          </div>
        )}

        {/* Button to show the graph */}
        <button onClick={() => setShowGraph(!showGraph)} className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all text-lg mt-4">
          {showGraph ? "Hide Graph" : "Show Graph"}
        </button>

        {/* Line Graph for Detected Items */}
        {showGraph && fridgeData && (
          <div className="mt-8" style={{ height: '1000px', width: '100%' }}> {/* Increased size by 5 times */}
            <Line data={graphData} options={{ responsive: true, plugins: { title: { display: true, text: 'Detected Items Over Time' } } }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FridgeAnalyzer;
