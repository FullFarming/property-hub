import { useState, useRef, useCallback } from "react";
import {
  FolderOpen,
  Search,
  Upload,
  FileText,
  FileImage,
  File,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDocuments, useUploadDocument, useDeleteDocument, getSignedUrl } from "@/hooks/useDocuments";
import type { Document } from "@/hooks/useDocuments";
import { toast } from "sonner";
import { format } from "date-fns";

const fileIcon = (mime: string | null) => {
  if (!mime) return File;
  if (mime.startsWith("image/")) return FileImage;
  return FileText;
};

const formatSize = (bytes: number | null) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: documents = [], isLoading } = useDocuments();
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();

  const filtered = documents.filter((d) =>
    d.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      for (const file of Array.from(files)) {
        try {
          await uploadDoc.mutateAsync(file);
          toast.success(`${file.name} 업로드 완료`);
        } catch (err: any) {
          toast.error(`${file.name}: ${err.message}`);
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadDoc]
  );

  const handleDownload = async (doc: Document) => {
    try {
      const url = await getSignedUrl(doc.file_path);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      a.click();
    } catch (err: any) {
      toast.error("다운로드에 실패했습니다.");
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`"${doc.file_name}" 파일을 삭제하시겠습니까?`)) return;
    try {
      await deleteDoc.mutateAsync(doc);
      toast.success("파일이 삭제되었습니다.");
    } catch (err: any) {
      toast.error(err.message || "삭제에 실패했습니다.");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">내 문서</h1>
          <p className="text-body text-muted-foreground mt-1">
            총 {filtered.length}개의 파일
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadDoc.isPending}
            className="flex items-center gap-2 h-11 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-default disabled:opacity-50"
          >
            {uploadDoc.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            파일 업로드
          </button>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg card-shadow border border-border p-4"
      >
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="파일명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
          />
        </div>
      </motion.div>

      {/* File List */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg card-shadow border border-border overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-sm text-muted-foreground">
            <FolderOpen className="h-8 w-8 mb-2 text-muted-foreground/50" />
            {searchQuery ? "검색 결과가 없습니다." : "업로드된 문서가 없습니다."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["파일명", "크기", "형식", "업로드일", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-caption font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const Icon = fileIcon(doc.mime_type);
                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-default group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium truncate max-w-[300px]">
                            {doc.file_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-caption tabular-nums whitespace-nowrap">
                        {formatSize(doc.file_size)}
                      </td>
                      <td className="px-4 py-3 text-caption whitespace-nowrap">
                        {doc.mime_type?.split("/").pop()?.toUpperCase() || "-"}
                      </td>
                      <td className="px-4 py-3 text-caption text-muted-foreground tabular-nums whitespace-nowrap">
                        {format(new Date(doc.created_at), "yyyy-MM-dd HH:mm")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-default">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 rounded-md hover:bg-muted transition-default"
                            title="다운로드"
                          >
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-default"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
