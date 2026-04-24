import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Edit2,
  X,
} from 'lucide-react';

// Mock preview data
const previewData = [
  { name: 'John Smith', ssn: '***-**-1234', grossWages: 85000, fedWithholding: 12750, ssWages: 85000, medicareWages: 85000 },
  { name: 'Sarah Johnson', ssn: '***-**-5678', grossWages: 72000, fedWithholding: 10800, ssWages: 72000, medicareWages: 72000 },
  { name: 'Michael Davis', ssn: '***-**-9012', grossWages: 95000, fedWithholding: 14250, ssWages: 95000, medicareWages: 95000 },
  { name: 'Emily Brown', ssn: '***-**-3456', grossWages: 68000, fedWithholding: 10200, ssWages: 68000, medicareWages: 68000 },
  { name: 'Robert Wilson', ssn: '***-**-7890', grossWages: 78000, fedWithholding: 11700, ssWages: 78000, medicareWages: 78000 },
];

const requiredFields = [
  'name',
  'ssn',
  'gross_wages',
  'federal_withholding',
  'social_security_wages',
  'medicare_wages',
];

export default function PayrollUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadDate, setUploadDate] = useState<Date | null>(null);
  const [mappedFields, setMappedFields] = useState<Record<string, boolean>>({
    name: true,
    ssn: true,
    gross_wages: true,
    federal_withholding: true,
    social_security_wages: true,
    medicare_wages: true,
  });

  const handleConfirmUpload = () => {
    setIsConfirmed(true);
    setUploadDate(new Date());
    setShowPreview(false);
  };

  const handleRemoveUpload = () => {
    setUploadedFile(null);
    setIsConfirmed(false);
    setUploadDate(null);
    setShowPreview(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadedFile(file);
      setShowPreview(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowPreview(true);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Upload Payroll Data</h1>
            <p className="text-muted-foreground">Import employee payroll information for tax forms</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Required Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Required Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {requiredFields.map((field) => (
                <Badge
                  key={field}
                  variant="outline"
                  className={mappedFields[field] ? 'bg-sage/10 text-sage border-sage/30' : 'bg-destructive/10 text-destructive border-destructive/30'}
                >
                  {mappedFields[field] ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {field.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Your CSV should include columns matching these fields. We'll auto-detect common column names like
              "gross_wages", "grossWages", or "wages".
            </p>
          </CardContent>
        </Card>

        {/* Confirmed Upload Display */}
        {isConfirmed && uploadedFile && (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-between p-4 bg-sage/10 rounded-lg border border-sage/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-sage" />
                  <div>
                    <p className="font-semibold text-sage">Upload Confirmed</p>
                    <p className="text-sm text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {uploadDate?.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleRemoveUpload}>
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area */}
        {!showPreview && !isConfirmed && (
          <Card>
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging ? 'border-gold bg-gold/5' : 'border-border'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Drag & Drop your payroll CSV</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button variant="outline" asChild>
                    <span>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Select CSV File
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Mode */}
        {showPreview && (
          <>
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-sage/10 rounded-lg border border-sage/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-sage" />
                <div>
                  <p className="font-medium">{uploadedFile?.name || 'payroll_q1_2026.csv'}</p>
                  <p className="text-sm text-muted-foreground">
                    247 employees detected | All required fields mapped
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button variant="gold" onClick={handleConfirmUpload}>
                  Confirm Upload
                </Button>
              </div>
            </div>

            {/* Preview Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Preview (first 5 employees)
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit Mapping
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead className="text-right">Gross Wages</TableHead>
                        <TableHead className="text-right">Fed Withholding</TableHead>
                        <TableHead className="text-right">SS Wages</TableHead>
                        <TableHead className="text-right">Medicare Wages</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{row.ssn}</TableCell>
                          <TableCell className="text-right">${row.grossWages.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${row.fedWithholding.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${row.ssWages.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${row.medicareWages.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  ...and 242 more employees
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
