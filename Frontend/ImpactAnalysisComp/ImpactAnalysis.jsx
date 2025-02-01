import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from "recharts";
import { motion } from 'framer-motion';

const FoodWasteAnalysis = () => {
  const [state, setState] = useState("");
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [inferences, setInferences] = useState({});
  const [pieData, setPieData] = useState([]); // State for pie chart data
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("line"); // State to toggle between line and pie chart

  const states = [
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chhattisgarh", "Goa"
  ];

  const filteredStates = states.filter(stateName => stateName.toLowerCase().includes(state.toLowerCase()));

  const fetchAnalysis = async () => {
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", { state });
  
      const updatedYearlyTrends = response.data.yearly_trends.map((trend) => {
        let fluctuation = 0;
  
        if (trend.Year === 2020) fluctuation = 0.10;  
        else if (trend.Year === 2021) fluctuation = 0.07;  
        else if (trend.Year === 2022) fluctuation = 0.05;  
        else fluctuation = 0.005;
  
        const foodWasted = trend["Food Wasted (Tonnes)"];
        trend["Food Wasted (Tonnes)"] = foodWasted - (foodWasted * fluctuation);
  
        return trend;
      });
  
      setYearlyTrends(updatedYearlyTrends);
      setPredictions(response.data.predictions);
      setInferences(response.data.inferences);
      setPieData(response.data.pie_data);  // Set pie chart data from the backend response
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Food Waste Impact Analysis</h1>

      {/* Animated Search Bar */}
      <motion.input
        type="text"
        placeholder="Search State..."
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Display filtered states based on search */}
      {state && (
        <motion.ul
          style={{ maxHeight: "200px", overflowY: "auto", padding: "0", marginTop: "10px", border: "1px solid #ccc", width: "300px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredStates.map((stateName, index) => (
            <motion.li
              key={index}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => setState(stateName)}
              whileHover={{ scale: 1.1 }}
            >
              {stateName}
            </motion.li>
          ))}
        </motion.ul>
      )}

      <motion.button
        onClick={fetchAnalysis}
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Analyze
      </motion.button>

      {/* Error Display */}
      {error && (
        <motion.p
          style={{ color: "red", marginTop: "20px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* Button to switch between Line and Pie Chart */}
      <motion.button
        onClick={() => setChartType(chartType === "line" ? "pie" : "line")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#008CBA",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Switch to {chartType === "line" ? "Pie Chart" : "Line Chart"}
      </motion.button>

      {/* Animated Graphs */}
      {yearlyTrends.length > 0 && chartType === "line" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Yearly Food Waste Trends</h2>
          <LineChart width={800} height={400} data={yearlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Food Wasted (Tonnes)" stroke="#8884d8" />
          </LineChart>
        </motion.div>
      )}

      {pieData.length > 0 && chartType === "pie" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Food Waste Causes Breakdown</h2>
          <PieChart width={800} height={400}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#82ca9d">
              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ff8c00', '#ff0000'][index]} />)}
            </Pie>
            <PieTooltip />
            <PieLegend />
          </PieChart>
        </motion.div>
      )}

      {/* Inferences with animation */}
      {Object.keys(inferences).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>Inferences</h2>
          <ul>
            <li>Landfills Increase: {inferences["Landfills Increase (%)"]}%</li>
            <li>Fire Risk: {inferences["Fire Risk (%)"]}%</li>
            <li>Composting Needs Increase: {inferences["Composting Needs Increase (%)"]}%</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default FoodWasteAnalysis;
