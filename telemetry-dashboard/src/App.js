
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

// Fix Leaflet icon issues
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

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8080/api/v1/telemetry')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError('Failed to load telemetry data. Make sure the backend server is running.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const chartData = {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
            label: 'Engine RPM',
            data: data.map(d => d.engineRpm),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    if (loading) {
        return <div className="container">Loading telemetry data...</div>;
    }

    if (error) {
        return <div className="container error">{error}</div>;
    }

    if (data.length === 0) {
        return (
            <div className="container">
                <h1>Telemetry Dashboard</h1>
                <p>No telemetry data available. Add some data using the API.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Telemetry Dashboard</h1>
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
                <MapContainer center={[data[0]?.latitude || 41.878113, data[0]?.longitude || -87.629799]} zoom={13} style={{ height: '100%' }}>
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