import React, { useState, useEffect } from "react";
import axios from "axios";
import foodBanksData from "../Data/FoodBank.json"; // assuming FoodBank.json is in the same directory

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    itemName: "",
    itemQty: "",
    latitude: "",
    longitude: "",
  });

  const [searchCity, setSearchCity] = useState("");
  const [filteredFoodBanks, setFilteredFoodBanks] = useState([]);
  const [selectedFoodBank, setSelectedFoodBank] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(true); // new state to toggle between current location and manual input

  // Handles input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch the current location of the user and fill it in the form
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setUseCurrentLocation(true); // Ensure current location is used
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handles search for food banks by city
  const handleSearch = () => {
    const cityFoodBanks = foodBanksData.features.filter(
      (foodBank) => foodBank.properties.City.toLowerCase() === searchCity.toLowerCase()
    );
    setFilteredFoodBanks(cityFoodBanks);
  };

  // Handles the selection of a food bank
  const handleFoodBankSelection = (foodBank) => {
    setSelectedFoodBank(foodBank);
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFoodBank) {
      alert("Please select a food bank before submitting.");
      return;
    }

    try {
      // Prepare the data to send to backend including food bank info
      const payload = {
        ...formData,
        foodBankName: selectedFoodBank.properties["Food Bank Name"],
        foodBankCity: selectedFoodBank.properties.City,
        foodBankDescription: selectedFoodBank.properties.Description,
        foodBankLatitude: selectedFoodBank.geometry.coordinates[1],
        foodBankLongitude: selectedFoodBank.geometry.coordinates[0],
      };

      // Sending data to backend
      const response = await axios.post("http://localhost:1212/api/donations", payload);
      setSuccessMessage(response.data.message);

      // Reset form after submission
      setFormData({
        name: "",
        phone: "",
        itemName: "",
        itemQty: "",
        latitude: "",
        longitude: "",
      });
      setSelectedFoodBank(null);
      setFilteredFoodBanks([]);

      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to add donation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 p-8">
      <h1 className="text-2xl font-bold mb-6">Food Donation Form</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        {/* Form Fields */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemName" className="block text-gray-700 text-sm font-bold mb-2">
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemQty" className="block text-gray-700 text-sm font-bold mb-2">
            Item Quantity
          </label>
          <input
            type="number"
            id="itemQty"
            name="itemQty"
            value={formData.itemQty}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={handleGetLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Use Current Location
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="latitude" className="block text-gray-700 text-sm font-bold mb-2">
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="py-2 px-3 border rounded-md focus:outline-none w-full"
            disabled={useCurrentLocation} // disable input if current location is used
          />
        </div>

        <div className="mb-4">
          <label htmlFor="longitude" className="block text-gray-700 text-sm font-bold mb-2">
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="py-2 px-3 border rounded-md focus:outline-none w-full"
            disabled={useCurrentLocation} // disable input if current location is used
          />
        </div>

        <h2 className="text-lg font-bold mb-4">Search Food Banks</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded hover:bg-green-700"
          >
            Search
          </button>
        </div>

        <div className="mb-4">
          <ul className="list-disc pl-6">
            {filteredFoodBanks.map((foodBank, index) => (
              <li
                key={index}
                className={`cursor-pointer ${selectedFoodBank === foodBank ? "bg-green-200" : ""}`}
                onClick={() => handleFoodBankSelection(foodBank)}
              >
                <strong>{foodBank.properties["Food Bank Name"]}</strong> - {foodBank.properties.City}
                <p>{foodBank.properties.Description}</p>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit
        </button>
      </form>

      {successMessage && <p className="text-green-600 font-bold">{successMessage}</p>}
    </div>
  );
};

export default FormComponent;
