import { createRoot } from 'react-dom/client';
import { GeoJSON } from 'react-leaflet';
import { partyColors } from './consts';
import { hexToRgb, rgbToHex} from './conversion';

function convertColor(partyColor, percentage) {
  if (!partyColor) return '#808080';
  const rgbParty = hexToRgb(partyColor);
  const t = Math.min((percentage - 50) / 32, 1);
  const r = Math.round(255 + t * (rgbParty.r - 255));
  const g = Math.round(255 + t * (rgbParty.g - 255));
  const b = Math.round(255 + t * (rgbParty.b - 255));
  return rgbToHex(r, g, b);
}

const Boundary = ({ data, label = 'Boundary' }) => {
  if (!data) return null;

  const style = (feature) => {
    const party = feature.properties?.Winning_Party;
    const percentage = feature.properties?.Percentage;
    
    // Get base color from partyColors
    const baseColor = partyColors[party] || '#808080';
    let fillColor = baseColor;
    let fillOpacity = 0.8;
    
    // Calculate fill color and opacity
    if (percentage > 0){
        fillColor = convertColor(baseColor, percentage);
        fillOpacity = 0.3 + (Math.min(Math.max(percentage, 50), 82) - 50) / 32 * 0.7;;
    }
    
    return {
      color: '#000000', // Border color
      weight: 2,
      fillColor,
      fillOpacity: Math.min(Math.max(fillOpacity, 0.3), 0.8), // Clamp between 0.1 and 1
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const container = document.createElement('div');
      const root = createRoot(container);

      root.render(
        <div>
          <h4>{feature.properties.Name || 'Area Info'}</h4>
          <ul style={{ paddingLeft: '1em' }}>
            <li><strong>Winning Party:</strong> {feature.properties.Winning_Party}</li>
            <li><strong>Vote Percentage:</strong> {feature.properties.Percentage}%</li>
            <li><strong>Status: </strong>{feature.properties.Status || 'Contested'}</li>
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