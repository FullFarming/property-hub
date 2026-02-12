import { useState } from "react";
import { Users, Phone, Mail, Search, Plus, ArrowUpDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCustomers } from "@/hooks/useCustomers";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import { format } from "date-fns";

const typeLabel: Record<string, string> = {
  buyer: "매수인",
  seller: "매도인",
  tenant: "임차인",
  landlord: "임대인",
  investor: "투자자",
  other: "기타",
};

const gradeColor: Record<string, string> = {
  A: "bg-primary/10 text-primary",
  B: "bg-success/10 text-success",
  C: "bg-muted text-muted-foreground",
  D: "bg-warning/10 text-warning",
};

const formatBudget = (min: number | null, max: number | null) => {
  if (!min && !max) return "-";
  const fmt = (v: number) => {
    if (v >= 10000) return `${(v / 10000).toFixed(0)}억`;
    return `${v.toLocaleString()}만`;
  };
  if (min && max) return `${fmt(min)} ~ ${fmt(max)}`;
  if (min) return `${fmt(min)} 이상`;
  return `${fmt(max!)} 이하`;
};

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { data: customers = [], isLoading } = useCustomers();

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || "").includes(searchQuery) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">고객 관리</h1>
          <p className="text-body text-muted-foreground mt-1">총 {filtered.length}명의 고객</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 h-11 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-default"
        >
          <Plus className="h-4 w-4" />
          고객 등록
        </button>
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg card-shadow border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="이름, 연락처, 이메일 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-lg card-shadow border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-sm text-muted-foreground">
            <Users className="h-8 w-8 mb-2 text-muted-foreground/50" />
            {searchQuery ? "검색 결과가 없습니다." : "등록된 고객이 없습니다."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["고객명", "유형", "등급", "연락처", "이메일", "예산", "유입경로", "수정일"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-caption font-medium text-muted-foreground whitespace-nowrap">
                      <button className="flex items-center gap-1 hover:text-foreground transition-default">
                        {h}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-default cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption whitespace-nowrap">
                      {typeLabel[customer.customer_type || "other"] || customer.customer_type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${gradeColor[customer.grade || "C"] || gradeColor.C}`}>
                        {customer.grade || "C"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {customer.phone ? (
                        <div className="flex items-center gap-1 text-caption">
                          <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-caption text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {customer.email ? (
                        <div className="flex items-center gap-1 text-caption">
                          <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span className="truncate max-w-[160px]">{customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-caption text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                      {formatBudget(customer.budget_min, customer.budget_max)}
                    </td>
                    <td className="px-4 py-3 text-caption whitespace-nowrap">
                      {customer.source || "-"}
                    </td>
                    <td className="px-4 py-3 text-caption text-muted-foreground tabular-nums whitespace-nowrap">
                      {format(new Date(customer.updated_at), "yyyy-MM-dd")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <CustomerFormModal open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
