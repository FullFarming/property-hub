import { MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { ListingFormData } from "./types";
import { FormField, SectionHeader } from "./FormField";
import { Checkbox } from "@/components/ui/checkbox";
import NaverMap from "@/components/NaverMap";

function NaverMapPreview({ address }: { address: string }) {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });

  useEffect(() => {
    if (!address || !window.naver?.maps?.Service) return;
    window.naver.maps.Service.geocode({ query: address }, (status: any, response: any) => {
      if (status !== window.naver.maps.Service.Status.OK) return;
      const result = response.v2?.addresses?.[0];
      if (result) {
        setCenter({ lat: parseFloat(result.y), lng: parseFloat(result.x) });
      }
    });
  }, [address]);

  return (
    <NaverMap
      className="w-full h-40 rounded-xl border border-border overflow-hidden"
      center={center}
      zoom={16}
      markers={[{ lat: center.lat, lng: center.lng }]}
    />
  );
}

interface Props {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
}

export default function LocationSection({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionHeader title="위치 정보" icon={<MapPin className="h-4 w-4 text-primary" />} />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox
          checked={data.roadviewPublic}
          onCheckedChange={(v) => onChange({ roadviewPublic: !!v })}
        />
        로드뷰 공개
      </label>

      {/* 주소 입력 */}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="시/도">
          <select
            value={data.sido}
            onChange={(e) => onChange({ sido: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          >
            <option value="">선택</option>
            <option value="서울">서울특별시</option>
            <option value="경기">경기도</option>
            <option value="인천">인천광역시</option>
            <option value="부산">부산광역시</option>
          </select>
        </FormField>

        <FormField label="구/군">
          <select
            value={data.gugun}
            onChange={(e) => onChange({ gugun: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          >
            <option value="">선택</option>
            <option value="종로구">종로구</option>
            <option value="강남구">강남구</option>
            <option value="서초구">서초구</option>
            <option value="마포구">마포구</option>
            <option value="성동구">성동구</option>
            <option value="용산구">용산구</option>
            <option value="중구">중구</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="동/읍/면">
          <input
            type="text"
            value={data.dong}
            onChange={(e) => onChange({ dong: e.target.value })}
            placeholder="동 입력"
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          />
        </FormField>
        <FormField label="지번">
          <input
            type="text"
            value={data.jibun}
            onChange={(e) => onChange({ jibun: e.target.value })}
            placeholder="지번 입력"
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          />
        </FormField>
      </div>

      <FormField label="도로명 주소">
        <input
          type="text"
          value={data.roadAddress}
          onChange={(e) => onChange({ roadAddress: e.target.value })}
          placeholder="도로명 주소를 입력하세요"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
        />
      </FormField>

      <div className="flex gap-2">
        <button type="button" className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-default">
          <Search className="h-3.5 w-3.5" />
          우편으로 찾기
        </button>
        <button type="button" className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive hover:bg-destructive/10 transition-default">
          <Search className="h-3.5 w-3.5" />
          중복 매물 체크
        </button>
      </div>

      <FormField label="상세주소">
        <input
          type="text"
          value={data.detailAddress}
          onChange={(e) => onChange({ detailAddress: e.target.value })}
          placeholder="상세주소 입력"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
        />
      </FormField>

      <FormField label="지하철 정보">
        <input
          type="text"
          value={data.subwayInfo}
          onChange={(e) => onChange({ subwayInfo: e.target.value })}
          placeholder="미입력 시 자동 저장됩니다"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
        />
      </FormField>

      {/* 지도 미리보기 */}
      {data.roadAddress || data.dong ? (
        <NaverMapPreview address={data.roadAddress || `${data.sido} ${data.gugun} ${data.dong}`} />
      ) : (
        <div className="w-full h-40 rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground border border-border">
          주소 입력 시 지도가 표시됩니다
        </div>
      )}

      {/* 위치 공개 설정 */}
      <FormField label="위치 공개 설정">
        <div className="flex gap-2 w-full">
          {["비공개", "위치 숨기기", "공개"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ locationVisibility: opt })}
              className={`flex-1 h-9 rounded-lg text-sm font-medium transition-default ${
                data.locationVisibility === opt
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  );
}
