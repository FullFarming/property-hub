import { FileText } from "lucide-react";
import { ListingFormData } from "./types";
import { FormField, SectionHeader } from "./FormField";

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

export default function DescriptionSection({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionHeader title="상세 설명 & 미디어" icon={<FileText className="h-4 w-4 text-primary" />} />

      <FormField label="광고 노출용 제목">
        <input
          type="text"
          value={data.adTitle}
          onChange={(e) => onChange({ adTitle: e.target.value })}
          placeholder="공개 매물에만 적용됩니다"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
        />
      </FormField>

      <FormField label="상세 설명">
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={8}
          placeholder="매물의 상세 설명을 입력하세요"
          className="w-full px-3 py-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-y"
        />
      </FormField>

      <FormField label="기타 특징">
        <textarea
          value={data.features}
          onChange={(e) => onChange({ features: e.target.value })}
          rows={3}
          placeholder="기타 특징을 입력하세요"
          className="w-full px-3 py-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-y"
        />
      </FormField>

      <FormField label="비밀메모">
        <div className="w-full space-y-1">
          <textarea
            value={data.secretMemo}
            onChange={(e) => onChange({ secretMemo: e.target.value })}
            rows={3}
            placeholder="관리자나 해당 담당자에게만 보이는 내용입니다"
            className="w-full px-3 py-3 rounded-lg border border-warning/30 bg-warning/5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-default resize-y"
          />
          <p className="text-xs text-warning">⚠️ 이 메모는 관리자와 담당자에게만 표시됩니다</p>
        </div>
      </FormField>

      {/* 템플릿 파일 업로드 */}
      <div className="pt-2">
        <p className="text-sm font-semibold mb-3">템플릿 파일 업로드</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {["대표 이미지", "위치도", "건축물 정보", "건축물 정보2", "이용계획(부분)", "이용계획(전체)", "기타1", "기타2", "기타3"].map((slot) => (
            <div key={slot} className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-default cursor-pointer min-h-[80px]">
              <span className="text-xs text-muted-foreground">{slot}</span>
              <button type="button" className="mt-2 text-xs text-primary font-medium hover:underline">
                파일 선택
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
