import { Building2, TrendingUp, Users, FileText, ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "전체 매물", value: "1,284", change: "+12", up: true, icon: Building2 },
  { label: "이번 달 거래", value: "38", change: "+5", up: true, icon: TrendingUp },
  { label: "관리 고객", value: "562", change: "+24", up: true, icon: Users },
  { label: "신규 매물", value: "47", change: "-3", up: false, icon: FileText },
];

const recentListings = [
  { id: "39597", name: "한성빌딩", address: "서울 종로구 낙원동 196", price: "160억", type: "매매", status: "준비" },
  { id: "39596", name: "역삼 더 센트럴", address: "서울 강남구 역삼동 823", price: "280억", type: "매매", status: "매각중" },
  { id: "39595", name: "성수 크리에이티브 팩토리", address: "서울 성동구 성수동2가 315", price: "보 5억 / 월 2,800만", type: "임대", status: "공실" },
  { id: "39594", name: "도산 플래그십 스토어", address: "서울 강남구 신사동 654", price: "보 10억 / 월 4,500만", type: "임대", status: "협의중" },
  { id: "39593", name: "을지로 오피스타워", address: "서울 중구 을지로3가 201", price: "420억", type: "매매", status: "거래완료" },
];

const recentActivities = [
  { user: "김현준", action: "매물 등록", target: "한성빌딩", time: "10분 전" },
  { user: "박서연", action: "고객 상담", target: "김OO 대표", time: "25분 전" },
  { user: "이도윤", action: "가격 수정", target: "역삼 더 센트럴", time: "1시간 전" },
  { user: "최유진", action: "거래 완료", target: "을지로 오피스타워", time: "2시간 전" },
  { user: "정하은", action: "브랜드 등록", target: "COACH Korea", time: "3시간 전" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const } }),
};

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1">대시보드</h1>
        <p className="text-body text-muted-foreground mt-1">빌딩 투자 워크스페이스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-card rounded-lg p-5 card-shadow border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-caption text-muted-foreground">{stat.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
            <p className="text-h1 tabular-nums">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {stat.up ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-success" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
              )}
              <span className={`text-caption font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                {stat.change}
              </span>
              <span className="text-caption text-muted-foreground">이번 주</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Listings */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeIn}
          className="lg:col-span-3 bg-card rounded-lg card-shadow border border-border"
        >
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="text-h3">최근 매물</h2>
            <a href="/listings" className="text-caption text-primary font-medium hover:underline">전체보기</a>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentListings.map((listing) => (
                <a
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted transition-default group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{listing.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        listing.status === "거래완료" ? "bg-success/10 text-success" :
                        listing.status === "매각중" ? "bg-warning/10 text-warning" :
                        listing.status === "공실" ? "bg-destructive/10 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-caption text-muted-foreground truncate">{listing.address}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold tabular-nums">{listing.price}</p>
                    <p className="text-caption text-muted-foreground">{listing.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeIn}
          className="lg:col-span-2 bg-card rounded-lg card-shadow border border-border"
        >
          <div className="p-5 pb-0">
            <h2 className="text-h3">최근 활동</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">{activity.user[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-muted-foreground">님이 </span>
                      <span className="font-medium">{activity.target}</span>
                      <span className="text-muted-foreground">을(를) {activity.action}</span>
                    </p>
                    <p className="text-caption text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
