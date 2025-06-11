'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

interface Location {
  lat: number;
  lon: number;
  title: string;
}

interface MapTabProps {
  locations: Location[];
}

export default function MapTab({ locations }: MapTabProps) {
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllPlaces = async () => {
      const allPlaces: any[] = [];

      for (const loc of locations) {
        // Sla over als coördinaten ontbreken
        if (!loc.lat || !loc.lon) continue;

        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${loc.lat}|${loc.lon}&gsradius=20000&gslimit=100&format=json&origin=*`
        );
        const data = await res.json();
        allPlaces.push(...(data.query.geosearch || []));
      }

      setPlaces(allPlaces);
    };

    fetchAllPlaces();
  }, [locations]);

  const defaultCenter: [number, number] = [locations[0].lat, locations[0].lon];

  return (
    <div className="h-[500px] w-full">
      <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => (
          <Marker
            key={`${place.pageid}-${place.lat}-${place.lon}`}
            position={[place.lat, place.lon]}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>{place.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
