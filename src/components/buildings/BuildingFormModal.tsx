import { useState } from "react";
import { X } from "lucide-react";
import { useCreateBuilding } from "@/hooks/useBuildings";
import type { BuildingInsert } from "@/hooks/useBuildings";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BuildingFormModal({ open, onClose }: Props) {
  const createBuilding = useCreateBuilding();
  const [form, setForm] = useState<Partial<BuildingInsert>>({
    name: "",
    address_road: "",
    address_jibun: "",
    sido: "",
    gugun: "",
    dong: "",
    main_use: "",
    total_floors_above: undefined,
    total_floors_below: undefined,
    land_area_sqm: undefined,
    gross_area_sqm: undefined,
    building_area_sqm: undefined,
    floor_area_ratio: undefined,
    building_coverage: undefined,
    structure: "",
    parking: "",
    approval_date: undefined,
    latitude: undefined,
    longitude: undefined,
  });

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error("건물명을 입력해주세요.");
      return;
    }
    try {
      await createBuilding.mutateAsync({
        name: form.name!,
        address_road: form.address_road || null,
        address_jibun: form.address_jibun || null,
        sido: form.sido || null,
        gugun: form.gugun || null,
        dong: form.dong || null,
        main_use: form.main_use || null,
        total_floors_above: form.total_floors_above ?? null,
        total_floors_below: form.total_floors_below ?? null,
        land_area_sqm: form.land_area_sqm ?? null,
        gross_area_sqm: form.gross_area_sqm ?? null,
        building_area_sqm: form.building_area_sqm ?? null,
        floor_area_ratio: form.floor_area_ratio ?? null,
        building_coverage: form.building_coverage ?? null,
        structure: form.structure || null,
        parking: form.parking || null,
        approval_date: form.approval_date || null,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
      });
      toast.success("건물이 등록되었습니다.");
      onClose();
      setForm({ name: "" });
    } catch (err: any) {
      toast.error(err.message || "등록에 실패했습니다.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold">건물 등록</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-default">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">건물명 *</label>
                <input
                  value={form.name || ""}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="건물명 입력"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">주용도</label>
                <input
                  value={form.main_use || ""}
                  onChange={(e) => update("main_use", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="예: 근린생활시설"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">구조</label>
                <input
                  value={form.structure || ""}
                  onChange={(e) => update("structure", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="예: 철근콘크리트"
                />
              </div>
            </div>
          </section>

          {/* 위치 정보 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">위치 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">도로명주소</label>
                <input
                  value={form.address_road || ""}
                  onChange={(e) => update("address_road", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="도로명주소 입력"
                />
              </div>
              <div className="col-span-2">
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">지번주소</label>
                <input
                  value={form.address_jibun || ""}
                  onChange={(e) => update("address_jibun", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="지번주소 입력"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">시/도</label>
                <input
                  value={form.sido || ""}
                  onChange={(e) => update("sido", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="서울특별시"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">구/군</label>
                <input
                  value={form.gugun || ""}
                  onChange={(e) => update("gugun", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="강남구"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">동</label>
                <input
                  value={form.dong || ""}
                  onChange={(e) => update("dong", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="역삼동"
                />
              </div>
            </div>
          </section>

          {/* 건물 규모 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">건물 규모</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">지상 층수</label>
                <input
                  type="number"
                  value={form.total_floors_above ?? ""}
                  onChange={(e) => update("total_floors_above", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">지하 층수</label>
                <input
                  type="number"
                  value={form.total_floors_below ?? ""}
                  onChange={(e) => update("total_floors_below", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">대지면적 (㎡)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.land_area_sqm ?? ""}
                  onChange={(e) => update("land_area_sqm", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">연면적 (㎡)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.gross_area_sqm ?? ""}
                  onChange={(e) => update("gross_area_sqm", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">건축면적 (㎡)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.building_area_sqm ?? ""}
                  onChange={(e) => update("building_area_sqm", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">건폐율 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.building_coverage ?? ""}
                  onChange={(e) => update("building_coverage", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">용적률 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.floor_area_ratio ?? ""}
                  onChange={(e) => update("floor_area_ratio", e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">주차</label>
                <input
                  value={form.parking || ""}
                  onChange={(e) => update("parking", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  placeholder="예: 자주식 10대"
                />
              </div>
              <div>
                <label className="text-caption font-medium text-muted-foreground mb-1.5 block">사용승인일</label>
                <input
                  type="date"
                  value={form.approval_date || ""}
                  onChange={(e) => update("approval_date", e.target.value || undefined)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-default"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={createBuilding.isPending}
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-default disabled:opacity-50"
          >
            {createBuilding.isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
