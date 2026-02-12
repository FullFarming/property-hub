import { forwardRef, useEffect, useRef, useCallback, useState, useImperativeHandle } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

interface MarkerData {
  lat: number;
  lng: number;
  title?: string;
  content?: string;
  customIcon?: string;
  onClick?: () => void;
}

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: MarkerData[];
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChanged?: (bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  }) => void;
  onZoomChanged?: (zoom: number) => void;
  showZoomControl?: boolean;
}

const SCRIPT_ID = "naver-maps-sdk";
const CLIENT_ID = "66c0ciai3b";

const NaverMap = forwardRef<HTMLDivElement, NaverMapProps>(function NaverMap(
  {
    center = { lat: 37.5665, lng: 126.978 },
    zoom = 14,
    className = "",
    markers = [],
    onMapClick,
    onBoundsChanged,
    onZoomChanged,
    showZoomControl = true,
  },
  forwardedRef
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstances = useRef<any[]>([]);
  const infoWindowInstances = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useImperativeHandle(forwardedRef, () => mapRef.current as HTMLDivElement);

  const clearMarkers = useCallback(() => {
    markerInstances.current.forEach((m) => m.setMap(null));
    markerInstances.current = [];
    infoWindowInstances.current.forEach((iw) => iw.close());
    infoWindowInstances.current = [];
  }, []);

  // SDK 동적 로드
  useEffect(() => {
    // Already loaded and functional
    if (window.naver?.maps?.Map) {
      setIsLoaded(true);
      return;
    }

    const clientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID || CLIENT_ID;
    if (!clientId) {
      console.error("VITE_NAVER_MAPS_CLIENT_ID is not set.");
      return;
    }

    // If script tag already exists, wait for it
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      const waitForMaps = () => {
        if (window.naver?.maps?.Map) {
          setIsLoaded(true);
          return;
        }
        setTimeout(waitForMaps, 100);
      };
      waitForMaps();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${encodeURIComponent(clientId)}&submodules=geocoder`;
    script.onload = () => {
      const waitForMaps = () => {
        if (window.naver?.maps?.Map) {
          setIsLoaded(true);
          return;
        }
        setTimeout(waitForMaps, 100);
      };
      waitForMaps();
    };
    script.onerror = () => {
      console.error("Failed to load Naver Maps SDK");
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom,
      zoomControl: showZoomControl,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      mapTypeControl: false,
      scaleControl: true,
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

    if (onZoomChanged) {
      window.naver.maps.Event.addListener(map, "zoom_changed", (z: number) => {
        onZoomChanged(z);
      });
    }

    return () => {
      clearMarkers();
      mapInstance.current = null;
    };
  }, [isLoaded]);

  // center 업데이트
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setCenter(
      new window.naver.maps.LatLng(center.lat, center.lng)
    );
  }, [center.lat, center.lng]);

  // zoom 업데이트
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setZoom(zoom);
  }, [zoom]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !isLoaded) return;
    clearMarkers();

    markers.forEach((m) => {
      const markerOptions: any = {
        position: new window.naver.maps.LatLng(m.lat, m.lng),
        map: mapInstance.current,
      };

      if (m.customIcon) {
        markerOptions.icon = {
          content: m.customIcon,
          anchor: new window.naver.maps.Point(20, 20),
        };
      }

      const marker = new window.naver.maps.Marker(markerOptions);

      if (m.content) {
        const infoWindow = new window.naver.maps.InfoWindow({
          content: m.content,
          borderWidth: 0,
          backgroundColor: "transparent",
          disableAnchor: true,
          pixelOffset: new window.naver.maps.Point(0, -10),
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(mapInstance.current, marker);
          }
          m.onClick?.();
        });

        infoWindowInstances.current.push(infoWindow);
      } else if (m.onClick) {
        window.naver.maps.Event.addListener(marker, "click", m.onClick);
      }

      markerInstances.current.push(marker);
    });
  }, [markers, clearMarkers, isLoaded]);

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted`}>
        <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
});

export default NaverMap;
