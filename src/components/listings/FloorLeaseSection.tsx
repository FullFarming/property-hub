import { Layers, Plus, Trash2 } from "lucide-react";
import { ListingFormData, FloorLeaseRow } from "./types";
import { SectionHeader } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

const newRow = (): FloorLeaseRow => ({
  id: crypto.randomUUID(),
  floor: '', leaseArea: '', leaseAreaPyeong: '', tenantType: '',
  deposit: '', monthlyRent: '', maintenanceFee: '', note: '',
  isVacant: false, isHidden: false,
});

export default function FloorLeaseSection({ data, onChange }: Props) {
  const rows = data.floorLeases;

  const addRow = () => onChange({ floorLeases: [...rows, newRow()] });
  const removeRow = (id: string) => onChange({ floorLeases: rows.filter((r) => r.id !== id) });
  const updateRow = (id: string, updates: Partial<FloorLeaseRow>) => {
    onChange({
      floorLeases: rows.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        if ('leaseArea' in updates) {
          updated.leaseAreaPyeong = updates.leaseArea ? (parseFloat(updates.leaseArea) * 0.3025).toFixed(2) : '';
        }
        return updated;
      }),
    });
  };

  const totalDeposit = rows.reduce((s, r) => s + (parseFloat(r.deposit) || 0), 0);
  const totalRent = rows.reduce((s, r) => s + (parseFloat(r.monthlyRent) || 0), 0);
  const totalMaint = rows.reduce((s, r) => s + (parseFloat(r.maintenanceFee) || 0), 0);

  const inputClass = "w-full h-8 px-2 rounded-md border border-input bg-background text-xs tabular-nums placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";

  return (
    <div className="space-y-4">
      <SectionHeader
        title="층별 임대 정보"
        icon={<Layers className="h-4 w-4 text-primary" />}
        action={
          <div className="flex gap-2">
            <button type="button" onClick={addRow} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-default">
              <Plus className="h-3 w-3" /> 행 추가
            </button>
            <button type="button" className="h-8 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground hover:bg-muted transition-default">
              합계금액주입
            </button>
          </div>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-20">층수</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-20">임대면적(㎡)</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-20">임대면적(평)</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-24">업종</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-24">보증금(만)</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-24">월세(만)</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-24">관리비(만)</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground w-24">비고</th>
              <th className="px-2 py-2 text-center font-medium text-muted-foreground w-12">공실</th>
              <th className="px-2 py-2 text-center font-medium text-muted-foreground w-12">숨김</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center text-muted-foreground">
                  행 추가 버튼을 클릭하여 층별 임대 정보를 입력하세요
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-1 py-1"><input type="text" value={row.floor} onChange={(e) => updateRow(row.id, { floor: e.target.value })} placeholder="1F" className={inputClass} /></td>
                <td className="px-1 py-1"><input type="number" value={row.leaseArea} onChange={(e) => updateRow(row.id, { leaseArea: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1"><input type="text" value={row.leaseAreaPyeong} readOnly className={`${inputClass} bg-muted`} /></td>
                <td className="px-1 py-1"><input type="text" value={row.tenantType} onChange={(e) => updateRow(row.id, { tenantType: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1"><input type="text" value={row.deposit} onChange={(e) => updateRow(row.id, { deposit: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1"><input type="text" value={row.monthlyRent} onChange={(e) => updateRow(row.id, { monthlyRent: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1"><input type="text" value={row.maintenanceFee} onChange={(e) => updateRow(row.id, { maintenanceFee: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1"><input type="text" value={row.note} onChange={(e) => updateRow(row.id, { note: e.target.value })} className={inputClass} /></td>
                <td className="px-1 py-1 text-center"><Checkbox checked={row.isVacant} onCheckedChange={(v) => updateRow(row.id, { isVacant: !!v })} /></td>
                <td className="px-1 py-1 text-center"><Checkbox checked={row.isHidden} onCheckedChange={(v) => updateRow(row.id, { isHidden: !!v })} /></td>
                <td className="px-1 py-1 text-center">
                  <button type="button" onClick={() => removeRow(row.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-default">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length > 0 && (
              <tr className="bg-muted/30 font-semibold">
                <td className="px-2 py-2" colSpan={4}>합계</td>
                <td className="px-2 py-2 tabular-nums">{totalDeposit.toLocaleString()}</td>
                <td className="px-2 py-2 tabular-nums">{totalRent.toLocaleString()}</td>
                <td className="px-2 py-2 tabular-nums">{totalMaint.toLocaleString()}</td>
                <td colSpan={4}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
