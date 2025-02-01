from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS
from ultralytics import YOLO
from datetime import datetime
import logging
import os

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all domains (you can also specify certain origins)
CORS(app)  # This enables CORS on all routes

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load YOLOv8 model dynamically based on environment variable or default to yolov8x.pt
MODEL_PATH = os.getenv("YOLO_MODEL", "yolov8x.pt")  # Default to YOLOv8 Extra Large model
logging.info(f"Loading YOLO model: {MODEL_PATH}")
model = YOLO(MODEL_PATH)  # Automatically downloads the model if not available locally

# Create a folder to save uploaded images
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Function to process the image and detect items
def process_image(image_path):
    results = model(image_path)  # Run YOLOv8 on the image

    # Extracting detections
    detections = results[0].boxes.data.cpu().numpy()  # Get bounding boxes data
    items_detected = []

    # Loop through all detections
    for det in detections:
        x1, y1, x2, y2, conf, cls = det
        label = results[0].names[int(cls)]  # Get class label for the detected object
        
        # Only include high-confidence detections (optional, adjust threshold)
        if conf > 0.2:  # You can adjust the confidence threshold here
            items_detected.append({"item": label, "confidence": round(float(conf), 2)})

    return items_detected


# Function to analyze the detected items and categorize them
def analyze_fridge(items):
    grocery_needed = []
    food_waste_warning = []
    item_count = len(items)
    inventory_status = ""

    # Classify fridge inventory status
    if item_count < 6:
        inventory_status = "Your fridge seems empty. Consider grocery shopping."
        grocery_needed.append(inventory_status)
    elif item_count <= 12:
        inventory_status = "Your fridge has just enough items."
    else:
        inventory_status = "Your fridge might have excess items. Be mindful of food wastage."

    return inventory_status, grocery_needed, food_waste_warning


# API endpoint to upload an image
@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided."}), 400

        image = request.files["image"]
        if image.filename == "":
            return jsonify({"error": "No selected file."}), 400

        if image:
            # Save the image
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], f"fridge_{timestamp}.jpg")
            image.save(image_path)

            # Process the image
            items_detected = process_image(image_path)

            # Analyze fridge content
            inventory_status, grocery_needed, food_waste_warning = analyze_fridge(items_detected)

            # Logging the results for debugging
            logging.info(f"Detected Items: {items_detected}")
            logging.info(f"Inventory Status: {inventory_status}")
            logging.info(f"Grocery Needed: {grocery_needed}")
            logging.info(f"Food Waste Warning: {food_waste_warning}")

            # Return results
            return jsonify({
                "status": "success",
                "detected_items": items_detected,
                "inventory_status": inventory_status,
                "grocery_needed": grocery_needed,
                "food_waste_warning": food_waste_warning,
            }), 200

    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"error": "An error occurred during analysis."}), 500


# Health check endpoint
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running."})


# Run the app
if __name__ == "__main__":
    port = int(os.getenv("PORT", 3200))
    app.run(debug=True, port=port)
