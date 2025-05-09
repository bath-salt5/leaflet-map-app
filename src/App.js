import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const position = [1.3521, 103.8198]; // Singapore
  const [year, setYear] = useState('2020');
  const [geoData, setGeoData] = useState(null);
  
  useEffect(() => {
    fetch(`/data/${year}.geojson`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => {
        console.error(`Failed to load GeoJSON for ${year}:`, err);
        setGeoData(null);
      });
  }, [year]);

  return (
    <div style={{justifyContent: 'center'}}>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Select Year:&nbsp;
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2025">2025</option>
            <option value="2020">2020</option>
          </select>
        </label>
      </div>

      <div style={{ height: '500px', width: '60%', margin: '0 auto', border: '2px solid #ccc' }}>
        <MapContainer center={position} zoom={11} style={{ height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && (
            <GeoJSON
              data={geoData}
              style={{ color: 'blue', weight: 2, fillOpacity: 0.1 }}
              onEachFeature={(feature, layer) => {
                if (feature.properties?.name) {
                  layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
                }
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
