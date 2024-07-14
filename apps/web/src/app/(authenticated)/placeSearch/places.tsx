import '@reach/combobox/styles.css'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { Select } from 'antd'
import { useMemo, useState } from 'react'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import './map.css'

const { Option } = Select

export function Places({ onSelect }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  if (!isLoaded) return <div>Loading...</div>
  return <Map onSelect={onSelect} />
}

function Map({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const center = useMemo(
    () => selected || { lat: 43.45, lng: -80.49 },
    [selected],
  )

  const handleSelect = value => {
    setSelected({ lat: value.lat, lng: value.lng })

    onSelect(value.placeDetails)
  }

  return (
    <>
      <div style={{ width: '60%' }}>
        <PlacesAutocomplete setSelected={handleSelect} />
      </div>

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  )
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete()

  const handleSelect = async (address, value) => {
    setValue(value.children, false)
    clearSuggestions()

    const results = await getGeocode({ placeId: address })
    const { lat, lng } = await getLatLng(results[0])
    setSelected({
      placeDetails: { placeId: address, name: value.children },
      lat: lat,
      lng: lng,
    })
  }

  const handleChange = (value: string) => {
    setValue(value)
  }

  return (
    <Select
      showSearch
      value={value || undefined}
      placeholder="Search your place here"
      filterOption={false}
      onSelect={handleSelect}
      onSearch={handleChange}
      disabled={!ready}
      style={{ width: '100%', height: '40px' }}
    >
      {status === 'OK' &&
        data.map(({ place_id, description }) => (
          <Option key={place_id} value={place_id}>
            {description}
          </Option>
        ))}
    </Select>
  )
}
