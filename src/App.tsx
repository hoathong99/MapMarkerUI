import { useState } from 'react'
import './App.css'
import MapComponent from './components/MapDisplay/Map'
import { LocationMark } from './components/DTO/interfaces';

const center: LocationMark = {
    id: "1",
    lat: 37.7749, // Latitude for San Francisco
    lng: -122.4194, // Longitude for San Francisco
    label: "San Francisco"
};

// Example list of coordinates with content
const locations: LocationMark[] = [
    { id: "2", lat: 37.7749, lng: -122.4194, label: "San Francisco" },
    { id: "3", lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { id: "4", lat: 40.7128, lng: -74.006, label: "New York" },
];

function App() {


  return (
    <>
      <MapComponent list={locations} heading={center.label} centerMark={center}>

      </MapComponent>
    </>
  )
}

export default App
