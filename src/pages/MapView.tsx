import { Search, SlidersHorizontal, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NaverMap from "@/components/NaverMap";
import { useListingsInBounds } from "@/hooks/useListings";

export default function MapView() {
  const navigate = useNavigate();
  const [bounds, setBounds] = useState<{
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const boundsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: listings = [], isLoading: loading } = useListingsInBounds(bounds);

  const handleBoundsChanged = useCallback(
    (newBounds: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }) => {
      if (boundsTimerRef.current) clearTimeout(boundsTimerRef.current);
      boundsTimerRef.current = setTimeout(() => {
        setBounds(newBounds);
      }, 300);
    },
    []
  );

  const markers = listings
    .filter((l: any) => l.buildings?.latitude && l.buildings?.longitude)
    .map((l: any) => ({
      lat: Number(l.buildings.latitude),
      lng: Number(l.buildings.longitude),
      title: l.buildings.name,
      customIcon: `<div style="background: hsl(var(--primary)); color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.2); border: 2px solid white; cursor: pointer;">${l.sale_price ? Math.round(l.sale_price / 100000000) + "억" : "가격미정"}</div>`,
      onClick: () => setSelectedId(l.id),
    }));

  const formatPrice = (price: number | null) => {
    if (!price) return "-";
    const eok = Math.floor(price / 100000000);
    const man = Math.round((price % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
    if (eok > 0) return `${eok}억`;
    return `${man.toLocaleString()}만`;
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        {/* Filter Bar */}
        <div className="absolute top-4 left-4 right-[340px] z-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg card-shadow border border-border p-3 flex items-center gap-2 flex-wrap"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="건물명, 주소 검색..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              />
            </div>
            {["매매", "전세", "추천", "급매"].map((t) => (
              <button
                key={t}
                className="h-9 px-4 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-default"
              >
                {t}
              </button>
            ))}
            <button className="h-9 px-3 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted transition-default">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <NaverMap
          className="absolute inset-0"
          center={{ lat: 37.5665, lng: 126.978 }}
          zoom={14}
          markers={markers}
          onBoundsChanged={handleBoundsChanged}
        />
      </div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-[340px] border-l border-border bg-card overflow-y-auto shrink-0 hidden lg:block"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              지도 내 매물 <span className="text-primary">{listings.length}</span>건
              {loading && <span className="ml-2 text-xs text-muted-foreground">검색중...</span>}
            </p>
            <select className="h-8 px-2 text-caption rounded-md border border-input bg-background">
              <option>최신순</option>
              <option>가격순</option>
              <option>수익률순</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-border">
          {listings.length === 0 && !loading && (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              지도를 이동하여 매물을 검색하세요.
            </div>
          )}
          {listings.map((listing: any) => (
            <div
              key={listing.id}
              onClick={() => navigate(`/listings/${listing.id}`)}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-default ${
                selectedId === listing.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{listing.buildings?.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      {listing.buildings?.address_road || listing.buildings?.address_jibun || "-"}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatPrice(listing.sale_price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
