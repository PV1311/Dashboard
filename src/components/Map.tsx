import React, { useEffect, useRef } from 'react';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { SmartBin } from '../types/bin';
import 'ol/ol.css';

interface BinMapProps {
  bins: SmartBin[];
  onBinClick: (bin: SmartBin) => void;
}

export default function BinMap({ bins, onBinClick }: BinMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OLMap | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    overlayRef.current = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      offset: [0, -10],
      stopEvent: false
    });

    const features = bins.map(bin => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([bin.location.lng, bin.location.lat])),
        bin: bin
      });

      const getFillColor = (fillLevel: number) => {
        if (fillLevel > 90) return '#EF4444';
        if (fillLevel > 70) return '#F59E0B';
        if (fillLevel > 50) return '#3B82F6';
        return '#10B981';
      };

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${getFillColor(bin.fillLevel)}" stroke-width="2">
        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      </svg>`;

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      feature.setStyle(
        new Style({
          image: new Icon({
            src: url,
            scale: 1.2
          })
        })
      );

      return feature;
    });

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const map = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: bins.length > 0 
          ? fromLonLat([bins[0].location.lng, bins[0].location.lat])
          : fromLonLat([78.9629, 20.5937]),
        zoom: 13
      }),
      overlays: [overlayRef.current]
    });

    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
      if (feature && overlayRef.current && popupRef.current) {
        const bin = (feature as Feature).get('bin') as SmartBin;
        const fillLevelColor = bin.fillLevel > 90 ? 'text-red-600' : 
                             bin.fillLevel > 70 ? 'text-orange-500' :
                             bin.fillLevel > 50 ? 'text-blue-600' : 'text-green-600';
        popupRef.current.innerHTML = `
          <div class="bg-white p-3 rounded-lg shadow-lg text-sm min-w-[200px] border border-gray-200">
            <p class="font-semibold text-gray-800">Bin ID: ${bin.id}</p>
            <p class="text-gray-600">Latitude: ${bin.location.lat}</p>
            <p class="text-gray-600">Longitude: ${bin.location.lng}</p>
            <p class="font-semibold text-gray-800">${bin.location.address}</p>
            <p class="text-gray-600">Area: ${bin.location.area}</p>
            <p class="font-medium ${fillLevelColor}">Fill Level: ${bin.fillLevel}%</p>
            <p class="text-xs text-gray-500 mt-1">Status: ${bin.status}</p>
            <p class="text-xs text-gray-500">Last Updated: ${new Date(bin.lastUpdated).toLocaleString()}</p>
          </div>
        `;
        overlayRef.current.setPosition(event.coordinate);
      } else if (overlayRef.current) {
        overlayRef.current.setPosition(undefined);
      }
      map.getTarget().style.cursor = feature ? 'pointer' : '';
    });

    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
      if (feature) {
        const bin = (feature as Feature).get('bin');
        if (bin) {
          onBinClick(bin);
        }
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      features.forEach(feature => {
        const style = feature.getStyle() as Style;
        const icon = style.getImage() as Icon;
        URL.revokeObjectURL(icon.getSrc());
      });
    };
  }, [bins, onBinClick]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full relative" />
      <div ref={popupRef} className="absolute z-50 transform -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10">
        <h4 className="font-semibold text-sm mb-2">Fill Level Legend</h4>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">&gt; 90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">70-90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">50-70%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">&lt; 50%</span>
          </div>
        </div>
      </div>
    </>
  );
}