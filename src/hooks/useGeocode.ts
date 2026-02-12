import { useState, useCallback } from "react";
import { geocodeAddress, reverseGeocodeCoord } from "@/lib/geocode";

export function useGeocode() {
  const [loading, setLoading] = useState(false);

  const geocode = useCallback(async (address: string) => {
    setLoading(true);
    try {
      return await geocodeAddress(address);
    } finally {
      setLoading(false);
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      return await reverseGeocodeCoord(lat, lng);
    } finally {
      setLoading(false);
    }
  }, []);

  return { geocode, reverseGeocode, loading };
}
