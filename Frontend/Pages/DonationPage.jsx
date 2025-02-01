import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DonationPage = () => {
  const [donationNeeds, setDonationNeeds] = useState([]);
  const [selectedNeed, setSelectedNeed] = useState(null); // State to store the selected donation need for the modal
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [userName, setUserName] = useState(''); // State for user name
  const [donationAmount, setDonationAmount] = useState(''); // State for donation amount
  const [error, setError] = useState(null); // State for error handling

  // Fetch donation needs from the backend
  useEffect(() => {
    const fetchDonationNeeds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/institutes/donation-needs');
        setDonationNeeds(response.data); // Store donation needs in state
      } catch (error) {
        console.error('Error fetching donation needs:', error);
      }
    };

    fetchDonationNeeds();
  }, []);

  // Open modal with selected donation need
  const openModal = (need) => {
    setSelectedNeed(need);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedNeed(null);
    setUserName(''); // Reset user name
    setDonationAmount(''); // Reset donation amount
    setIsOpen(false);
    setError(null); // Reset error
  };

  // Submit donation form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); // Fetch the token from local storage

    // Prepare the donation payload
    const donationData = {
      amount: parseFloat(donationAmount),
      instituteId: selectedNeed.instituteId._id, // Use the selected institute's ID
      description: `Donation from ${userName}`, // Custom description
    };

    try {
      const response = await axios.post('http://localhost:5000/api/institutes/donate', donationData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
          'Content-Type': 'application/json',
        },
      });

      console.log('Donation successful:', response.data);
      closeModal(); // Close the modal after successful donation
    } catch (error) {
      setError(error.response?.data.message || 'Error submitting donation.'); // Capture and display error message
      console.error('Error during donation:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f7f7', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Donation Requirements</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {donationNeeds.map((need) => (
            <div
              key={need._id}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
              }}
              onClick={() => openModal(need)} // Open modal on click
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{need.instituteId.name}</h3>
              <p><strong>Location:</strong> {need.instituteId.location}</p>
              <p><strong>Contact:</strong> {need.instituteId.contactInfo}</p>
              <p><strong>Description:</strong> {need.description}</p>
              <p><strong>Amount Needed:</strong> ${need.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && selectedNeed && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            position: 'relative',
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Donate to {selectedNeed.instituteId.name}</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>{selectedNeed.description}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '.5rem' }}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div>
                <label htmlFor="amount" style={{ display: 'block', marginBottom: '.5rem' }}>Donation Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter donation amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#FF5722',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '1rem',
                }}
              >
                Donate
              </button>
            </form>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
