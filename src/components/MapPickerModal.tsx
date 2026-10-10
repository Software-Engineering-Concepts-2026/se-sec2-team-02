'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Check, X, Compass, Layers } from 'lucide-react';
import type { Map as LeafletMap, Marker as LeafletMarker, LeafletMouseEvent } from 'leaflet';
import { Coordinates } from '@/types/job';

export interface MapPickerModalProps {
  isOpen: boolean;
  initialCoordinates?: Coordinates;
  initialLocationName?: string;
  onClose: () => void;
  onSave: (coords: Coordinates, locationName: string) => void;
}

export const PHAYAO_LANDMARKS = [
  { name: 'หน้า ม.พะเยา (ประตู 1)', lat: 19.0284, lng: 99.8970, desc: 'ถนนพหลโยธิน ฝั่งตรงข้าม ม.พะเยา' },
  { name: 'ประตูกลาง ม.พะเยา', lat: 19.0255, lng: 99.8992, desc: 'ซอยประตูกลาง แหล่งหอพักและร้านค้า' },
  { name: 'ชุมชนแม่กา / สวาย', lat: 19.0350, lng: 99.8950, desc: 'ชุมชนแม่กา ตำบลแม่กา' },
  { name: 'กว๊านพะเยา (ริมกว๊าน)', lat: 19.1685, lng: 99.8988, desc: 'ถนนชายกว๊าน ย่านร้านอาหารและคาเฟ่' },
  { name: 'สถานีขนส่งพะเยา (บขส.)', lat: 19.1631, lng: 99.9075, desc: 'สถานีขนส่งผู้โดยสารจังหวัดพะเยา' },
  { name: 'ตลาดสดเทศบาล (ในเวียง)', lat: 19.1668, lng: 99.9015, desc: 'ตลาดสดใจกลางเมืองพะเยา' },
  { name: 'แยกแม่ต๋ำ', lat: 19.1415, lng: 99.9142, desc: 'สี่แยกแม่ต๋ำ เส้นทางหลักเข้าเมือง' },
  { name: 'โลตัส พะเยา', lat: 19.1550, lng: 99.9120, desc: 'ห้างสรรพสินค้าโลตัส สาขาพะเยา' },
  { name: 'ท็อปส์ พลาซ่า พะเยา', lat: 19.1820, lng: 99.9010, desc: 'ศูนย์การค้าท็อปส์ พลาซ่า ถนนพหลโยธิน' },
  { name: 'โรงพยาบาลพะเยา', lat: 19.1760, lng: 99.8970, desc: 'โรงพยาบาลพะเยา ตำบลบ้านต๋อม' },
];

export default function MapPickerModal({
  isOpen,
  initialCoordinates,
  initialLocationName = '',
  onClose,
  onSave,
}: MapPickerModalProps) {
  if (!isOpen) return null;

  return (
    <MapPickerModalContent
      key={`${initialCoordinates?.lat}_${initialCoordinates?.lng}_${initialLocationName}`}
      initialCoordinates={initialCoordinates}
      initialLocationName={initialLocationName}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function MapPickerModalContent({
  initialCoordinates,
  initialLocationName = '',
  onClose,
  onSave,
}: Omit<MapPickerModalProps, 'isOpen'>) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerInstanceRef = useRef<LeafletMarker | null>(null);

  const defaultCoords: Coordinates = initialCoordinates && initialCoordinates.lat && initialCoordinates.lng
    ? initialCoordinates
    : { lat: 19.0284, lng: 99.8970 }; // หน้า ม.พะเยา

  const [currentCoords, setCurrentCoords] = useState<Coordinates>(defaultCoords);
  const [locationName, setLocationName] = useState<string>(initialLocationName);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [activeLandmark, setActiveLandmark] = useState<string>('');

  // Initialize Leaflet Map safely in client side
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;

    const setupMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        if (isCancelled || !mapContainerRef.current) return;

        // Clean up previous instance if exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [defaultCoords.lat, defaultCoords.lng],
          zoom: 15,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Standard OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        // Vector SVG Pin Icon
        const pinIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="position:relative;width:34px;height:34px;transform:translate(-50%,-100%);">
              <div style="background-color:#e11d48;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(225,29,72,0.4);border:2.5px solid #ffffff;">
                <div style="width:10px;height:10px;background-color:#ffffff;border-radius:50%;"></div>
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([defaultCoords.lat, defaultCoords.lng], {
          draggable: true,
          icon: pinIcon,
        }).addTo(map);

        markerInstanceRef.current = marker;

        // Marker Drag End event
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          const newCoords: Coordinates = {
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6)),
          };
          setCurrentCoords(newCoords);
          setActiveLandmark('');
        });

        // Map Click event: Move marker to click position
        map.on('click', (event: LeafletMouseEvent) => {
          const { lat, lng } = event.latlng;
          const newCoords: Coordinates = {
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
          };
          marker.setLatLng([lat, lng]);
          setCurrentCoords(newCoords);
          setActiveLandmark('');
        });

        // Invalidate size after modal render animation completes
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      } catch (err) {
        console.warn('Leaflet initialization failed:', err);
      }
    };

    setupMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [defaultCoords.lat, defaultCoords.lng]);

  // Handle clicking a popular landmark
  const handleSelectLandmark = (landmark: typeof PHAYAO_LANDMARKS[0]) => {
    setActiveLandmark(landmark.name);
    const newCoords: Coordinates = { lat: landmark.lat, lng: landmark.lng };
    setCurrentCoords(newCoords);

    // If location name is empty or previously a landmark, update it
    if (!locationName || PHAYAO_LANDMARKS.some((l) => l.name === locationName)) {
      setLocationName(landmark.name);
    }

    if (mapInstanceRef.current && markerInstanceRef.current) {
      markerInstanceRef.current.setLatLng([landmark.lat, landmark.lng]);
      mapInstanceRef.current.flyTo([landmark.lat, landmark.lng], 16, {
        duration: 0.8,
      });
    }
  };

  // Handle Current GPS Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('อุปกรณ์ของคุณไม่รองรับการระบุพิกัดตำแหน่ง GPS');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords: Coordinates = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setCurrentCoords(newCoords);
        setActiveLandmark('');

        if (mapInstanceRef.current && markerInstanceRef.current) {
          markerInstanceRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          mapInstanceRef.current.flyTo([newCoords.lat, newCoords.lng], 16, {
            duration: 0.8,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        alert('ไม่สามารถดึงตำแหน่งปัจจุบันได้ กรุณาอนุญาตการเข้าถึงตำแหน่งที่ตั้ง หรือเลือกจุดสำคัญในพะเยาแทน');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    const finalName = locationName.trim() || `พิกัด [${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}]`;
    onSave(currentCoords, finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-zinc-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-zinc-900 leading-tight">
                ปักหมุดสถานที่ทำงานจริง (พะเยา)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                คลิกบนแผนที่หรือลากหมุดแดงเพื่อระบุตำแหน่งที่ตั้งสถานที่ทำงาน
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-0.5">
          {/* Quick GPS Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                <span>พิกัดปัจจุบัน:</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-zinc-200 shadow-2xs">
                {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'กำลังดึงพิกัด GPS...' : 'ใช้ตำแหน่งปัจจุบันของฉัน'}</span>
            </button>
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-zinc-200 shadow-inner group">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Instruction Overlay Pill */}
            <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none flex justify-center">
              <div className="bg-black/75 backdrop-blur-md text-white text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>แตะที่แผนที่เพื่อย้ายหมุด หรือกดค้างลากหมุดแดง</span>
              </div>
            </div>
          </div>

          {/* Location Name Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              ชื่อสถานที่ หรือ คำอธิบายจุดนัดพบ <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="เช่น ร้านคาเฟ่หลัง ม.พะเยา, หอพักศรีตรัง ประตูกลาง, ตลาดแม่กา"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Popular Phayao Landmarks */}
          <div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              แลนด์มาร์กยอดนิยมรอบพะเยา (คลิกเพื่อเลื่อนหมุดทันที)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PHAYAO_LANDMARKS.map((lm) => {
                const isSelected = activeLandmark === lm.name;
                return (
                  <button
                    key={lm.name}
                    type="button"
                    onClick={() => handleSelectLandmark(lm)}
                    className={`text-left p-2 rounded-xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 text-rose-900 font-bold shadow-2xs'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-100/70 text-zinc-700'
                    }`}
                  >
                    <p className="font-semibold truncate leading-tight text-[11px]">{lm.name}</p>
                    <p className="text-[9px] text-zinc-400 truncate mt-0.5">{lm.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-xs font-semibold hover:bg-zinc-50 cursor-pointer transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>ยืนยันพิกัดนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
}
