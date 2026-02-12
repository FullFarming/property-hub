import { Users, Plus, Trash2, Search } from "lucide-react";
import { ListingFormData, CustomerInfo } from "./types";
import { FormField, SectionHeader } from "./FormField";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

const newCustomer = (): CustomerInfo => ({
  id: crypto.randomUUID(),
  classification: '', grade: '', name: '', phone: '',
  homePhone: '', otherPhone: '', source: '', memo: '',
});

export default function CustomerSection({ data, onChange }: Props) {
  const customers = data.customers;

  const addCustomer = () => onChange({ customers: [...customers, newCustomer()] });
  const removeCustomer = (id: string) => onChange({ customers: customers.filter((c) => c.id !== id) });
  const updateCustomer = (id: string, updates: Partial<CustomerInfo>) => {
    onChange({ customers: customers.map((c) => c.id === id ? { ...c, ...updates } : c) });
  };

  const inputClass = "w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";
  const selectClass = inputClass;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="고객 정보"
        icon={<Users className="h-4 w-4 text-primary" />}
        action={
          <div className="flex gap-2">
            <button type="button" className="flex items-center gap-1 h-8 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground hover:bg-muted transition-default">
              <Search className="h-3 w-3" /> 고객찾기
            </button>
            <button type="button" onClick={addCustomer} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-default">
              <Plus className="h-3 w-3" /> 고객추가
            </button>
          </div>
        }
      />

      {customers.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          고객 추가 버튼을 클릭하여 고객 정보를 입력하세요
        </div>
      )}

      {customers.map((cust, idx) => (
        <div key={cust.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">고객 {idx + 1}</span>
            <button type="button" onClick={() => removeCustomer(cust.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-default">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="고객분류">
              <select value={cust.classification} onChange={(e) => updateCustomer(cust.id, { classification: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                <option value="매수인">매수인</option>
                <option value="매도인">매도인</option>
                <option value="임차인">임차인</option>
                <option value="임대인">임대인</option>
                <option value="투자자">투자자</option>
              </select>
            </FormField>
            <FormField label="고객등급">
              <select value={cust.grade} onChange={(e) => updateCustomer(cust.id, { grade: e.target.value })} className={selectClass}>
                <option value="">선택</option>
                <option value="VIP">VIP</option>
                <option value="A">A등급</option>
                <option value="B">B등급</option>
                <option value="C">C등급</option>
              </select>
            </FormField>
          </div>

          <FormField label="고객명">
            <input type="text" value={cust.name} onChange={(e) => updateCustomer(cust.id, { name: e.target.value })} placeholder="이름" className={inputClass} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="휴대전화">
              <input type="tel" value={cust.phone} onChange={(e) => updateCustomer(cust.id, { phone: e.target.value })} placeholder="010-0000-0000" className={inputClass} />
            </FormField>
            <FormField label="자택전화">
              <input type="tel" value={cust.homePhone} onChange={(e) => updateCustomer(cust.id, { homePhone: e.target.value })} placeholder="02-0000-0000" className={inputClass} />
            </FormField>
          </div>

          <FormField label="유입경로">
            <select value={cust.source} onChange={(e) => updateCustomer(cust.id, { source: e.target.value })} className={selectClass}>
              <option value="">선택</option>
              <option value="직접방문">직접방문</option>
              <option value="전화문의">전화문의</option>
              <option value="소개">소개</option>
              <option value="온라인">온라인</option>
              <option value="기타">기타</option>
            </select>
          </FormField>

          <FormField label="메모">
            <textarea value={cust.memo} onChange={(e) => updateCustomer(cust.id, { memo: e.target.value })} rows={2} placeholder="메모를 입력하세요" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-none" />
          </FormField>
        </div>
      ))}
    </div>
  );
}
