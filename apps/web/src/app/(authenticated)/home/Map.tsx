// src/components/Map.tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import React from 'react'

type BusinessLocation = {
  id: number
  name: string
  position: { lat: number; lng: number }
}

const businessLocations: BusinessLocation[] = [
  { id: 1, name: 'Kicks', position: { lat: 37.7749, lng: -122.4194 } },
  { id: 2, name: 'Chloe', position: { lat: 34.0522, lng: -118.2437 } },
  { id: 3, name: 'Kashmir Arts', position: { lat: 40.7128, lng: -74.006 } },
]

const containerStyle = {
  width: '100%',
  height: '400px',
}

const center = {
  lat: 37.7749,
  lng: -122.4194,
}

const Map: React.FC = () => {

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAWfmbSpwohrxws5omCa0y6e23bqBT17QM"
      loadingElement={<div style={{ height: `100%` }} />}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {businessLocations.map(location => (
          <Marker
            key={location.id}
            position={location.position}
            label={location.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}

export default Map
