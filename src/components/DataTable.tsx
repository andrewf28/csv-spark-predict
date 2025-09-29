import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface DataTableProps {
  headers: string[];
  data: string[][];
  maxRows?: number;
}

export const DataTable = ({ headers, data, maxRows = 10 }: DataTableProps) => {
  const displayData = data.slice(0, maxRows);
  const hasMore = data.length > maxRows;

  return (
    <Card className="overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold text-foreground">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                className="hover:bg-accent/5 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="text-foreground">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div className="px-6 py-3 text-sm text-muted-foreground bg-muted/30 border-t">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </Card>
  );
};
