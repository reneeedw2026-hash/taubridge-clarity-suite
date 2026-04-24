import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  FileText,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

// Mock employee data with SS wages issues
const employeeData = [
  { id: 'E001', name: 'John Martinez', ssn: '***-**-1234', ytdWages: 58500, ssWages: 58500, fedWithholding: 8775, ssWithholding: 3627, medicareWithholding: 848, status: 'valid' },
  { id: 'E002', name: 'Sarah Johnson', ssn: '***-**-5678', ytdWages: 72000, ssWages: 72000, fedWithholding: 10800, ssWithholding: 4464, medicareWithholding: 1044, status: 'valid' },
  { id: 'E003', name: 'Michael Chen', ssn: '***-**-9012', ytdWages: 45000, ssWages: 0, fedWithholding: 6750, ssWithholding: 0, medicareWithholding: 653, status: 'missing-ss', issue: 'Social Security wages not reported - Box 3 is empty' },
  { id: 'E004', name: 'Emily Rodriguez', ssn: '***-**-3456', ytdWages: 63500, ssWages: 63500, fedWithholding: 9525, ssWithholding: 3937, medicareWithholding: 921, status: 'valid' },
  { id: 'E005', name: 'David Thompson', ssn: '***-**-7890', ytdWages: 55000, ssWages: 55000, fedWithholding: 8250, ssWithholding: 3410, medicareWithholding: 798, status: 'valid' },
  { id: 'E006', name: 'Jennifer Williams', ssn: '***-**-2345', ytdWages: 48750, ssWages: 0, fedWithholding: 7313, ssWithholding: 0, medicareWithholding: 707, status: 'missing-ss', issue: 'Social Security wages not reported - Box 3 is empty' },
  { id: 'E007', name: 'Robert Brown', ssn: '***-**-6789', ytdWages: 82000, ssWages: 82000, fedWithholding: 12300, ssWithholding: 5084, medicareWithholding: 1189, status: 'valid' },
  { id: 'E008', name: 'Amanda Davis', ssn: '***-**-0123', ytdWages: 67500, ssWages: 67500, fedWithholding: 10125, ssWithholding: 4185, medicareWithholding: 979, status: 'valid' },
  { id: 'E009', name: 'Christopher Lee', ssn: '***-**-4567', ytdWages: 51250, ssWages: 51250, fedWithholding: 7688, ssWithholding: 3178, medicareWithholding: 743, status: 'valid' },
  { id: 'E010', name: 'Jessica Miller', ssn: '***-**-8901', ytdWages: 59000, ssWages: 59000, fedWithholding: 8850, ssWithholding: 3658, medicareWithholding: 856, status: 'valid' },
];

const issueEmployees = employeeData.filter(e => e.status === 'missing-ss');
const validEmployees = employeeData.filter(e => e.status === 'valid');

export default function PayrollEmployees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('issues');

  const filteredEmployees = (activeTab === 'issues' ? issueEmployees : employeeData).filter(
    emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-gold" />
              Employee Payroll Reconciliation
            </h1>
            <p className="text-muted-foreground">Review and resolve payroll data discrepancies</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{employeeData.length}</div>
                  <div className="text-xs text-muted-foreground">Total Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sage/10">
                  <CheckCircle className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-sage">{validEmployees.length}</div>
                  <div className="text-xs text-muted-foreground">Valid Records</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{issueEmployees.length}</div>
                  <div className="text-xs text-muted-foreground">Missing SS Wages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${(issueEmployees.reduce((sum, e) => sum + e.ytdWages, 0) * 0.062).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Missing SS Tax</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for Issues */}
        {issueEmployees.length > 0 && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive">
                  {issueEmployees.length} Employees Missing Social Security Wages Data
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The following employees have wages reported (Box 1) but no Social Security wages (Box 3). 
                  This will cause discrepancies on Form 941 and W-2 filing. Please update the payroll data or verify exemption status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Employee Table with Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Employee Wage Reconciliation</CardTitle>
                <CardDescription>Review employee payroll data and resolve issues</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="issues" className="relative">
                  Issues to Review
                  {issueEmployees.length > 0 && (
                    <Badge className="ml-2 bg-destructive text-destructive-foreground">
                      {issueEmployees.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">All Employees</TabsTrigger>
              </TabsList>

              <TabsContent value="issues" className="mt-0">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-sage" />
                    <p className="font-medium">All issues resolved!</p>
                    <p className="text-sm">No employees with missing data.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-destructive/5">
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>SSN</TableHead>
                          <TableHead className="text-right">YTD Wages (Box 1)</TableHead>
                          <TableHead className="text-right">SS Wages (Box 3)</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((emp) => (
                          <TableRow key={emp.id} className="bg-destructive/5">
                            <TableCell className="font-mono text-sm">{emp.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                <span className="font-medium">{emp.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{emp.ssn}</TableCell>
                            <TableCell className="text-right font-medium">
                              ${emp.ytdWages.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-destructive font-bold">
                                ${emp.ssWages.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                                {emp.issue}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Fix
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Resolution Summary */}
                {issueEmployees.length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                    <h4 className="font-medium mb-2">Impact Analysis</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Missing SS Wages Total:</span>
                        <span className="font-bold ml-2">
                          ${issueEmployees.reduce((sum, e) => sum + e.ytdWages, 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Missing SS Tax (6.2%):</span>
                        <span className="font-bold text-destructive ml-2">
                          ${(issueEmployees.reduce((sum, e) => sum + e.ytdWages, 0) * 0.062).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Missing Employer Match:</span>
                        <span className="font-bold text-destructive ml-2">
                          ${(issueEmployees.reduce((sum, e) => sum + e.ytdWages, 0) * 0.062).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead className="text-right">YTD Wages</TableHead>
                        <TableHead className="text-right">SS Wages</TableHead>
                        <TableHead className="text-right">Fed W/H</TableHead>
                        <TableHead className="text-right">SS W/H</TableHead>
                        <TableHead className="text-right">Medicare</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(searchTerm ? employeeData.filter(
                        emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               emp.id.toLowerCase().includes(searchTerm.toLowerCase())
                      ) : employeeData).map((emp) => (
                        <TableRow key={emp.id} className={emp.status === 'missing-ss' ? 'bg-destructive/5' : ''}>
                          <TableCell className="font-mono text-sm">{emp.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {emp.status === 'missing-ss' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                              <span className="font-medium">{emp.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{emp.ssn}</TableCell>
                          <TableCell className="text-right">${emp.ytdWages.toLocaleString()}</TableCell>
                          <TableCell className={`text-right ${emp.status === 'missing-ss' ? 'text-destructive font-bold' : ''}`}>
                            ${emp.ssWages.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">${emp.fedWithholding.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.ssWithholding.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.medicareWithholding.toLocaleString()}</TableCell>
                          <TableCell>
                            {emp.status === 'valid' ? (
                              <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Issue
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* How to Fix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              How to Resolve Missing SS Wages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Option 1: Update Payroll Data</h4>
                <p className="text-sm text-muted-foreground">
                  Re-upload the payroll spreadsheet with corrected Box 3 (Social Security wages) data. 
                  Ensure that SS wages match total wages for employees not exempt from SS tax.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Option 2: Verify Exemption Status</h4>
                <p className="text-sm text-muted-foreground">
                  If employees are legitimately exempt from Social Security (e.g., certain visa holders, 
                  religious exemptions), document the exemption and mark their records accordingly.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Option 3: Contact Payroll Provider</h4>
                <p className="text-sm text-muted-foreground">
                  If using a third-party payroll provider, contact them to investigate why SS wages 
                  were not calculated for these employees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
