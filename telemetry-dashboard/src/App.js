import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [form, setForm] = useState({
    equipmentId: '',
    timestamp: '',
    latitude: '',
    longitude: '',
    engineRpm: '',
    fuelLevel: '',
    soilMoisture: ''
  });

  // Use REACT_APP_API_URL in production, fallback to localhost in dev
  const API_BASE = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:8080';

  const fetchTelemetry = () => {
    setLoading(true);
    fetch('/api/v1/telemetry')
      .then(res => res.json())
      .then(d => { setData(d); setError(null); })
      .catch(() => setError('Failed to load telemetry data.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTelemetry, [API_BASE]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitError(null);

    // client‐side validation
    const { fuelLevel, engineRpm } = form;
    if (fuelLevel < 0 || fuelLevel > 100 || engineRpm < 0) {
      setSubmitError('Please enter valid ranges: fuel 0–100, RPM ≥ 0.');
      return;
    }

    const payload = {
      equipmentId: form.equipmentId,
      timestamp: new Date(form.timestamp).toISOString(),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      engineRpm: parseInt(form.engineRpm, 10),
      fuelLevel: parseFloat(form.fuelLevel),
      soilMoisture: parseFloat(form.soilMoisture)
    };

    fetch('/api/v1/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setForm({
          equipmentId: '',
          timestamp: '',
          latitude: '',
          longitude: '',
          engineRpm: '',
          fuelLevel: '',
          soilMoisture: ''
        });
        fetchTelemetry();
      })
      .catch(err => {
        console.error('Submit error:', err);
        setSubmitError(`Submission error: ${err.message}`);
      });
  };

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Engine RPM',
      data: data.map(d => d.engineRpm),
      fill: false,
      tension: 0.1
    }]
  };

  if (loading) return <div className="container">Loading telemetry data...</div>;
  if (error)   return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <h1>Telemetry Dashboard</h1>

      <form className="upload-form" onSubmit={handleSubmit}>
        <h2>Upload Telemetry Data</h2>
        {submitError && <div className="error">{submitError}</div>}

        <div className="form-grid">
          {/* Equipment ID */}
          <div className="form-group">
            <label htmlFor="equipmentId">Equipment ID</label>
            <input
              id="equipmentId"
              name="equipmentId"
              type="text"
              placeholder="e.g. tractor123"
              value={form.equipmentId}
              onChange={handleChange}
              required
            />
          </div>
          {/* Timestamp */}
          <div className="form-group">
            <label htmlFor="timestamp">Timestamp</label>
            <input
              id="timestamp"
              name="timestamp"
              type="datetime-local"
              value={form.timestamp}
              onChange={handleChange}
              required
            />
          </div>
          {/* Latitude */}
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              placeholder="e.g. 41.123"
              value={form.latitude}
              onChange={handleChange}
              required
            />
          </div>
          {/* Longitude */}
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              placeholder="e.g. -90.456"
              value={form.longitude}
              onChange={handleChange}
              required
            />
          </div>
          {/* Engine RPM */}
          <div className="form-group">
            <label htmlFor="engineRpm">Engine RPM</label>
            <input
              id="engineRpm"
              name="engineRpm"
              type="number"
              min="0"
              max="10000"
              placeholder="e.g. 2100"
              value={form.engineRpm}
              onChange={handleChange}
              required
            />
          </div>
          {/* Fuel Level */}
          <div className="form-group">
            <label htmlFor="fuelLevel">Fuel Level (%)</label>
            <input
              id="fuelLevel"
              name="fuelLevel"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 75.0"
              value={form.fuelLevel}
              onChange={handleChange}
              required
            />
          </div>
          {/* Soil Moisture */}
          <div className="form-group">
            <label htmlFor="soilMoisture">Soil Moisture (%)</label>
            <input
              id="soilMoisture"
              name="soilMoisture"
              type="number"
              step="any"
              placeholder="e.g. 23.5"
              value={form.soilMoisture}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment</th>
              <th>Timestamp</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>RPM</th>
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
        <MapContainer
          center={[data[0]?.latitude || 0, data[0]?.longitude || 0]}
          zoom={13}
          style={{ height: '100%' }}
        >
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