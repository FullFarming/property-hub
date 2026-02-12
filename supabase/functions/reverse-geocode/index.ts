import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ success: false, error: "좌표를 입력해주세요." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const NCP_CLIENT_ID = Deno.env.get("NAVER_MAP_CLIENT_ID");
    const NCP_CLIENT_SECRET = Deno.env.get("NAVER_MAP_CLIENT_SECRET");

    if (!NCP_CLIENT_ID || !NCP_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ success: false, error: "네이버 지도 API 키가 설정되지 않았습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const coords = `${longitude},${latitude}`;
    const url = `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coords}&output=json&orders=roadaddr,addr`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": NCP_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NCP_CLIENT_SECRET,
      },
    });

    const data = await response.json();

    if (data.status?.code === 0 && data.results && data.results.length > 0) {
      const roadAddrResult = data.results.find((r: any) => r.name === "roadaddr");
      const jibunResult = data.results.find((r: any) => r.name === "addr");

      let roadAddress = "";
      let jibunAddress = "";

      if (roadAddrResult?.region && roadAddrResult?.land) {
        const r = roadAddrResult.region;
        const l = roadAddrResult.land;
        roadAddress = `${r.area1.name} ${r.area2.name} ${l.name} ${l.number1}${l.number2 ? "-" + l.number2 : ""}`;
      }

      if (jibunResult?.region && jibunResult?.land) {
        const r = jibunResult.region;
        const l = jibunResult.land;
        jibunAddress = `${r.area1.name} ${r.area2.name} ${r.area3.name} ${l.number1}${l.number2 ? "-" + l.number2 : ""}`;
      }

      return new Response(
        JSON.stringify({ success: true, roadAddress, jibunAddress }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "주소를 찾을 수 없습니다." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: "Reverse Geocoding API 호출 실패", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
