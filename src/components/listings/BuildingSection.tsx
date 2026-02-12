import { Building2, Plus, Trash2, Search } from "lucide-react";
import { ListingFormData, BuildingInfo, BUILDING_USES, BUILDING_STRUCTURES } from "./types";
import { FormField, SectionHeader } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

const newBuilding = (): BuildingInfo => ({
  id: crypto.randomUUID(),
  dongJibun: '', dongName: '', floorsBelow: '', floorsAbove: '',
  mainUse: '', structure: '',
  landAreaSqm: '', landAreaPyeong: '',
  grossAreaSqm: '', grossAreaPyeong: '',
  buildingAreaSqm: '', buildingAreaPyeong: '',
  farAreaSqm: '', farAreaPyeong: '',
  isUnregistered: false, isViolation: false, isStrata: false,
});

const sqmToPyeong = (sqm: string) => sqm ? (parseFloat(sqm) * 0.3025).toFixed(2) : '';

export default function BuildingSection({ data, onChange }: Props) {
  const buildings = data.buildings;

  const addBuilding = () => onChange({ buildings: [...buildings, newBuilding()] });
  const removeBuilding = (id: string) => onChange({ buildings: buildings.filter((b) => b.id !== id) });
  const updateBuilding = (id: string, updates: Partial<BuildingInfo>) => {
    onChange({
      buildings: buildings.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...updates };
        if ('landAreaSqm' in updates) updated.landAreaPyeong = sqmToPyeong(updates.landAreaSqm || '');
        if ('grossAreaSqm' in updates) updated.grossAreaPyeong = sqmToPyeong(updates.grossAreaSqm || '');
        if ('buildingAreaSqm' in updates) updated.buildingAreaPyeong = sqmToPyeong(updates.buildingAreaSqm || '');
        if ('farAreaSqm' in updates) updated.farAreaPyeong = sqmToPyeong(updates.farAreaSqm || '');
        return updated;
      }),
    });
  };

  const inputClass = "w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";
  const selectClass = inputClass;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="건축물대장"
        icon={<Building2 className="h-4 w-4 text-primary" />}
        action={
          <button type="button" onClick={addBuilding} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-default">
            <Plus className="h-3 w-3" /> 건물 추가
          </button>
        }
      />

      {buildings.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          건물 추가 버튼을 클릭하여 건축물 정보를 입력하세요
        </div>
      )}

      {buildings.map((bldg, idx) => (
        <div key={bldg.id} className="p-4 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">건물 {idx + 1}</span>
            <button type="button" onClick={() => removeBuilding(bldg.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-default">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 체크박스 */}
          <div className="flex gap-4">
            {([
              ["isUnregistered", "미등기건물"],
              ["isViolation", "위반건축물"],
              ["isStrata", "구분 상가"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={bldg[key]}
                  onCheckedChange={(v) => updateBuilding(bldg.id, { [key]: !!v })}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <FormField label="동+지번" className="flex-1">
              <input type="text" value={bldg.dongJibun} onChange={(e) => updateBuilding(bldg.id, { dongJibun: e.target.value })} className={inputClass} />
            </FormField>
            <div className="flex items-end">
              <button type="button" className="flex items-center gap-1 h-9 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground hover:bg-muted transition-default">
                <Search className="h-3 w-3" /> 건축물검색
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="동명">
              <input type="text" value={bldg.dongName} onChange={(e) => updateBuilding(bldg.id, { dongName: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="지하 층수">
              <input type="number" value={bldg.floorsBelow} onChange={(e) => updateBuilding(bldg.id, { floorsBelow: e.target.value })} placeholder="층" className={inputClass} />
            </FormField>
            <FormField label="지상 층수">
              <input type="number" value={bldg.floorsAbove} onChange={(e) => updateBuilding(bldg.id, { floorsAbove: e.target.value })} placeholder="층" className={inputClass} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="주용도">
              <select value={bldg.mainUse} onChange={(e) => updateBuilding(bldg.id, { mainUse: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {BUILDING_USES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </FormField>
            <FormField label="주구조">
              <select value={bldg.structure} onChange={(e) => updateBuilding(bldg.id, { structure: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                {BUILDING_STRUCTURES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="대지면적(㎡)" suffix="㎡">
              <input type="number" value={bldg.landAreaSqm} onChange={(e) => updateBuilding(bldg.id, { landAreaSqm: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="대지면적(평)" suffix="평">
              <input type="text" value={bldg.landAreaPyeong} readOnly className={`${inputClass} bg-muted`} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="연면적(㎡)" suffix="㎡">
              <input type="number" value={bldg.grossAreaSqm} onChange={(e) => updateBuilding(bldg.id, { grossAreaSqm: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="연면적(평)" suffix="평">
              <input type="text" value={bldg.grossAreaPyeong} readOnly className={`${inputClass} bg-muted`} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="건축면적(㎡)" suffix="㎡">
              <input type="number" value={bldg.buildingAreaSqm} onChange={(e) => updateBuilding(bldg.id, { buildingAreaSqm: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="건축면적(평)" suffix="평">
              <input type="text" value={bldg.buildingAreaPyeong} readOnly className={`${inputClass} bg-muted`} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="용적률산정 연면적(㎡)" suffix="㎡">
              <input type="number" value={bldg.farAreaSqm} onChange={(e) => updateBuilding(bldg.id, { farAreaSqm: e.target.value })} className={inputClass} />
            </FormField>
            <FormField label="용적률산정 연면적(평)" suffix="평">
              <input type="text" value={bldg.farAreaPyeong} readOnly className={`${inputClass} bg-muted`} />
            </FormField>
          </div>
        </div>
      ))}
    </div>
  );
}
