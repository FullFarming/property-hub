import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChanged?: (bounds: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }) => void;
}

export default function NaverMap({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 14,
  className = "",
  markers = [],
  onMapClick,
  onBoundsChanged,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstances = useRef<any[]>([]);

  const clearMarkers = useCallback(() => {
    markerInstances.current.forEach((m) => m.setMap(null));
    markerInstances.current = [];
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });

    mapInstance.current = map;

    if (onMapClick) {
      window.naver.maps.Event.addListener(map, "click", (e: any) => {
        onMapClick(e.coord.lat(), e.coord.lng());
      });
    }

    if (onBoundsChanged) {
      window.naver.maps.Event.addListener(map, "idle", () => {
        const bounds = map.getBounds();
        onBoundsChanged({
          sw: { lat: bounds.getSW().lat(), lng: bounds.getSW().lng() },
          ne: { lat: bounds.getNE().lat(), lng: bounds.getNE().lng() },
        });
      });
    }

    return () => {
      clearMarkers();
      mapInstance.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
  }, [center.lat, center.lng]);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current || !window.naver?.maps) return;
    clearMarkers();

    markers.forEach((m) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(m.lat, m.lng),
        map: mapInstance.current,
        title: m.title || "",
      });

      if (m.onClick) {
        window.naver.maps.Event.addListener(marker, "click", m.onClick);
      }

      markerInstances.current.push(marker);
    });
  }, [markers, clearMarkers]);

  return <div ref={mapRef} className={className} />;
}
