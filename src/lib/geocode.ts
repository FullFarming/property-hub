/**
 * 네이버 지도 Geocoder 유틸리티
 */

interface GeocodingResult {
  lat: number;
  lng: number;
  roadAddress?: string;
  jibunAddress?: string;
}

export function geocodeAddress(address: string): Promise<GeocodingResult | null> {
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

export function reverseGeocodeCoord(
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
