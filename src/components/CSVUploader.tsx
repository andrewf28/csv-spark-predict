import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSVUploaderProps {
  onFileUpload: (file: File) => void;
}

export const CSVUploader = ({ onFileUpload }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((file) => file.name.endsWith(".csv"));
      
      if (csvFile) {
        onFileUpload(csvFile);
      }
    },
    [onFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith(".csv")) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/5"
      )}
      style={{
        boxShadow: isDragging ? "var(--shadow-hover)" : "var(--shadow-card)",
      }}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className="relative">
          <div
            className={cn(
              "p-6 rounded-full transition-all duration-300",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            {isDragging ? (
              <FileSpreadsheet className="w-12 h-12 text-primary" />
            ) : (
              <Upload className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? "Drop your CSV file here" : "Drag & drop your CSV file"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse files
          </p>
        </div>
      </div>
    </div>
  );
};
