import { Landmark, Plus, Trash2, Search } from "lucide-react";
import { ListingFormData, LandParcel, LAND_CATEGORIES, ZONE_TYPES, ROAD_FRONTAGES, TERRAIN_HEIGHTS, TERRAIN_SHAPES } from "./types";
import { FormField, SectionHeader } from "./FormField";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

const newParcel = (): LandParcel => ({
  id: crypto.randomUUID(),
  dongJibun: '', areaSqm: '', areaPyeong: '',
  officialPriceSqm: '', officialPricePyeong: '', officialPriceTotal: '',
  landCategory: '', zoneType: '', usage: '', ownerType: '',
  ownerChangeDate: '', ownerChangeReason: '', roadFrontage: '',
  terrainHeight: '', terrainShape: '',
});

const sqmToPyeong = (sqm: string) => sqm ? (parseFloat(sqm) * 0.3025).toFixed(2) : '';

export default function LandInfoSection({ data, onChange }: Props) {
  const parcels = data.landParcels;

  const addParcel = () => onChange({ landParcels: [...parcels, newParcel()] });
  const removeParcel = (id: string) => onChange({ landParcels: parcels.filter((p) => p.id !== id) });
  const updateParcel = (id: string, updates: Partial<LandParcel>) => {
    onChange({
      landParcels: parcels.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if ('areaSqm' in updates) updated.areaPyeong = sqmToPyeong(updates.areaSqm || '');
        return updated;
      }),
    });
  };

  const totalSqm = parcels.reduce((s, p) => s + (parseFloat(p.areaSqm) || 0), 0);
  const totalPyeong = (totalSqm * 0.3025).toFixed(2);

  const inputClass = "w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";
  const selectClass = inputClass;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="토지 정보"
        icon={<Landmark className="h-4 w-4 text-primary" />}
        action={
          <button type="button" onClick={addParcel} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-default">
            <Plus className="h-3 w-3" /> 토지 추가
          </button>
        }
      />

      <div className="text-sm text-muted-foreground">
        토지합계: <span className="font-semibold text-foreground tabular-nums">{totalSqm.toFixed(2)}㎡ / {totalPyeong}평</span>
      </div>

      {parcels.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          토지 추가 버튼을 클릭하여 토지 정보를 입력하세요
        </div>
      )}

      {parcels.map((parcel, idx) => (
        <div key={parcel.id} className="p-4 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">토지 {idx + 1}</span>
            <button type="button" onClick={() => removeParcel(parcel.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-default">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex gap-2">
            <FormField label="동+지번" className="flex-1">
              <input type="text" value={parcel.dongJibun} onChange={(e) => updateParcel(parcel.id, { dongJibun: e.target.value })} placeholder="예: 낙원동 196" className={inputClass} />
            </FormField>
            <div className="flex items-end gap-2">
              <button type="button" className="flex items-center gap-1 h-9 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground hover:bg-muted transition-default">
                <Search className="h-3 w-3" /> 토지검색
              </button>
              <button type="button" className="h-9 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground hover:bg-muted transition-default">
                🔒 소유주확인
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="토지면적(㎡)">
              <input type="number" value={parcel.areaSqm} onChange={(e) => updateParcel(parcel.id, { areaSqm: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="토지면적(평)">
              <input type="text" value={parcel.areaPyeong} readOnly className={`${inputClass} bg-muted`} />
            </FormField>
            <FormField label="공시지가(㎡)">
              <input type="text" value={parcel.officialPriceSqm} onChange={(e) => updateParcel(parcel.id, { officialPriceSqm: e.target.value })} placeholder="원" className={inputClass} />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="지목">
              <select value={parcel.landCategory} onChange={(e) => updateParcel(parcel.id, { landCategory: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {LAND_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="용도지역">
              <select value={parcel.zoneType} onChange={(e) => updateParcel(parcel.id, { zoneType: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {ZONE_TYPES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </FormField>
            <FormField label="도로접면">
              <select value={parcel.roadFrontage} onChange={(e) => updateParcel(parcel.id, { roadFrontage: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {ROAD_FRONTAGES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="소유구분">
              <select value={parcel.ownerType} onChange={(e) => updateParcel(parcel.id, { ownerType: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                <option value="개인">개인</option>
                <option value="법인">법인</option>
                <option value="국유">국유</option>
              </select>
            </FormField>
            <FormField label="지형높이">
              <select value={parcel.terrainHeight} onChange={(e) => updateParcel(parcel.id, { terrainHeight: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {TERRAIN_HEIGHTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="지형형상">
              <select value={parcel.terrainShape} onChange={(e) => updateParcel(parcel.id, { terrainShape: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {TERRAIN_SHAPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="소유권변동일자">
              <input type="date" value={parcel.ownerChangeDate} onChange={(e) => updateParcel(parcel.id, { ownerChangeDate: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="소유권변동원인">
              <select value={parcel.ownerChangeReason} onChange={(e) => updateParcel(parcel.id, { ownerChangeReason: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                <option value="매매">매매</option>
                <option value="상속">상속</option>
                <option value="증여">증여</option>
                <option value="소유이전">소유이전</option>
              </select>
            </FormField>
          </div>
        </div>
      ))}
    </div>
  );
}
