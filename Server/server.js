const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 1212;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mapRoutingData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define a schema and model for donations
const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  itemName: { type: String, required: true },
  itemQty: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  foodBankName: { type: String, required: true },
  foodBankCity: { type: String, required: true },
  foodBankDescription: { type: String, required: true },
  foodBankLatitude: { type: String, required: true },
  foodBankLongitude: { type: String, required: true },
});

const Donation = mongoose.model("Donation", donationSchema);

// Routes
app.post("/api/donations", async (req, res) => {
    try {
      // Log the incoming request body to see the data
      console.log("Incoming donation data:", req.body);
  
      const donation = new Donation(req.body);
      await donation.save();
      res.status(201).json({ message: "Donation added successfully", donation });
    } catch (error) {
      console.error("Error while adding donation:", error); // Log the error for better debugging
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding donation", error });
    }
  });
  
  

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
