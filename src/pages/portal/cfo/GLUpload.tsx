import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Folder,
  Download,
  Trash2,
  Eye,
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  Printer,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock uploaded files
const uploadedFiles = [
  { id: 1, name: 'gl_q4_2025.csv', date: '2025-12-15', rows: 1247, status: 'processed', period: 'Q4 2025' },
  { id: 2, name: 'gl_q3_2025.csv', date: '2025-09-20', rows: 1089, status: 'processed', period: 'Q3 2025' },
  { id: 3, name: 'gl_q2_2025.csv', date: '2025-06-18', rows: 956, status: 'processed', period: 'Q2 2025' },
];

// Mock preview data
const previewData = [
  { date: '2026-01-15', account: '4000 - Sales Revenue', debit: '', credit: '45,000.00', department: 'Sales' },
  { date: '2026-01-15', account: '1100 - Cash', debit: '45,000.00', credit: '', department: 'Operations' },
  { date: '2026-01-16', account: '6100 - Payroll Expense', debit: '28,500.00', credit: '', department: 'All' },
  { date: '2026-01-16', account: '2100 - Payroll Payable', debit: '', credit: '28,500.00', department: 'All' },
  { date: '2026-01-17', account: '5100 - Cost of Services', debit: '12,300.00', credit: '', department: 'Operations' },
];

const erpOptions = [
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'xero', label: 'Xero' },
  { value: 'sage', label: 'Sage' },
  { value: 'netsuite', label: 'NetSuite' },
  { value: 'sap', label: 'SAP' },
  { value: 'other', label: 'Other' },
];

export default function GLUpload() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isFromOnboarding = searchParams.get('from') === 'onboarding';
  
  const [selectedERP, setSelectedERP] = useState('quickbooks');
  const [selectedPeriod, setSelectedPeriod] = useState('q1-2026');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [coaFile, setCoaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coaInputRef = useRef<HTMLInputElement>(null);
  const statementInputRef = useRef<HTMLInputElement>(null);
  
  // Statement states
  const [statementPeriod, setStatementPeriod] = useState('q4-2025');
  const [hasGeneratedStatements, setHasGeneratedStatements] = useState(false);
  const [previewStatement, setPreviewStatement] = useState<'income' | 'balance' | 'cashflow' | null>(null);
  const [uploadedStatements, setUploadedStatements] = useState<Array<{
    id: number;
    name: string;
    type: string;
    period: string;
    date: string;
  }>>([]);

  const handleStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newStatement = {
        id: Date.now(),
        name: file.name,
        type: file.name.toLowerCase().includes('income') ? 'Income Statement' :
              file.name.toLowerCase().includes('balance') ? 'Balance Sheet' :
              file.name.toLowerCase().includes('cash') ? 'Cash Flow' : 'Financial Statement',
        period: statementPeriod.toUpperCase(),
        date: new Date().toISOString().split('T')[0],
      };
      setUploadedStatements(prev => [...prev, newStatement]);
      toast.success(`Uploaded: ${file.name}`);
    }
  };

  const handleCoaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setCoaFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setUploadedFile(file);
      setShowPreview(true);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setUploadedFile(file);
      setShowPreview(true);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Back to Onboarding Button */}
        {isFromOnboarding && (
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding?return_from=gl')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Onboarding
          </Button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">GL Data Upload</h1>
            <p className="text-muted-foreground">Import your general ledger data for AI analysis</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload GL Data</TabsTrigger>
            <TabsTrigger value="coa">Chart of Accounts</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="library">My Library</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* ERP Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ERP System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {erpOptions.map((erp) => (
                    <Button
                      key={erp.value}
                      variant={selectedERP === erp.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedERP(erp.value)}
                      className={selectedERP === erp.value ? 'bg-gold hover:bg-gold-dark text-primary' : ''}
                    >
                      {selectedERP === erp.value && <CheckCircle className="h-4 w-4 mr-1" />}
                      {erp.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Upload File</CardTitle>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="q1-2026">Q1 2026</SelectItem>
                      <SelectItem value="q4-2025">Q4 2025</SelectItem>
                      <SelectItem value="q3-2025">Q3 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? 'border-gold bg-gold/5' : 'border-border'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Drag & Drop your GL file</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports CSV and Excel files
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx"
                    className="hidden"
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                </div>

                {showPreview && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sage/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-sage" />
                        <div>
                          <p className="font-medium">{uploadedFile?.name || 'sample_gl.csv'}</p>
                          <p className="text-sm text-muted-foreground">Parsed: 1,247 rows | date, account, debit, credit, department detected</p>
                        </div>
                      </div>
                      <Button variant="gold">
                        Upload & Process GL Data
                      </Button>
                    </div>

                    {/* Preview Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted px-4 py-2 border-b">
                        <span className="text-sm font-medium">Preview (first 5 rows)</span>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead>Department</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.date}</TableCell>
                              <TableCell>{row.account}</TableCell>
                              <TableCell className="text-right">{row.debit}</TableCell>
                              <TableCell className="text-right">{row.credit}</TableCell>
                              <TableCell>{row.department}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart of Accounts</CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                {coaFile ? (
                  <div className="flex items-center justify-between p-4 bg-sage/10 rounded-lg border border-sage/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-sage" />
                      <div>
                        <p className="font-semibold text-sage">COA Uploaded Successfully</p>
                        <p className="text-sm text-muted-foreground">{coaFile.name}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCoaFile(null)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No Chart of Accounts uploaded</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your COA to enable account categorization and mapping
                    </p>
                    <input
                      type="file"
                      ref={coaInputRef}
                      onChange={handleCoaSelect}
                      accept=".csv,.xlsx"
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => coaInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload COA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            {/* Statement Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="gold" onClick={() => {
                  toast.success('Generating statements from GL data...');
                  setHasGeneratedStatements(true);
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate from GL Data
                </Button>
                <input
                  type="file"
                  ref={statementInputRef}
                  onChange={handleStatementUpload}
                  accept=".csv,.xlsx,.pdf"
                  className="hidden"
                />
                <Button variant="outline" onClick={() => statementInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Statement
                </Button>
              </div>
              <Select value={statementPeriod} onValueChange={setStatementPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                  <SelectItem value="q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="fy-2025">FY 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Income Statement */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPreviewStatement('income')}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <TrendingUp className="h-5 w-5 text-gold" />
                    </div>
                    {hasGeneratedStatements && <Badge className="bg-sage/10 text-sage border-sage/30">Ready</Badge>}
                  </div>
                  <CardTitle className="text-lg">Income Statement</CardTitle>
                  <CardDescription>Profit & Loss for {statementPeriod.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasGeneratedStatements ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">$485,200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Net Income</span>
                        <span className="font-medium text-sage">$72,340</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Generate or upload to view</p>
                  )}
                </CardContent>
              </Card>

              {/* Balance Sheet */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPreviewStatement('balance')}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-sage/10">
                      <DollarSign className="h-5 w-5 text-sage" />
                    </div>
                    {hasGeneratedStatements && <Badge className="bg-sage/10 text-sage border-sage/30">Ready</Badge>}
                  </div>
                  <CardTitle className="text-lg">Balance Sheet</CardTitle>
                  <CardDescription>Assets & Liabilities as of {statementPeriod.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasGeneratedStatements ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Assets</span>
                        <span className="font-medium">$1,245,800</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Equity</span>
                        <span className="font-medium text-sage">$892,450</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Generate or upload to view</p>
                  )}
                </CardContent>
              </Card>

              {/* Cash Flow */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPreviewStatement('cashflow')}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    {hasGeneratedStatements && <Badge className="bg-sage/10 text-sage border-sage/30">Ready</Badge>}
                  </div>
                  <CardTitle className="text-lg">Cash Flow Statement</CardTitle>
                  <CardDescription>Cash movements for {statementPeriod.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasGeneratedStatements ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Operating Cash</span>
                        <span className="font-medium">$98,200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Net Change</span>
                        <span className="font-medium text-sage">+$45,320</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Generate or upload to view</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Uploaded Statements */}
            {uploadedStatements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Statements</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedStatements.map((stmt) => (
                        <TableRow key={stmt.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {stmt.name}
                            </div>
                          </TableCell>
                          <TableCell>{stmt.type}</TableCell>
                          <TableCell>{stmt.period}</TableCell>
                          <TableCell>{stmt.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => toast.info('Opening preview...')}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toast.success('Downloading...')}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                                setUploadedStatements(prev => prev.filter(s => s.id !== stmt.id));
                                toast.success('Statement removed');
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Statement Preview Dialog */}
            <Dialog open={previewStatement !== null} onOpenChange={() => setPreviewStatement(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {previewStatement === 'income' && 'Income Statement'}
                    {previewStatement === 'balance' && 'Balance Sheet'}
                    {previewStatement === 'cashflow' && 'Cash Flow Statement'}
                    {' - '}{statementPeriod.toUpperCase()}
                  </DialogTitle>
                </DialogHeader>
                
                {hasGeneratedStatements ? (
                  <div className="space-y-4">
                    {/* Income Statement Preview */}
                    {previewStatement === 'income' && (
                      <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-center font-bold text-lg mb-1">TAUBRIDGE FINANCIAL</h3>
                        <h4 className="text-center font-semibold mb-4">Income Statement</h4>
                        <p className="text-center text-sm text-muted-foreground mb-6">For the Period Ending December 31, 2025</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Revenue</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Service Revenue</span><span>$425,000.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Consulting Revenue</span><span>$48,200.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Other Income</span><span>$12,000.00</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Total Revenue</span><span>$485,200.00</span></div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Cost of Services</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Direct Labor</span><span>$185,400.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Subcontractors</span><span>$42,800.00</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Total Cost of Services</span><span>$228,200.00</span></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between font-bold text-lg border-t-2 pt-2">
                            <span>Gross Profit</span><span className="text-sage">$257,000.00</span>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Operating Expenses</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Salaries & Wages</span><span>$98,500.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Rent & Utilities</span><span>$24,000.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Marketing</span><span>$18,600.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Insurance</span><span>$12,400.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Professional Services</span><span>$15,200.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Depreciation</span><span>$8,960.00</span></div>
                              <div className="flex justify-between"><span className="pl-4">Other Expenses</span><span>$7,000.00</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Total Operating Expenses</span><span>$184,660.00</span></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between font-bold text-xl border-t-2 pt-2">
                            <span>Net Income</span><span className="text-sage">$72,340.00</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Balance Sheet Preview */}
                    {previewStatement === 'balance' && (
                      <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-center font-bold text-lg mb-1">TAUBRIDGE FINANCIAL</h3>
                        <h4 className="text-center font-semibold mb-4">Balance Sheet</h4>
                        <p className="text-center text-sm text-muted-foreground mb-6">As of December 31, 2025</p>
                        
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold border-b pb-1 mb-2">ASSETS</h5>
                              <div>
                                <h6 className="font-semibold text-sm mb-1">Current Assets</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span className="pl-4">Cash & Equivalents</span><span>$285,400</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Accounts Receivable</span><span>$142,800</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Prepaid Expenses</span><span>$18,600</span></div>
                                  <div className="flex justify-between font-medium border-t pt-1"><span>Total Current</span><span>$446,800</span></div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h6 className="font-semibold text-sm mb-1">Fixed Assets</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span className="pl-4">Property & Equipment</span><span>$856,000</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Less: Accum. Depreciation</span><span>($57,000)</span></div>
                                  <div className="flex justify-between font-medium border-t pt-1"><span>Total Fixed</span><span>$799,000</span></div>
                                </div>
                              </div>
                              <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-4">
                                <span>TOTAL ASSETS</span><span>$1,245,800</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold border-b pb-1 mb-2">LIABILITIES & EQUITY</h5>
                              <div>
                                <h6 className="font-semibold text-sm mb-1">Current Liabilities</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span className="pl-4">Accounts Payable</span><span>$68,350</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Accrued Expenses</span><span>$35,000</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Payroll Liabilities</span><span>$28,500</span></div>
                                  <div className="flex justify-between font-medium border-t pt-1"><span>Total Current</span><span>$131,850</span></div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h6 className="font-semibold text-sm mb-1">Long-term Liabilities</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span className="pl-4">Notes Payable</span><span>$221,500</span></div>
                                  <div className="flex justify-between font-medium border-t pt-1"><span>Total Long-term</span><span>$221,500</span></div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <h6 className="font-semibold text-sm mb-1">Equity</h6>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between"><span className="pl-4">Common Stock</span><span>$500,000</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Retained Earnings</span><span>$320,110</span></div>
                                  <div className="flex justify-between"><span className="pl-4">Current Year Earnings</span><span>$72,340</span></div>
                                  <div className="flex justify-between font-medium border-t pt-1"><span>Total Equity</span><span>$892,450</span></div>
                                </div>
                              </div>
                              <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-4">
                                <span>TOTAL LIAB. & EQUITY</span><span>$1,245,800</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Cash Flow Preview */}
                    {previewStatement === 'cashflow' && (
                      <div className="border rounded-lg p-6 bg-white">
                        <h3 className="text-center font-bold text-lg mb-1">TAUBRIDGE FINANCIAL</h3>
                        <h4 className="text-center font-semibold mb-4">Statement of Cash Flows</h4>
                        <p className="text-center text-sm text-muted-foreground mb-6">For the Period Ending December 31, 2025</p>
                        
                        <div className="space-y-6">
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Cash Flows from Operating Activities</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Net Income</span><span>$72,340</span></div>
                              <div className="flex justify-between"><span className="pl-4">Depreciation & Amortization</span><span>$8,960</span></div>
                              <div className="flex justify-between"><span className="pl-4">Increase in Accounts Receivable</span><span>($18,400)</span></div>
                              <div className="flex justify-between"><span className="pl-4">Increase in Accounts Payable</span><span>$12,300</span></div>
                              <div className="flex justify-between"><span className="pl-4">Increase in Accrued Expenses</span><span>$8,000</span></div>
                              <div className="flex justify-between"><span className="pl-4">Other Operating Activities</span><span>$15,000</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Net Cash from Operations</span><span className="text-sage">$98,200</span></div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Cash Flows from Investing Activities</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Purchase of Equipment</span><span>($28,500)</span></div>
                              <div className="flex justify-between"><span className="pl-4">Proceeds from Asset Sales</span><span>$5,200</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Net Cash from Investing</span><span>($23,300)</span></div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold border-b pb-1 mb-2">Cash Flows from Financing Activities</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="pl-4">Loan Payments</span><span>($24,580)</span></div>
                              <div className="flex justify-between"><span className="pl-4">Dividend Payments</span><span>($5,000)</span></div>
                              <div className="flex justify-between font-semibold border-t pt-1"><span>Net Cash from Financing</span><span>($29,580)</span></div>
                            </div>
                          </div>
                          
                          <div className="border-t-2 pt-4 space-y-2">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Net Change in Cash</span><span className="text-sage">$45,320</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Beginning Cash Balance</span><span>$240,080</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-1">
                              <span>Ending Cash Balance</span><span>$285,400</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => {
                        window.print();
                        toast.success('Printing...');
                      }}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="gold" onClick={() => toast.success('Downloading PDF...')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No data available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate statements from GL data or upload a statement file first.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{file.period}</TableCell>
                        <TableCell>{file.date}</TableCell>
                        <TableCell>{file.rows.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Processed
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
