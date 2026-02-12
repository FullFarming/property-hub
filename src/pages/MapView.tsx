import { Map as MapIcon, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function MapView() {
  return (
    <div className="flex h-screen">
      {/* Map Placeholder */}
      <div className="flex-1 relative bg-muted">
        {/* Filter Bar */}
        <div className="absolute top-4 left-4 right-[340px] z-10">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg card-shadow border border-border p-3 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="건물명, 주소 검색..."
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              />
            </div>
            {["매매", "전세", "추천", "급매"].map((t) => (
              <button key={t} className="h-9 px-4 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-default">
                {t}
              </button>
            ))}
            <button className="h-9 px-3 rounded-lg border border-input bg-background text-muted-foreground hover:bg-muted transition-default">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Map Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapIcon className="h-10 w-10 text-primary" />
            </div>
            <p className="text-h3 mb-2">지도 뷰</p>
            <p className="text-body text-muted-foreground">Kakao Map API 연동이 필요합니다.</p>
            <p className="text-caption text-muted-foreground mt-1">API 키 설정 후 지도가 표시됩니다.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-[340px] border-l border-border bg-card overflow-y-auto shrink-0 hidden lg:block">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">지도 내 매물 <span className="text-primary">0</span>건</p>
            <select className="h-8 px-2 text-caption rounded-md border border-input bg-background">
              <option>최신순</option>
              <option>가격순</option>
              <option>수익률순</option>
            </select>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            지도를 이동하여 매물을 검색하세요.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
