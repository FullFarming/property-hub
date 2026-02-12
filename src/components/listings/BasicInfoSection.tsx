import { Settings2 } from "lucide-react";
import { ListingFormData, STATUSES, CLASSIFICATIONS, SUB_CLASSIFICATIONS } from "./types";
import { FormField, SectionHeader } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

export default function BasicInfoSection({ data, onChange }: Props) {
  const toggleSubClass = (tag: string) => {
    const current = data.subClassifications;
    onChange({
      subClassifications: current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    });
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="기본 정보" icon={<Settings2 className="h-4 w-4 text-primary" />} />

      {/* 체크박스 그룹 */}
      <div className="flex flex-wrap gap-4">
        {([
          ["isPublic", "공개"],
          ["isRecommended", "추천"],
          ["isExclusive", "전속"],
          ["isUrgent", "급매"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={data[key]}
              onCheckedChange={(v) => onChange({ [key]: !!v })}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="매물등급">
          <select
            value={data.listingGrade}
            onChange={(e) => onChange({ listingGrade: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          >
            <option value="">선택</option>
            <option value="A">A등급</option>
            <option value="B">B등급</option>
            <option value="C">C등급</option>
          </select>
        </FormField>

        <FormField label="담당자">
          <select
            value={data.assignee}
            onChange={(e) => onChange({ assignee: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          >
            <option value="">선택</option>
            <option value="김현준">김현준</option>
            <option value="박서연">박서연</option>
            <option value="이도윤">이도윤</option>
            <option value="최유진">최유진</option>
            <option value="정하은">정하은</option>
          </select>
        </FormField>
      </div>

      <FormField label="건물명">
        <input
          type="text"
          value={data.buildingName}
          onChange={(e) => onChange({ buildingName: e.target.value })}
          placeholder="건물명을 입력하세요"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
        />
      </FormField>

      {/* 진행 상태 */}
      <FormField label="진행 상태">
        <div className="flex gap-1 w-full">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ status: s })}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition-default ${
                data.status === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FormField>

      {/* 대분류 */}
      <FormField label="대분류">
        <div className="flex flex-wrap gap-1.5 w-full">
          {CLASSIFICATIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ classification: data.classification === c ? '' : c })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-default ${
                data.classification === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </FormField>

      {/* 소분류 */}
      <FormField label="소분류 (복수 선택)">
        <div className="flex flex-wrap gap-1.5 w-full">
          {SUB_CLASSIFICATIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSubClass(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-default ${
                data.subClassifications.includes(s)
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
}
