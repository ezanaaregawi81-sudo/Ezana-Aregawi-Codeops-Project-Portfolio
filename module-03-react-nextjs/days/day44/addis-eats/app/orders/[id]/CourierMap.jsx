'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Markers are small HTML labels rather than Leaflet's default pin images (which can't find their
// PNGs once bundled). The words say which is which, so colour isn't needed to tell them apart.
// keyboard: false on both markers: activating one does nothing, so it shouldn't be an empty Tab
// stop. The same details are written out below the map.
const label = (text, kind) => L.divIcon({ className: `courier-marker courier-marker-${kind}`, html: text, iconSize: null });

// Browser-only: LiveOrder loads this with next/dynamic and ssr: false.
export default function CourierMap({ rider, drop }) {
  const el = useRef(null);
  const view = useRef(null);

  // The map is built once and torn down on unmount.
  useEffect(() => {
    const map = L.map(el.current, { scrollWheelZoom: false, zoomSnap: 0.25 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const riderMarker = L.marker([rider.lat, rider.lng], { icon: label('🛵 Courier', 'rider'), title: 'Courier', keyboard: false }).addTo(map);
    const dropMarker = L.marker([drop.lat, drop.lng], { icon: label('📍 Drop-off', 'drop'), title: 'Drop-off', keyboard: false }).addTo(map);
    view.current = { map, riderMarker, dropMarker };
    return () => {
      map.remove();
      view.current = null;
    };
    // Built once; the effect below keeps the markers where they should be.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On every update: move both markers, then fit the view so both are on screen.
  useEffect(() => {
    if (!view.current) return;
    const { map, riderMarker, dropMarker } = view.current;
    riderMarker.setLatLng([rider.lat, rider.lng]);
    dropMarker.setLatLng([drop.lat, drop.lng]);
    // Room around the edges for the labels, and no closer than zoom 15 when both points meet.
    map.fitBounds([[rider.lat, rider.lng], [drop.lat, drop.lng]], { padding: [56, 56], maxZoom: 15 });
  }, [rider.lat, rider.lng, drop.lat, drop.lng]);

  return (
    <div
      ref={el}
      className="courier-map"
      role="region"
      aria-label="Map showing the courier and your drop-off point. The same information is written out below the map."
    />
  );
}
