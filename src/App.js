import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Boundary from './components/Boundaries';
import Legend from './components/Legend';
import './components/Legend.css';
import { colours } from './components/consts';
import 'leaflet/dist/leaflet.css';

const availableYears = [2006, 2011, 2015, 2020, 2025];

function App() {
  const position = [1.3521, 103.8198]; // Singapore
  const [selectedYear, setSelectedYear] = useState(2025);
  const [yearidx, setYearIdx] = useState(4);
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
    if(yearToFetch !== availableYears[yearidx]){
        setYearIdx(availableYears.findIndex(y => y === yearToFetch));
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
  }, [selectedYear, yearidx]);

  const handleSliderChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ justifyContent: 'center' }}>
      <div style={{ width: '60%', margin: '0 auto', padding: '20px' }}>
        <label htmlFor="yearSlider">Year: {selectedYear} (Electoral boundaries from {availableYears[yearidx]})</label>
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
      <div style={{ display: 'flex', width: '80%', margin: '0 auto' }}>
        <div style={{ height: '500px', border: '2px solid #ccc', flex: 1 }}>
          <MapContainer center={position} zoom={11} style={{ height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData && <Boundary data={geoData} label="Boundaries" />}
          </MapContainer>
        </div>
        <Legend items={colours} style={{ alignSelf: 'flex-start' }} />
      </div>

      
    </div>
  );
}

export default App;
