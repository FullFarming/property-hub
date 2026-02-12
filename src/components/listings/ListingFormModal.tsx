import { useState } from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ListingFormData, defaultFormData } from "./types";
import BasicInfoSection from "./BasicInfoSection";
import LocationSection from "./LocationSection";
import LandInfoSection from "./LandInfoSection";
import BuildingSection from "./BuildingSection";
import PriceSection from "./PriceSection";
import CustomerSection from "./CustomerSection";
import DescriptionSection from "./DescriptionSection";
import FloorLeaseSection from "./FloorLeaseSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ListingFormModal({ open, onClose }: Props) {
  const [formData, setFormData] = useState<ListingFormData>({ ...defaultFormData });

  const updateForm = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    if (!formData.buildingName.trim()) {
      toast.error("건물명을 입력해주세요");
      return;
    }
    toast.success("매물이 저장되었습니다");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[96vw] max-w-[1600px] h-[94vh] mt-[3vh] bg-background rounded-2xl card-shadow border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
              <h2 className="text-lg font-bold">매물 등록</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 h-10 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-default"
                >
                  <Save className="h-4 w-4" />
                  매물 저장하기
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 h-10 px-4 rounded-xl border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-default"
                >
                  <X className="h-4 w-4" />
                  닫기
                </button>
              </div>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* 3-Column Grid: 좌측 / 중앙 / 우측 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 좌측: 기본정보 + 토지정보 */}
                  <div className="space-y-8">
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <BasicInfoSection data={formData} onChange={updateForm} />
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <LandInfoSection data={formData} onChange={updateForm} />
                    </div>
                  </div>

                  {/* 중앙: 위치정보 + 건축물대장 */}
                  <div className="space-y-8">
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <LocationSection data={formData} onChange={updateForm} />
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <BuildingSection data={formData} onChange={updateForm} />
                    </div>
                  </div>

                  {/* 우측: 금액정보 + 고객정보 */}
                  <div className="space-y-8">
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <PriceSection data={formData} onChange={updateForm} />
                    </div>
                    <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                      <CustomerSection data={formData} onChange={updateForm} />
                    </div>
                  </div>
                </div>

                {/* 하단 전체 너비: 상세 설명 */}
                <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                  <DescriptionSection data={formData} onChange={updateForm} />
                </div>

                {/* 하단 전체 너비: 층별 임대 정보 */}
                <div className="p-5 rounded-2xl border border-border bg-card card-shadow">
                  <FloorLeaseSection data={formData} onChange={updateForm} />
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
