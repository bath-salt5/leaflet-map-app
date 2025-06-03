import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Boundary from './components/Boundaries';
import 'leaflet/dist/leaflet.css';

const availableYears = [2006, 2011, 2015, 2020, 2025];

function App() {
  const position = [1.3521, 103.8198]; // Singapore
  const [selectedYear, setSelectedYear] = useState(2025);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
    let yearToFetch = selectedYear;

    if (!availableYears.includes(selectedYear)) {
      // Find the closest past year
      const pastYears = availableYears.filter((y) => y <= selectedYear);
      if (pastYears.length === 0) {
        // No available past year; handle accordingly
        setGeoData(null);
        return;
      }
      yearToFetch = Math.max(...pastYears);
    }

    try {
      const res = await fetch(`/data/${yearToFetch}_updated.geojson`);
      const data = await res.json();
      setGeoData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setGeoData(null);
    }
  };

    fetchData();
  }, [selectedYear]);

  const handleSliderChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ justifyContent: 'center' }}>
      <div style={{ width: '60%', margin: '0 auto', padding: '20px' }}>
        <label htmlFor="yearSlider">Year: {selectedYear}</label>
        <input
          id="yearSlider"
          type="range"
          min="2006"
          max="2025"
          value={selectedYear}
          onChange={handleSliderChange}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ height: '500px', width: '60%', margin: '0 auto', border: '2px solid #ccc' }}>
        <MapContainer center={position} zoom={11} style={{ height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && <Boundary data={geoData} color="red" label="Boundaries" />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
