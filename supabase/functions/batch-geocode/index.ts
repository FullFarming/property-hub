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
    const CLIENT_ID = Deno.env.get("NAVER_MAP_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("NAVER_MAP_CLIENT_SECRET");

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ success: false, error: "네이버 지도 API 키가 설정되지 않았습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for batch updates
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get buildings without coordinates
    const { data: buildings, error: fetchError } = await supabaseAdmin
      .from("buildings")
      .select("id, name, address_road, address_jibun")
      .or("latitude.is.null,longitude.is.null")
      .not("address_road", "is", null)
      .limit(50);

    if (fetchError) {
      return new Response(
        JSON.stringify({ success: false, error: "건물 목록 조회 실패", message: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = {
      processed: 0,
      success: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const building of (buildings || [])) {
      try {
        const address = building.address_road || building.address_jibun || "";

        if (!address.trim()) {
          results.failed++;
          results.details.push({ id: building.id, name: building.name, error: "주소 정보 없음" });
          continue;
        }

        const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
            "X-NCP-APIGW-API-KEY": CLIENT_SECRET,
          },
        });

        const data = await response.json();

        if (data.status === "OK" && data.addresses && data.addresses.length > 0) {
          const result = data.addresses[0];

          const { error: updateError } = await supabaseAdmin
            .from("buildings")
            .update({
              latitude: parseFloat(result.y),
              longitude: parseFloat(result.x),
            })
            .eq("id", building.id);

          if (updateError) {
            results.failed++;
            results.details.push({ id: building.id, name: building.name, error: updateError.message });
          } else {
            results.success++;
            results.details.push({
              id: building.id,
              name: building.name,
              latitude: result.y,
              longitude: result.x,
              status: "success",
            });
          }
        } else {
          results.failed++;
          results.details.push({ id: building.id, name: building.name, address, error: "좌표 변환 실패" });
        }

        results.processed++;

        // Rate limit prevention
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.details.push({ id: building.id, name: building.name, error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: "Batch geocoding 실패", message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
