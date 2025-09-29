import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface ColumnSelectorProps {
  columns: string[];
  selectedColumn: string | null;
  onColumnSelect: (column: string) => void;
}

export const ColumnSelector = ({ columns, selectedColumn, onColumnSelect }: ColumnSelectorProps) => {
  return (
    <Card className="p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label htmlFor="output-column" className="text-base font-semibold text-foreground">
              Select Output Column
            </Label>
            <p className="text-sm text-muted-foreground">
              Choose the target variable for your model
            </p>
          </div>
        </div>
        
        <Select value={selectedColumn || undefined} onValueChange={onColumnSelect}>
          <SelectTrigger 
            id="output-column" 
            className="w-full transition-all"
            style={{ transition: "var(--transition-smooth)" }}
          >
            <SelectValue placeholder="Select a column..." />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedColumn && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">Selected output:</span>{" "}
              <span className="font-semibold text-accent">{selectedColumn}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
