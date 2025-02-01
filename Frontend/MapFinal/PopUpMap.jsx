import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import axios from "axios";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Ask.css'
import volunteerData from '../Data/Volunteer.json';

const PopUpMap = () => {
  const [routes, setRoutes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");

  const shopIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/paddle/red-blank.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:1212/api/donations");
      setDonations(response.data);
      fetchRoutes(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchRoutes = async (donations) => {
    const fetchedRoutes = [];
    for (const donation of donations) {
      try {
        const startLocation = [parseFloat(donation.latitude), parseFloat(donation.longitude)];
        const endLocation = [parseFloat(donation.foodBankLatitude), parseFloat(donation.foodBankLongitude)];

        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${startLocation[1]},${startLocation[0]};${endLocation[1]},${endLocation[0]}?overview=full&geometries=geojson`
        );

        if (response.data.routes && response.data.routes.length > 0) {
          fetchedRoutes.push({
            startLocation,
            endLocation,
            route: response.data.routes[0].geometry.coordinates,
            donorName: donation.name,
            foodBankName: donation.foodBankName
          });
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
    setRoutes(fetchedRoutes);
  };

  const toggleShowVolunteers = () => {
    setShowVolunteers((prevState) => !prevState);
    if (!showVolunteers) {
      setVolunteers(volunteerData);
    }
  };

  useEffect(() => {
    fetchDonations();
    const intervalId = setInterval(fetchDonations, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAskButtonClick = () => {
    toast.success("Message successfully sent to the volunteer!");
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <button onClick={toggleShowVolunteers} style={{ position: "absolute", zIndex: 1000, margin: "10px" }}>
        {showVolunteers ? "Hide Volunteers" : "Show Volunteers"}
      </button>

      <MapContainer center={[19.0785, 72.8718]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {routes.map((routeData, index) => (
          <Polyline
            key={index}
            positions={routeData.route.map((coord) => [coord[1], coord[0]])}
            color="#1E90FF"
            weight={5}
            opacity={0.7}
          />
        ))}

        {donations.map((donation, index) => (
          <div key={index}>
            <Marker position={[parseFloat(donation.latitude), parseFloat(donation.longitude)]}>
              <Popup>
                <strong>Donor: {donation.name}</strong><br />
                Latitude: {donation.latitude}, Longitude: {donation.longitude}
              </Popup>
            </Marker>

            <Marker position={[parseFloat(donation.foodBankLatitude), parseFloat(donation.foodBankLongitude)]}>
              <Popup>
                <strong>Food Bank: {donation.foodBankName}</strong><br />
                Latitude: {donation.foodBankLatitude}, Longitude: {donation.foodBankLongitude}
              </Popup>
            </Marker>
          </div>
        ))}

        {showVolunteers && volunteers.map((volunteer, index) => (
          <Marker
            key={index}
            position={[parseFloat(volunteer.latitude), parseFloat(volunteer.longitude)]}
            icon={shopIcon}
          >
            <Popup>
              <strong>Volunteer: {volunteer.name}</strong><br />
              Location: {volunteer.latitude}, {volunteer.longitude}<br />
              Phone: {volunteer.phone}<br />
              <button className="ask-button" onClick={handleAskButtonClick}>Ask</button>

            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <ToastContainer />
    </div>
  );
};

export default PopUpMap;
