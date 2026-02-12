type LoadResult = { ok: true } | { ok: false; reason: string };

declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
    __naverMapsInit__?: () => void;
    __naverMapsPromise__?: Promise<LoadResult>;
  }
}

const SCRIPT_ID = "naver-maps-sdk";

export function loadNaverMaps(
  ncpKeyId: string,
  submodules: string[] = ["geocoder"]
): Promise<LoadResult> {
  if (window.naver?.maps?.Map) {
    return Promise.resolve({ ok: true });
  }

  if (window.__naverMapsPromise__) {
    return window.__naverMapsPromise__;
  }

  window.__naverMapsPromise__ = new Promise<LoadResult>((resolve) => {
    if (!ncpKeyId) {
      resolve({ ok: false, reason: "Missing ncpKeyId (VITE_NAVER_MAPS_CLIENT_ID)" });
      return;
    }

    window.navermap_authFailure = function () {
      resolve({
        ok: false,
        reason: "navermap_authFailure (Unauthorized / domain not allowed / invalid key)",
      });
    };

    window.__naverMapsInit__ = function () {
      if (window.naver?.maps?.Map) resolve({ ok: true });
      else resolve({ ok: false, reason: "SDK callback fired but window.naver.maps.Map is missing" });
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;

    const modulesParam = submodules.length
      ? `&submodules=${encodeURIComponent(submodules.join(","))}`
      : "";
    script.src =
      `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(ncpKeyId)}` +
      `${modulesParam}&callback=__naverMapsInit__`;

    script.onerror = () =>
      resolve({ ok: false, reason: "Script network error (blocked / offline / wrong URL)" });

    document.head.appendChild(script);
  });

  return window.__naverMapsPromise__;
}
