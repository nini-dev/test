import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom

      // daamata komentari ninim
    });

    // Creates new directions control instance
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      congestion: true,
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: false,
      },

    });

    map.current.on('touchstart', ()=>{
      directions.on('result', (event)=>{
        console.log(event);
      })
    })

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
  });

    // Integrates directions control with map
    map.current.addControl(directions, 'top-left');

    map.current.on('load', () => {
      geocoder.on('result', (ev)=>{
        console.log(ev.result.geometry.coordinates)
      })
    })

    map.current.addControl(geocoder, 'top-right');

  });

  return (
    // Populates map by referencing map's container property
    <div ref={mapContainer} className="mapContainer" />
  )
}

export default App;
