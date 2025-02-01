import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import foodBankData from "./FoodBank.json"; 
import Papa from "papaparse"; 
import shopDataCSV from "../Data/shop.csv"; 

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const shopIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/paddle/grn-blank.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const cityCoordinates = {
    Mumbai: [19.076, 72.8777],
    Delhi: [28.6139, 77.209],
    Bangalore: [12.9716, 77.5946],
    Chennai: [13.0827, 80.2785],
    Kolkata: [22.5726, 88.3639],
    Hyderabad: [17.385, 78.4867],
    Pune: [18.5204, 73.8567],
    Ahmedabad: [23.0225, 72.5714],
    Surat: [21.1702, 72.8311],
    Jaipur: [26.9124, 75.7873],
    Kanpur: [26.4478, 80.3218],
    Nagpur: [21.1458, 79.1090],
    Lucknow: [26.8468, 80.9462],
    Visakhapatnam: [17.6868, 83.2185],
    Bhopal: [23.2599, 77.4126],
    Patna: [25.5941, 85.1376],
    Vadodara: [22.3098, 73.1880],
    Ghaziabad: [28.6692, 77.4377],
    Ludhiana: [30.9009, 75.7804],
    Agra: [27.1767, 78.0081],
    Nashik: [19.9996, 73.9097],
    Coimbatore: [11.0168, 76.9558],
    Aurangabad: [19.8776, 75.3624],
    Jodhpur: [26.2764, 73.6850],
    Ranchi: [23.3441, 85.3095],
};

const JumpToMap = ({ selectedCity }) => {
    const map = useMap();

    useEffect(() => {
        const coordinates = cityCoordinates[selectedCity];
        if (coordinates) {
            map.flyTo(coordinates, 13, { animate: true, duration: 1 });
        }
    }, [map, selectedCity]);

    return null;
};

const MapComponent = () => {
    const [selectedCity, setSelectedCity] = useState("Mumbai");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFoodBank, setSelectedFoodBank] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [shops, setShops] = useState([]);

    useEffect(() => {
        Papa.parse(shopDataCSV, {
            download: true,
            header: true,
            complete: (results) => {
                setShops(results.data);
            },
        });
    }, []);

    useEffect(() => {
        const matchedCity = Object.keys(cityCoordinates).find(city =>
            city.toLowerCase() === searchTerm.toLowerCase()
        );
        if (matchedCity) {
            setSelectedCity(matchedCity);
            setSearchTerm("");
        }
    }, [searchTerm]);

    const filteredFoodBanks = foodBankData.features.filter(
        (foodBank) => foodBank.properties.City.toLowerCase() === selectedCity.toLowerCase()
    );

    const handleFoodBankClick = (foodBank) => {
        setSelectedFoodBank(foodBank);
        setSelectedShop(null);
    };

    const clearFoodBank = () => {
        setSelectedFoodBank(null);
    };

    const clearShop = () => {
        setSelectedShop(null);
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getShopsWithinRadius = () => {
        if (!selectedFoodBank) return [];
        const foodBankLat = selectedFoodBank.geometry.coordinates[1];
        const foodBankLon = selectedFoodBank.geometry.coordinates[0];
        return shops.filter(shop => {
            const shopLat = shop.Latitude;
            const shopLon = shop.Longitude;
            return getDistance(foodBankLat, foodBankLon, shopLat, shopLon) <= 2;
        });
    };

    const filteredShops = getShopsWithinRadius();

    const handleShopClick = (shop) => {
        setSelectedShop(shop);
    };

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                placeholder="Search for food banks in a city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    marginBottom: "10px",
                    padding: "10px",
                    width: "300px",
                    borderRadius: "5px",
                    zIndex: 1000,
                }}
            />
            <div style={{ height: "600px", width: "100%", position: "relative" }}>
                <MapContainer
                    center={cityCoordinates[selectedCity]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <JumpToMap selectedCity={selectedCity} />
                    {filteredFoodBanks.map((foodBank, index) => (
                        <Marker
                            key={index}
                            position={[
                                foodBank.geometry.coordinates[1],
                                foodBank.geometry.coordinates[0],
                            ]}
                            eventHandlers={{
                                click: () => handleFoodBankClick(foodBank),
                            }}
                        />
                    ))}
                    {filteredShops.map((shop, index) => (
                        <Marker
                            key={index}
                            position={[shop.Latitude, shop.Longitude]}
                            icon={shopIcon}
                            eventHandlers={{
                                click: () => handleShopClick(shop),
                            }}
                        />
                    ))}
                </MapContainer>
                {selectedFoodBank && (
                    <div
                        style={{
                            background: "#fff",
                            padding: "10px",
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            zIndex: 1000,
                            width: "300px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2>{selectedFoodBank.properties["Food Bank Name"]}</h2>
                            <button
                                onClick={clearFoodBank}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <p>
                            <strong>City:</strong> {selectedFoodBank.properties.City}
                        </p>
                        <p>
                            <strong>Address:</strong> {selectedFoodBank.properties.Address}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedFoodBank.properties.Description}
                        </p>
                    </div>
                )}
                {selectedShop && (
                    <div
                        style={{
                            background: "#fff",
                            padding: "10px",
                            position: "absolute",
                            top: "100px",
                            left: "20px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            zIndex: 1000,
                            width: "300px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2>{selectedShop.Name}</h2>
                            <button
                                onClick={clearShop}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <p>
                            <strong>Address:</strong> {selectedShop.Address}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
