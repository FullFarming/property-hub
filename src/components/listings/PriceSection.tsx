import { Banknote } from "lucide-react";
import { ListingFormData } from "./types";
import { FormField, SectionHeader } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

export default function PriceSection({ data, onChange }: Props) {
  const inputClass = "w-full h-9 px-3 rounded-lg border border-input bg-background text-sm tabular-nums placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";

  return (
    <div className="space-y-5">
      <SectionHeader title="금액 정보" icon={<Banknote className="h-4 w-4 text-primary" />} />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="수수료">
          <select
            value={data.commissionType}
            onChange={(e) => onChange({ commissionType: e.target.value })}
            className={inputClass}
          >
            <option value="">선택</option>
            <option value="매도자">매도자</option>
            <option value="매수자">매수자</option>
            <option value="양쪽">양쪽</option>
          </select>
        </FormField>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer h-9">
            <Checkbox
              checked={data.vatExcluded}
              onCheckedChange={(v) => onChange({ vatExcluded: !!v })}
            />
            부가세별도
          </label>
        </div>
      </div>

      <FormField label="매매가" suffix="만원">
        <input type="text" value={data.salePrice} onChange={(e) => onChange({ salePrice: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="임금가" suffix="만원">
        <input type="text" value={data.leasePrice} onChange={(e) => onChange({ leasePrice: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="기타매매가" suffix="만원">
        <input type="text" value={data.otherPrice} onChange={(e) => onChange({ otherPrice: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="수익률" suffix="%">
        <input type="text" value={data.yieldRate} onChange={(e) => onChange({ yieldRate: e.target.value })} placeholder="0.0" className={inputClass} />
      </FormField>

      <FormField label="평단가" suffix="만원">
        <input type="text" value={data.pricePerPyeong} onChange={(e) => onChange({ pricePerPyeong: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium">임대 관련</p>
      </div>

      <FormField label="보증금" suffix="만원">
        <input type="text" value={data.deposit} onChange={(e) => onChange({ deposit: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="월임대료" suffix="만원">
        <input type="text" value={data.monthlyRent} onChange={(e) => onChange({ monthlyRent: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="관리비" suffix="만원">
        <input type="text" value={data.maintenanceFee} onChange={(e) => onChange({ maintenanceFee: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="관리비지출" suffix="만원">
        <input type="text" value={data.maintenanceExpense} onChange={(e) => onChange({ maintenanceExpense: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>

      <FormField label="관리비기타" suffix="만원">
        <input type="text" value={data.maintenanceOther} onChange={(e) => onChange({ maintenanceOther: e.target.value })} placeholder="0" className={inputClass} />
      </FormField>
    </div>
  );
}
