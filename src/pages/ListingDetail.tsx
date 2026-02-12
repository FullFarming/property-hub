import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Heart, Share2, Printer, Train, Bus, ChevronDown, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const listing = {
  id: "39597",
  name: "한성빌딩",
  address: "서울 종로구 낙원동 196",
  roadAddress: "서울 종로구 돈화문로길 34",
  price: "160억",
  pricePerPyeong: "1억 595만",
  pricePerGross: "5,945만",
  yieldRate: "-",
  landArea: "151.01평",
  grossArea: "269.1평",
  buildingArea: "65.67평",
  floors: "지하 1층 / 지상 3층",
  mainUse: "제2종근린생활시설",
  structure: "철근콘크리트구조",
  approvalDate: "1981-08-20",
  coverageRatio: "41.69%",
  farRatio: "129.83%",
  status: "준비",
  type: "매각중",
  tags: ["역세권", "대로변"],
  assignee: { name: "김현준 대리", phone: "010-7271-1668", office: "02-3706-8805", email: "Calvin.Kim@cushwake.com" },
  registeredAt: "2026-02-11 18:11:56",
};

const floorInfo = [
  { floor: "3층", use: "가정시무소", otherUse: "사무실", area: "65.57평" },
  { floor: "2층", use: "제2종근린생활시설", otherUse: "사무실", area: "65.57평" },
  { floor: "1층", use: "제2종근린생활시설", otherUse: "판매시설", area: "64.71평" },
  { floor: "지하1층", use: "제2종근린생활시설", otherUse: "판매시설", area: "31.71평" },
];

const landPrices = [
  { year: 2025, price: "49,917,127", change: "+3.2%" },
  { year: 2024, price: "48,396,472", change: "+1.2%" },
  { year: 2023, price: "47,822,105", change: "+2.8%" },
  { year: 2022, price: "46,520,433", change: "+5.1%" },
];

const subways = [
  { line: "1호선", station: "종로3가역", distance: "도보 250m" },
  { line: "3호선", station: "종로3가역", distance: "도보 250m" },
  { line: "5호선", station: "종로3가역", distance: "도보 250m" },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/50 transition-default">
        <h3 className="text-h3">{title}</h3>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-default ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 py-4 bg-card border-t border-border">{children}</div>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-2.5 border-b border-border last:border-0">
      <span className="w-40 text-caption text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-default mb-4">
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Main Content */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0 space-y-4">
          {/* Header Card */}
          <div className="bg-card rounded-lg card-shadow border border-border p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-caption text-muted-foreground"># 매물번호 {listing.id}</span>
              <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-warning/10 text-warning">{listing.type}</span>
              {listing.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{tag}</span>
              ))}
            </div>
            <h1 className="text-h1 mt-2">{listing.name}</h1>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {listing.address} ({listing.roadAddress})
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {[
                { label: "매매가", value: listing.price },
                { label: "수익률", value: listing.yieldRate },
                { label: "평당가(대지)", value: listing.pricePerPyeong },
                { label: "대지/연/건축면적", value: `${listing.landArea} / ${listing.grossArea} / ${listing.buildingArea}` },
              ].map((m) => (
                <div key={m.label} className="bg-muted/50 rounded-lg p-4">
                  <p className="text-caption text-muted-foreground">{m.label}</p>
                  <p className="text-number mt-1 tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <Section title="기본 정보">
            <InfoRow label="소재지" value={`${listing.address} (${listing.roadAddress})`} />
            <InfoRow label="매물번호" value={listing.id} />
            <InfoRow label="건물명" value={listing.name} />
            <InfoRow label="건물상태" value={listing.status} />
            <InfoRow label="매매유형" value={listing.type} />
            <InfoRow label="수익률" value={listing.yieldRate} />
            <InfoRow label="등록일" value={listing.registeredAt} />
          </Section>

          {/* Price Info */}
          <Section title="금액 정보">
            <InfoRow label="매매가" value={listing.price} />
            <InfoRow label="대지면적 평당가" value={listing.pricePerPyeong} />
            <InfoRow label="연면적 평당가" value={listing.pricePerGross} />
          </Section>

          {/* Building Info */}
          <Section title="건물 정보">
            <InfoRow label="층정보" value={listing.floors} />
            <InfoRow label="대지면적" value={listing.landArea} />
            <InfoRow label="연면적" value={listing.grossArea} />
            <InfoRow label="건폐율" value={listing.coverageRatio} />
            <InfoRow label="용적률" value={listing.farRatio} />
            <InfoRow label="주용도" value={listing.mainUse} />
            <InfoRow label="구조" value={listing.structure} />
            <InfoRow label="사용승인일" value={listing.approvalDate} />

            <h4 className="text-sm font-semibold mt-6 mb-3">층별 정보</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">층</th>
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">주용도</th>
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">기타용도</th>
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">면적</th>
                  </tr>
                </thead>
                <tbody>
                  {floorInfo.map((f) => (
                    <tr key={f.floor} className="border-b border-border last:border-0">
                      <td className="py-2.5 px-3 font-medium">{f.floor}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{f.use}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{f.otherUse}</td>
                      <td className="py-2.5 px-3 tabular-nums">{f.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Land Price Trend */}
          <Section title="개별 공시지가 추이" defaultOpen={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">기준년도</th>
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">공시지가(원)</th>
                    <th className="text-left py-2 px-3 text-caption text-muted-foreground font-medium">변동</th>
                  </tr>
                </thead>
                <tbody>
                  {landPrices.map((p) => (
                    <tr key={p.year} className="border-b border-border last:border-0">
                      <td className="py-2.5 px-3 font-medium tabular-nums">{p.year}</td>
                      <td className="py-2.5 px-3 tabular-nums">{p.price}원</td>
                      <td className="py-2.5 px-3 text-success font-medium tabular-nums">{p.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Transportation */}
          <Section title="근접 교통 정보" defaultOpen={false}>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">근접 지하철</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subways.map((s, i) => (
                    <span key={i} className="text-caption px-3 py-1.5 rounded-lg bg-primary/5 text-primary font-medium">
                      [{s.line}] {s.station} {s.distance}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bus className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">근접 버스</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["종로3가 도보 50m", "낙원동 도보 100m", "종로2가 도보 200m"].map((b) => (
                    <span key={b} className="text-caption px-3 py-1.5 rounded-lg bg-muted text-muted-foreground">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </motion.div>

        {/* Right Side Panel */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full lg:w-80 shrink-0 space-y-4">
          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:bg-muted transition-default">
              <Heart className="h-4 w-4" /> 즐겨찾기
            </button>
            <button className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:bg-muted transition-default">
              <Share2 className="h-4 w-4" /> 공유
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted transition-default">
              <Printer className="h-4 w-4" />
            </button>
          </div>

          {/* Assignee Card */}
          <div className="bg-card rounded-lg card-shadow border border-border p-5">
            <h3 className="text-sm font-semibold mb-4">담당자 정보</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">김</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{listing.assignee.name}</p>
                <p className="text-caption text-muted-foreground">{listing.assignee.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`tel:${listing.assignee.phone}`} className="flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-default">
                <Phone className="h-3.5 w-3.5" /> {listing.assignee.phone}
              </a>
              <a href={`tel:${listing.assignee.office}`} className="flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-default">
                <Phone className="h-3.5 w-3.5" /> {listing.assignee.office}
              </a>
              <a href={`mailto:${listing.assignee.email}`} className="flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground transition-default">
                <Mail className="h-3.5 w-3.5" /> 이메일 보내기
              </a>
            </div>
          </div>

          {/* Secret Memo */}
          <div className="bg-card rounded-lg card-shadow border border-border p-5">
            <h3 className="text-sm font-semibold mb-3">비밀메모</h3>
            <textarea
              placeholder="담당자만 볼 수 있는 메모를 입력하세요..."
              className="w-full h-24 px-3 py-2 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-none"
            />
          </div>

          {/* Work Log */}
          <div className="bg-card rounded-lg card-shadow border border-border p-5">
            <h3 className="text-sm font-semibold mb-3">업무일지</h3>
            <select className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background text-muted-foreground mb-2">
              <option>전화</option>
              <option>대면</option>
              <option>이메일</option>
              <option>기타</option>
            </select>
            <textarea
              placeholder="업무 내용을 입력하세요..."
              className="w-full h-20 px-3 py-2 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default resize-none"
            />
            <button className="w-full mt-2 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-default">
              입력
            </button>

            <div className="mt-4 space-y-3">
              {[
                { type: "전화", content: "가격 관련 문의 — 매도 측 의향 확인", time: "2026-02-11 14:30" },
                { type: "대면", content: "현장 답사 완료, 건물 상태 양호", time: "2026-02-10 10:00" },
              ].map((log, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-3 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{log.type}</span>
                    <span className="text-caption text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm mt-1">{log.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
