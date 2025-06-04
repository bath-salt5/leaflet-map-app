import React from 'react';

const Legend = ({ items, style }) => {
  return (
    <div className="legend" style={style}>
      <p>Legend</p>
      {items.map((item, index) => (
        <div key={index} className="legend-item">
          <div
            className="box"
            style={{ background: `linear-gradient(to right, #808080, ${item.color})` }}
          ></div>
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
