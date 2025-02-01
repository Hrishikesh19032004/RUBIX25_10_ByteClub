import React, { useState } from 'react';
import CitySelector from './CitySelector';
import Analytics from './Analytics';
import Forecasting from './Forecasting';
import ImpactDetails from './ImpactDetails';
import CityMap from './CityMap';

const ImpactPage = () => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  return (
    <div>
      <h1>Impact Analysis</h1>
      <nav className="sub-navbar">
        <button onClick={() => setSelectedCity('Mumbai')}>Mumbai</button>
        <button onClick={() => setSelectedCity('Delhi')}>Delhi</button>
        <button onClick={() => setSelectedCity('Kolkata')}>Kolkata</button>
      </nav>

      <div className="content">
        <ImpactDetails city={selectedCity} />
        <Analytics city={selectedCity} />
        <Forecasting city={selectedCity} />
        <CityMap city={selectedCity} />
      </div>
    </div>
  );
};

export default ImpactPage;