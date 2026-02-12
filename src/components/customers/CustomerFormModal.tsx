import { useState } from "react";
import { X } from "lucide-react";
import { useCreateCustomer } from "@/hooks/useCustomers";
import type { CustomerInsert } from "@/hooks/useCustomers";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const customerTypes = [
  { value: "buyer", label: "매수인" },
  { value: "seller", label: "매도인" },
  { value: "tenant", label: "임차인" },
  { value: "landlord", label: "임대인" },
  { value: "investor", label: "투자자" },
  { value: "other", label: "기타" },
];

const grades = [
  { value: "A", label: "A (VIP)" },
  { value: "B", label: "B (우수)" },
  { value: "C", label: "C (일반)" },
  { value: "D", label: "D (잠재)" },
];

const sources = ["직접방문", "전화문의", "온라인", "소개", "광고", "기타"];

export default function CustomerFormModal({ open, onClose }: Props) {
  const createCustomer = useCreateCustomer();
  const [form, setForm] = useState<Partial<CustomerInsert>>({
    name: "",
    phone: "",
    email: "",
    customer_type: "buyer",
    grade: "C",
    source: "",
    home_phone: "",
    other_phone: "",
    memo: "",
    budget_min: undefined,
    budget_max: undefined,
    area_min: undefined,
    area_max: undefined,
  });

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error("고객명을 입력해주세요.");
      return;
    }
    try {
      await createCustomer.mutateAsync({
        name: form.name!,
        phone: form.phone || null,
        email: form.email || null,
        customer_type: form.customer_type || "buyer",
        grade: form.grade || "C",
        source: form.source || null,
        home_phone: form.home_phone || null,
        other_phone: form.other_phone || null,
        memo: form.memo || null,
        budget_min: form.budget_min ?? null,
        budget_max: form.budget_max ?? null,
        area_min: form.area_min ?? null,
        area_max: form.area_max ?? null,
      });
      toast.success("고객이 등록되었습니다.");
      onClose();
      setForm({ name: "", customer_type: "buyer", grade: "C" });
    } catch (err: any) {
      toast.error(err.message || "등록에 실패했습니다.");
    }
  };

  if (!open) return null;

  const inputClass =
    "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default";
  const labelClass = "text-caption font-medium text-muted-foreground mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold">고객 등록</h2>
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
                <label className={labelClass}>고객명 *</label>
                <input value={form.name || ""} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="고객명 입력" />
              </div>
              <div>
                <label className={labelClass}>고객 유형</label>
                <select value={form.customer_type || "buyer"} onChange={(e) => update("customer_type", e.target.value)} className={inputClass}>
                  {customerTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>등급</label>
                <select value={form.grade || "C"} onChange={(e) => update("grade", e.target.value)} className={inputClass}>
                  {grades.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>유입 경로</label>
                <select value={form.source || ""} onChange={(e) => update("source", e.target.value)} className={inputClass}>
                  <option value="">선택</option>
                  {sources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 연락처 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">연락처</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>휴대전화</label>
                <input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="010-0000-0000" />
              </div>
              <div>
                <label className={labelClass}>이메일</label>
                <input value={form.email || ""} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>자택 전화</label>
                <input value={form.home_phone || ""} onChange={(e) => update("home_phone", e.target.value)} className={inputClass} placeholder="02-000-0000" />
              </div>
              <div>
                <label className={labelClass}>기타 연락처</label>
                <input value={form.other_phone || ""} onChange={(e) => update("other_phone", e.target.value)} className={inputClass} placeholder="기타 연락처" />
              </div>
            </div>
          </section>

          {/* 조건 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">매수/임차 조건</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>예산 최소 (만원)</label>
                <input type="number" value={form.budget_min ?? ""} onChange={(e) => update("budget_min", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>예산 최대 (만원)</label>
                <input type="number" value={form.budget_max ?? ""} onChange={(e) => update("budget_max", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>면적 최소 (평)</label>
                <input type="number" step="0.1" value={form.area_min ?? ""} onChange={(e) => update("area_min", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>면적 최대 (평)</label>
                <input type="number" step="0.1" value={form.area_max ?? ""} onChange={(e) => update("area_max", e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
              </div>
            </div>
          </section>

          {/* 메모 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">메모</h3>
            <textarea
              value={form.memo || ""}
              onChange={(e) => update("memo", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-none"
              placeholder="고객 관련 메모를 입력하세요."
            />
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="h-10 px-5 rounded-lg border border-input text-sm font-medium hover:bg-muted transition-default">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={createCustomer.isPending}
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-default disabled:opacity-50"
          >
            {createCustomer.isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
