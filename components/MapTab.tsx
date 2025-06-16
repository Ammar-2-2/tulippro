'use client'; 

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; //  Leaflet map componenten
import { useEffect, useState } from 'react';
import L from 'leaflet'; //  Nodig voor custom marker icon

//  Type voor individuele locatie
interface Location {
  lat: number;
  lon: number;
  title: string;
}

//  Props van het component: lijst met locaties
interface MapTabProps {
  locations: Location[];
}

export default function MapTab({ locations }: MapTabProps) {
  const [places, setPlaces] = useState<any[]>([]); //  Opgeslagen plekken van Wikipedia-API

  //  Haal bezienswaardigheden op Wikipedia GeoSearch API
  useEffect(() => {
    const fetchAllPlaces = async () => {
      const allPlaces: any[] = [];

      for (const loc of locations) {
        if (!loc.lat || !loc.lon) continue; //  Sla locaties zonder coördinaten over

        //  GeoSearch API-oproep naar Wikipedia (10km radius)
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${loc.lat}|${loc.lon}&gsradius=10000&gslimit=100&format=json&origin=*`
        );
        const data = await res.json();

        //  Voeg de gevonden plaatsen toe
        allPlaces.push(...(data.query.geosearch || []));
      }

      setPlaces(allPlaces); //  Update de state
    };

    fetchAllPlaces(); // 🔁 Wordt één keer uitgevoerd als locaties veranderen
  }, [locations]);

  //  Map startpositie: eerste locatie in de lijst
  const defaultCenter: [number, number] = [locations[0].lat, locations[0].lon];

  return (
    <div className="h-[500px] w-full">
      {/*  Leaflet kaartcontainer */}
      <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
        {/*  OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*  Plaats markers van alle gevonden Wikipedia-plaatsen */}
        {places.map((place) => (
          <Marker
            key={`${place.pageid}-${place.lat}-${place.lon}`} // Unieke sleutel
            position={[place.lat, place.lon]} // Coördinaten
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Standaard Leaflet icoon
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            {/*  Popup met titel van de plek */}
            <Popup>{place.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
