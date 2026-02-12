import { useState } from "react";
import { Building2, MapPin, Search, SlidersHorizontal, Plus, ChevronDown, ArrowUpDown, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ListingFormModal from "@/components/listings/ListingFormModal";

const mockListings = [
  { id: "39597", name: "한성빌딩", address: "서울 종로구 낙원동 196", price: 16000000000, priceLabel: "160억", landArea: 151.01, grossArea: 269.1, yieldRate: null, status: "준비", type: "매매", category: "수익형", tags: ["역세권", "대로변"], assignee: "김현준", updatedAt: "2026-02-11" },
  { id: "39596", name: "역삼 더 센트럴", address: "서울 강남구 역삼동 823", price: 28000000000, priceLabel: "280억", landArea: 320.5, grossArea: 1250.0, yieldRate: 4.2, status: "매각중", type: "매매", category: "대형빌딩", tags: ["역세권", "신축"], assignee: "박서연", updatedAt: "2026-02-10" },
  { id: "39595", name: "성수 크리에이티브 팩토리", address: "서울 성동구 성수동2가 315", price: 8500000000, priceLabel: "85억", landArea: 180.0, grossArea: 520.0, yieldRate: 5.1, status: "매각중", type: "매매", category: "꼬마빌딩", tags: ["신축", "리노베이션"], assignee: "이도윤", updatedAt: "2026-02-09" },
  { id: "39594", name: "도산 플래그십 스토어", address: "서울 강남구 신사동 654", price: 15000000000, priceLabel: "150억", landArea: 95.0, grossArea: 280.0, yieldRate: 3.8, status: "준비", type: "매매", category: "수익형", tags: ["대로변"], assignee: "최유진", updatedAt: "2026-02-08" },
  { id: "39593", name: "을지로 오피스타워", address: "서울 중구 을지로3가 201", price: 42000000000, priceLabel: "420억", landArea: 580.0, grossArea: 4200.0, yieldRate: 4.5, status: "거래완료", type: "매매", category: "대형빌딩", tags: ["역세권"], assignee: "정하은", updatedAt: "2026-02-07" },
  { id: "39592", name: "이태원 빌라지오", address: "서울 용산구 이태원동 117", price: 6200000000, priceLabel: "62억", landArea: 130.0, grossArea: 350.0, yieldRate: 4.8, status: "매각중", type: "매매", category: "꼬마빌딩", tags: ["대로변"], assignee: "김현준", updatedAt: "2026-02-06" },
  { id: "39591", name: "합정 아트센터", address: "서울 마포구 합정동 412", price: 9800000000, priceLabel: "98억", landArea: 210.0, grossArea: 680.0, yieldRate: 5.5, status: "준비", type: "매매", category: "수익형", tags: ["역세권", "리노베이션"], assignee: "박서연", updatedAt: "2026-02-05" },
  { id: "39590", name: "서초 메디컬타워", address: "서울 서초구 서초동 1588", price: 32000000000, priceLabel: "320억", landArea: 420.0, grossArea: 2800.0, yieldRate: 4.0, status: "매각중", type: "매매", category: "메디컬", tags: ["역세권", "대로변"], assignee: "이도윤", updatedAt: "2026-02-04" },
];

const statusColor: Record<string, string> = {
  "준비": "bg-muted text-muted-foreground",
  "매각중": "bg-warning/10 text-warning",
  "거래완료": "bg-success/10 text-success",
  "공실": "bg-destructive/10 text-destructive",
};

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const filtered = mockListings.filter(
    (l) =>
      l.name.includes(searchQuery) ||
      l.address.includes(searchQuery) ||
      l.id.includes(searchQuery)
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">매물 목록</h1>
          <p className="text-body text-muted-foreground mt-1">총 {filtered.length}건의 매물</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-11 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-default"
        >
          <Plus className="h-4 w-4" />
          매물 등록
        </button>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg card-shadow border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="건물명, 주소, 매물번호 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>
          {["거래유형", "대분류", "상태"].map((label) => (
            <button key={label} className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-default">
              {label}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ))}
          <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-default">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            상세 필터
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-lg card-shadow border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["매물번호", "건물명", "주소", "매매가", "대지면적", "수익률", "상태", "담당자", "수정일", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-caption font-medium text-muted-foreground whitespace-nowrap">
                    {h && (
                      <button className="flex items-center gap-1 hover:text-foreground transition-default">
                        {h}
                        {h !== "" && <ArrowUpDown className="h-3 w-3" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-default cursor-pointer group"
                >
                  <td className="px-4 py-3 text-caption text-muted-foreground tabular-nums">#{listing.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap">{listing.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-caption text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[200px]">{listing.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold tabular-nums whitespace-nowrap">{listing.priceLabel}</td>
                  <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">{listing.landArea}평</td>
                  <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                    {listing.yieldRate ? `${listing.yieldRate}%` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ${statusColor[listing.status] || ""}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-caption whitespace-nowrap">{listing.assignee}</td>
                  <td className="px-4 py-3 text-caption text-muted-foreground tabular-nums whitespace-nowrap">{listing.updatedAt}</td>
                  <td className="px-4 py-3">
                    <button className="opacity-0 group-hover:opacity-100 transition-default p-1.5 rounded-md hover:bg-muted">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <ListingFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
