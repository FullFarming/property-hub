import { useState } from "react";
import { Building2, MapPin, Search, Plus, ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBuildings } from "@/hooks/useBuildings";
import BuildingFormModal from "@/components/buildings/BuildingFormModal";
import { format } from "date-fns";

export default function Buildings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { data: buildings = [], isLoading } = useBuildings();

  const filtered = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address_road || "").includes(searchQuery) ||
      (b.address_jibun || "").includes(searchQuery) ||
      (b.dong || "").includes(searchQuery)
  );

  const formatArea = (sqm: number | null) => {
    if (!sqm) return "-";
    return `${(sqm / 3.3058).toFixed(1)}평`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">건물 DB</h1>
          <p className="text-body text-muted-foreground mt-1">
            총 {filtered.length}건의 건물
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-11 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-default"
        >
          <Plus className="h-4 w-4" />
          건물 등록
        </button>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg card-shadow border border-border p-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="건물명, 주소, 동 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg card-shadow border border-border overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-sm text-muted-foreground">
            <Building2 className="h-8 w-8 mb-2 text-muted-foreground/50" />
            {searchQuery ? "검색 결과가 없습니다." : "등록된 건물이 없습니다."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["건물명", "주소", "대지면적", "연면적", "용적률", "층수", "주용도", "사용승인일", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-caption font-medium text-muted-foreground whitespace-nowrap"
                      >
                        {h && (
                          <button className="flex items-center gap-1 hover:text-foreground transition-default">
                            {h}
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((building) => (
                  <tr
                    key={building.id}
                    onClick={() => navigate(`/buildings/${building.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-default cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {building.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-caption text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[220px]">
                          {building.address_road || building.address_jibun || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                      {formatArea(building.land_area_sqm)}
                    </td>
                    <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                      {formatArea(building.gross_area_sqm)}
                    </td>
                    <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                      {building.floor_area_ratio ? `${building.floor_area_ratio}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                      {building.total_floors_above
                        ? `지상 ${building.total_floors_above}층${building.total_floors_below ? ` / 지하 ${building.total_floors_below}층` : ""}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-caption whitespace-nowrap">
                      {building.main_use || "-"}
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground tabular-nums whitespace-nowrap">
                      {building.approval_date
                        ? format(new Date(building.approval_date), "yyyy-MM-dd")
                        : "-"}
                    </td>
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
        )}
      </motion.div>

      <BuildingFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
