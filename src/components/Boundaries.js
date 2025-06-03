import { createRoot } from 'react-dom/client';
import { GeoJSON } from 'react-leaflet';

const partyColors = {
  PAP: '#ffffff', // White
  WP: '#1f77b4',  // Blue
  SDA: '#d62728'
};

const Boundary = ({ data, label = 'Boundary' }) => {
  if (!data) return null;

  const style = (feature) => {
    const party = feature.properties?.Winning_Party;
    const fillColor = partyColors[party] || '#808080'; // Default color if party not found
    let fillOpacity = 0.5;
    const percentage = feature.properties?.Percentage;
    if (percentage === 0) {
        // Uncontested constituency
        fillOpacity = 1; // Lower opacity for uncontested areas
    } else {
        const scaledPercentage = Math.pow((percentage - 50) / 30, 2); // Adjust the formula as needed
        fillOpacity = 0.3 + scaledPercentage * 0.7;
        fillOpacity = Math.min(fillOpacity, 1.0);
    }
    return {
      color: '#000000',     // Border color
      weight: 2,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const container = document.createElement('div');
      const root = createRoot(container);

      const props = feature.properties;
      root.render(
        <div>
          <h4>Area Info</h4>
          <ul style={{ paddingLeft: '1em' }}>
            {Object.entries(props).map(([key, value]) => (
              <li key={key}>
                <strong>{key}</strong>: {String(value)}
              </li>
            ))}
          </ul>
        </div>
      );

      layer.bindPopup(container);
    }
  };

  return (
    <GeoJSON
      key={data.name}
      data={data}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default Boundary;

 
