/**
 * 네이버 지도 Geocoder 유틸리티
 * Edge Function을 통해 서버사이드에서 Geocoding 처리
 * 클라이언트 SDK(naver.maps.Service)도 폴백으로 지원
 */

import { supabase } from "@/integrations/supabase/client";

interface GeocodingResult {
  lat: number;
  lng: number;
  roadAddress?: string;
  jibunAddress?: string;
}

/**
 * 주소를 좌표로 변환 (Edge Function 우선, 클라이언트 SDK 폴백)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  // 1) Edge Function 호출 시도
  try {
    const { data, error } = await supabase.functions.invoke("geocode", {
      body: { address },
    });

    if (!error && data?.success) {
      return {
        lat: data.latitude,
        lng: data.longitude,
        roadAddress: data.roadAddress || undefined,
        jibunAddress: data.jibunAddress || undefined,
      };
    }
  } catch {
    // Edge function 실패 시 클라이언트 SDK 폴백
  }

  // 2) 클라이언트 SDK 폴백
  return geocodeAddressClient(address);
}

/**
 * 좌표를 주소로 변환 (Edge Function 우선, 클라이언트 SDK 폴백)
 */
export async function reverseGeocodeCoord(
  lat: number,
  lng: number
): Promise<{ roadAddress: string; jibunAddress: string } | null> {
  // 1) Edge Function 호출 시도
  try {
    const { data, error } = await supabase.functions.invoke("reverse-geocode", {
      body: { latitude: lat, longitude: lng },
    });

    if (!error && data?.success) {
      return {
        roadAddress: data.roadAddress || "",
        jibunAddress: data.jibunAddress || "",
      };
    }
  } catch {
    // Edge function 실패 시 클라이언트 SDK 폴백
  }

  // 2) 클라이언트 SDK 폴백
  return reverseGeocodeCoordClient(lat, lng);
}

// ── 클라이언트 SDK 폴백 함수들 ──

function geocodeAddressClient(address: string): Promise<GeocodingResult | null> {
  return new Promise((resolve) => {
    if (!window.naver?.maps?.Service) {
      console.warn("네이버 지도 Geocoder가 로드되지 않았습니다.");
      resolve(null);
      return;
    }

    window.naver.maps.Service.geocode(
      { query: address },
      (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          resolve(null);
          return;
        }

        const result = response.v2?.addresses?.[0];
        if (!result) {
          resolve(null);
          return;
        }

        resolve({
          lat: parseFloat(result.y),
          lng: parseFloat(result.x),
          roadAddress: result.roadAddress || undefined,
          jibunAddress: result.jibunAddress || undefined,
        });
      }
    );
  });
}

function reverseGeocodeCoordClient(
  lat: number,
  lng: number
): Promise<{ roadAddress: string; jibunAddress: string } | null> {
  return new Promise((resolve) => {
    if (!window.naver?.maps?.Service) {
      resolve(null);
      return;
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: new window.naver.maps.LatLng(lat, lng),
        orders: [
          window.naver.maps.Service.OrderType.ROAD_ADDR,
          window.naver.maps.Service.OrderType.ADDR,
        ].join(","),
      },
      (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          resolve(null);
          return;
        }

        const results = response.v2?.results || [];
        let roadAddress = "";
        let jibunAddress = "";

        results.forEach((r: any) => {
          const land = r.land;
          const region = r.region;
          if (r.name === "roadaddr" && land) {
            roadAddress = `${region.area1.name} ${region.area2.name} ${land.name} ${land.number1}${land.number2 ? "-" + land.number2 : ""}`;
          }
          if (r.name === "addr" && land) {
            jibunAddress = `${region.area1.name} ${region.area2.name} ${region.area3.name} ${land.number1}${land.number2 ? "-" + land.number2 : ""}`;
          }
        });

        resolve({ roadAddress, jibunAddress });
      }
    );
  });
}
