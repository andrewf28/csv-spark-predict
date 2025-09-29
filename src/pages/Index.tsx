import { useState } from "react";
import Papa from "papaparse";
import { CSVUploader } from "@/components/CSVUploader";
import { DataTable } from "@/components/DataTable";
import { ColumnSelector } from "@/components/ColumnSelector";
import { Button } from "@/components/ui/button";
import { Brain, FileSpreadsheet, X } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length > 0) {
          setHeaders(data[0]);
          setCsvData(data.slice(1).filter(row => row.some(cell => cell.trim() !== "")));
          toast.success("CSV file uploaded successfully!");
        }
      },
      error: (error) => {
        toast.error("Error parsing CSV file: " + error.message);
      },
    });
  };

  const handleReset = () => {
    setCsvData(null);
    setHeaders([]);
    setSelectedColumn(null);
    setFileName("");
    toast.info("Data cleared");
  };

  const handleRunModel = () => {
    if (!selectedColumn) {
      toast.error("Please select an output column first");
      return;
    }
    toast.info("Model training will be implemented in the backend");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ML Predictor</h1>
                <p className="text-sm text-muted-foreground">Random Forest Regression Tool</p>
              </div>
            </div>
            {csvData && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Data
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {!csvData ? (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Upload Your Dataset
                </h2>
                <p className="text-muted-foreground text-lg">
                  Drop your CSV file to get started with predictions
                </p>
              </div>
              <CSVUploader onFileUpload={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center gap-3 p-4 bg-card rounded-lg border" style={{ boxShadow: "var(--shadow-card)" }}>
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} rows × {headers.length} columns
                  </p>
                </div>
              </div>

              {/* Column Selector */}
              <ColumnSelector
                columns={headers}
                selectedColumn={selectedColumn}
                onColumnSelect={setSelectedColumn}
              />

              {/* Data Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Data Preview</h3>
                <DataTable headers={headers} data={csvData} />
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleRunModel}
                  disabled={!selectedColumn}
                  size="lg"
                  className="gap-2 text-base font-semibold px-8"
                  style={{
                    background: selectedColumn ? "var(--gradient-primary)" : undefined,
                    transition: "var(--transition-smooth)",
                  }}
                >
                  <Brain className="w-5 h-5" />
                  Run Random Forest Model
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
