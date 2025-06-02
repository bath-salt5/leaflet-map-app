import { createRoot } from 'react-dom/client';
import { GeoJSON } from 'react-leaflet';

const Boundary = ({data, color = 'blue', label = 'Boundary'}) => {
    if (!data) return null;
    const style = {
        color: color,
        weight: 2,
        fillOpacity: 0.2,
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
    return <GeoJSON key={data.name} data={data} style={style} onEachFeature={onEachFeature} />;
}

export default Boundary;
 
