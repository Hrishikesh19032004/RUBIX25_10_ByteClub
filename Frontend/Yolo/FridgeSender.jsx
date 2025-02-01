// FridgeSender.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FridgeSender = ({ results }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (results) {
      sendResultsToDatabase(results);
    }
  }, [results]);

  const sendResultsToDatabase = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Send the analyzed results to the backend for storage in the database
      const response = await axios.post("http://127.0.0.1:3100/storeResults", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Data successfully saved to the database!");
      }
    } catch (error) {
      console.error("Error saving data to the database", error);
      setError("An error occurred while saving data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fridge-sender">
      {loading && <p className="text-center text-gray-600">Saving data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMessage && <p className="text-center text-green-600">{successMessage}</p>}
    </div>
  );
};

export default FridgeSender;
