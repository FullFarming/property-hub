import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Bounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export function useListingsInBounds(bounds: Bounds | null) {
  return useQuery({
    queryKey: ["listings", "bounds", bounds],
    enabled: !!bounds,
    queryFn: async () => {
      if (!bounds) return [];

      const { data, error } = await supabase
        .from("listings")
        .select(`
          id, listing_type, status, classification,
          sale_price, deposit, monthly_rent, yield_rate,
          is_public, is_recommended, is_urgent,
          buildings!inner (
            id, name, address_jibun, address_road,
            latitude, longitude,
            land_area_sqm, gross_area_sqm, building_area_sqm,
            total_floors_above, total_floors_below
          )
        `)
        .gte("buildings.latitude", bounds.sw.lat)
        .lte("buildings.latitude", bounds.ne.lat)
        .gte("buildings.longitude", bounds.sw.lng)
        .lte("buildings.longitude", bounds.ne.lng)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 30000,
  });
}
