'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import type { Map as LeafletMap } from 'leaflet';
import { Coordinates } from '@/types/job';

interface LocationMapViewerProps {
  coordinates?: Coordinates;
  locationName: string;
  mapQuery?: string;
}

export default function LocationMapViewer({
  coordinates,
  locationName,
  mapQuery,
}: LocationMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  const effectiveCoords: Coordinates = coordinates && !isNaN(coordinates.lat) && !isNaN(coordinates.lng) && coordinates.lat !== 0
    ? coordinates
    : { lat: 19.0284, lng: 99.8970 }; // ค่าพิกัดเริ่มต้น ม.พะเยา

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;

    const setupViewer = async () => {
      try {
        const L = (await import('leaflet')).default;
        if (isCancelled || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [effectiveCoords.lat, effectiveCoords.lng],
          zoom: 15,
          zoomControl: false, // Clean custom look
          scrollWheelZoom: false, // Prevent accidental page scroll interception
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        // Vector Pin Marker
        const pinIcon = L.divIcon({
          className: 'viewer-map-marker',
          html: `
            <div style="position:relative;width:32px;height:32px;transform:translate(-50%,-100%);">
              <div style="background-color:#e11d48;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(225,29,72,0.45);border:2.5px solid #ffffff;">
                <div style="width:9px;height:9px;background-color:#ffffff;border-radius:50%;"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([effectiveCoords.lat, effectiveCoords.lng], {
          icon: pinIcon,
        }).addTo(map);

        marker.bindPopup(`<b>${locationName || 'สถานที่ทำงาน'}</b><br/><span style="font-size:11px;color:#71717a;">พิกัด: ${effectiveCoords.lat.toFixed(4)}, ${effectiveCoords.lng.toFixed(4)}</span>`);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.warn('LocationMapViewer failed to initialize:', err);
      }
    };

    setupViewer();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [effectiveCoords.lat, effectiveCoords.lng, locationName]);

  const googleMapsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${effectiveCoords.lat},${effectiveCoords.lng}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Real Interactive Map Display */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-zinc-200/80 shadow-inner group">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Coordinates Pill Badge on top */}
        <div className="absolute top-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-zinc-200 shadow-2xs text-[10px] font-mono font-bold text-zinc-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>GPS: {effectiveCoords.lat.toFixed(4)}, {effectiveCoords.lng.toFixed(4)}</span>
        </div>
      </div>

      {/* Location Details Info Box */}
      <div className="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-100 flex items-start gap-2.5">
        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-zinc-900 truncate">
            {locationName || 'เมืองพะเยา'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            พิกัดหมุดตำแหน่งจริงบนแผนที่จังหวัดพะเยา
          </p>
        </div>
      </div>

      {/* Button: Open Google Maps */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 rounded-2xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
      >
        <ExternalLink className="w-4 h-4 text-blue-600" />
        <span>เปิดนำทางบน Google Maps</span>
      </a>
    </div>
  );
}
