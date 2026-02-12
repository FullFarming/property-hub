// src/utils/loadNaverMaps.ts

export type LoadResult = { ok: true } | { ok: false; reason: string; details?: any };

declare global {
  interface Window {
    naver?: any;
    // Naver 문서: 인증 실패 시 호출되는 전역 함수
    navermap_authFailure?: () => void;

    // 우리가 쓰는 callback 함수
    __naverMapsInit__?: () => void;

    // 중복 로드 방지용 promise
    __naverMapsPromise__?: Promise<LoadResult>;

    // 로더 내부에서 사용(디버깅/정리용)
    __naverMapsResolved__?: boolean;
  }
}

const SCRIPT_ID = "naver-maps-sdk";

// 상황에 맞게 조절 가능 (너무 짧으면 네트워크 느릴 때 오탐)
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Naver Maps JS API v3 로더 (ncpKeyId + callback + authFailure)
 * - 1회만 로드
 * - 인증 실패/네트워크 실패/콜백 미호출을 명확히 감지
 * - existing script가 있어도 resolve가 되도록 처리
 */
export function loadNaverMaps(
  ncpKeyId: string,
  submodules: string[] = ["geocoder"],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<LoadResult> {
  // 이미 정상 로드된 경우
  if (window.naver?.maps?.Map) {
    return Promise.resolve({ ok: true });
  }

  // 이미 로딩 중이면 재사용
  if (window.__naverMapsPromise__) {
    return window.__naverMapsPromise__;
  }

  window.__naverMapsPromise__ = new Promise<LoadResult>((resolve) => {
    // resolve는 1번만 호출되게 보장
    const resolveOnce = (result: LoadResult) => {
      if (window.__naverMapsResolved__) return;
      window.__naverMapsResolved__ = true;
      cleanup();
      resolve(result);
    };

    const cleanup = () => {
      // 전역 훅 정리(다음 로드 시 꼬임 방지)
      try {
        delete window.__naverMapsInit__;
        delete window.navermap_authFailure;
      } catch {
        // ignore
      }
      // Promise 캐시는 유지(중복 호출 방지), 다만 실패 후 재시도 가능하게 하고 싶으면 아래 주석 해제
      // window.__naverMapsPromise__ = undefined;
    };

    if (!ncpKeyId) {
      resolveOnce({
        ok: false,
        reason: "Missing ncpKeyId (VITE_NAVER_MAPS_CLIENT_ID)",
      });
      return;
    }

    // 타임아웃: 인증 실패인데도 callback/authFailure가 호출되지 않는 케이스 대비
    const timer = window.setTimeout(() => {
      resolveOnce({
        ok: false,
        reason: `Timeout waiting for Naver Maps SDK (>${timeoutMs}ms). Check 401/allowed domains in NCP console.`,
      });
    }, timeoutMs);

    // 인증 실패 훅 (문서 기반)
    window.navermap_authFailure = function () {
      window.clearTimeout(timer);
      resolveOnce({
        ok: false,
        reason: "navermap_authFailure (Unauthorized / domain not allowed / invalid key)",
      });
    };

    // SDK 준비 완료 callback
    window.__naverMapsInit__ = function () {
      // 콜백이 호출되면 타임아웃 해제
      window.clearTimeout(timer);

      if (window.naver?.maps?.Map) {
        resolveOnce({ ok: true });
      } else {
        resolveOnce({
          ok: false,
          reason: "SDK callback fired but window.naver.maps.Map is missing (script loaded but SDK not initialized)",
        });
      }
    };

    // 이미 script가 있을 경우:
    // - 그대로 둔 채로 "SDK가 이미 준비됐는지"를 짧게 폴링해서 판정하고 resolve해야 함
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      // script는 있는데 아직 naver.maps가 안 뜨는 경우가 있으니 짧게 기다림
      const start = Date.now();
      const tick = () => {
        if (window.naver?.maps?.Map) {
          window.clearTimeout(timer);
          resolveOnce({ ok: true });
          return;
        }
        // timeout은 상단 timer가 처리하므로 여기선 짧게만 폴링
        if (Date.now() - start < timeoutMs) {
          setTimeout(tick, 100);
        }
      };
      tick();
      return;
    }

    // script 신규 생성
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;

    const modulesParam = submodules.length ? `&submodules=${encodeURIComponent(submodules.join(","))}` : "";

    // 문서 반영: ncpKeyId + callback
    // callback은 전역 함수명 문자열이어야 하므로 "__naverMapsInit__"로 전달
    script.src =
      `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(ncpKeyId)}` +
      `${modulesParam}&callback=__naverMapsInit__`;

    // 네트워크 레벨 실패(도메인 차단/오프라인/URL 오타 등)
    script.onerror = (e) => {
      window.clearTimeout(timer);
      resolveOnce({
        ok: false,
        reason: "Script network error (blocked / offline / wrong URL). Check DevTools Network tab.",
        details: e,
      });
    };

    document.head.appendChild(script);
  });

  return window.__naverMapsPromise__;
}
