import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Container = styled.div`
  font-family: sans-serif;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
`;

const ChartWrapper = styled.div`
  margin: 2rem 0;
  display: grid;
  gap: 2rem;
`;

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('http://localhost:5173/'); // 👈 update to your actual WebSocket URL

    socket.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        const timestamp = new Date().toLocaleTimeString();

        setData(prev => [
          ...prev.slice(-29), // keep last 30
          { ...json, timestamp },
        ]);
      } catch (e) {
        console.error('Failed to parse message:', event.data);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <Container>
      <Title>🌱 Soil Sensor Live Dashboard</Title>

      <ChartWrapper>
        <LineChart width={600} height={250} data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="moisture" stroke="#82ca9d" name="Moisture (%)" />
        </LineChart>

        <LineChart width={600} height={250} data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 50]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
        </LineChart>

        <LineChart width={600} height={250} data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 14]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="pH" stroke="#ffc658" name="pH Level" />
        </LineChart>
      </ChartWrapper>
    </Container>
  );
}

export default App;
