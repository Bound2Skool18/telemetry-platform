#!/usr/bin/env zsh

# Exit on error
set -e

# Project name
PROJECT_NAME="telemetry-dashboard"

# 1. Scaffold React app
echo "> Creating React app: $PROJECT_NAME"
npx create-react-app $PROJECT_NAME

# 2. Navigate into directory
cd $PROJECT_NAME

echo "> Installing dependencies"
# 3. Install required packages
npm install chart.js react-chartjs-2 leaflet react-leaflet

# 4. Clean up default files
rm src/App.css src/logo.svg src/index.css

echo "> Generating App.js and supporting files"
# 5. Generate core frontend files
cat << 'EOF' > src/App.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/telemetry')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Engine RPM',
      data: data.map(d => d.engineRpm),
      fill: false,
      tension: 0.1
    }]
  };

  return (
    <div className="container">
      <h1>Telemetry Dashboard</h1>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Equipment</th><th>Timestamp</th>
              <th>Latitude</th><th>Longitude</th><th>RPM</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.equipmentId}</td>
                <td>{new Date(d.timestamp).toLocaleString()}</td>
                <td>{d.latitude}</td>
                <td>{d.longitude}</td>
                <td>{d.engineRpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="chart">
        <Line data={chartData} />
      </div>
      <div className="map" style={{ height: '400px', marginTop: '1rem' }}>
        <MapContainer center={[data[0]?.latitude || 0, data[0]?.longitude || 0]} zoom={13} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map(d => (
            <Marker position={[d.latitude, d.longitude]} key={d.id}>
              <Popup>{d.equipmentId}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
EOF

# 6. Create basic styling
cat << 'EOF' > src/App.css
.container { padding: 1rem; font-family: sans-serif; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 0.5rem; }
.chart { margin-top: 2rem; }
EOF

# 7. Launch the development server
echo "> Starting development server"
npm start
