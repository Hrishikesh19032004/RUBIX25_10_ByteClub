// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (ensure MongoDB is running)
mongoose.connect("mongodb://localhost:27017/fridgeAnalyzer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Define a schema for the fridge data
const fridgeSchema = new mongoose.Schema({
  inventory_status: String,
  detected_items: [{ item: String, confidence: Number }],
  grocery_needed: [String],
  food_waste_warning: [String],
  timestamp: { type: Date, default: Date.now },
});

// Create a model from the schema
const FridgeData = mongoose.model("FridgeData", fridgeSchema);
// Fetch fridge data from the database
app.get("/getFridgeData", async (req, res) => {
    try {
      // Fetch the fridge data sorted by timestamp
      const fridgeData = await FridgeData.find().sort({ timestamp: 1 });
  
      // Extract the size of detected_items for plotting
      const dataForGraph = fridgeData.map((data) => ({
        timestamp: data.timestamp,
        detectedItemsCount: data.detected_items.length,
      }));
  
      res.status(200).json(dataForGraph);
    } catch (error) {
      console.error("Error fetching fridge data:", error);
      res.status(500).send({ message: "An error occurred while fetching data." });
    }
  });
  
// POST endpoint to store results
app.post("/storeResults", async (req, res) => {
  try {
    const results = req.body;

    // Create a new entry in the database
    const newFridgeData = new FridgeData(results);

    // Save the data to the database
    await newFridgeData.save();

    res.status(200).send({ message: "Data successfully saved to the database!" });
  } catch (error) {
    console.error("Error saving data to the database:", error);
    res.status(500).send({ message: "An error occurred while saving data." });
  }
});

// Start the server
const port = 3100;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
