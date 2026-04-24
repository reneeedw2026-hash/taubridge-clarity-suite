import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Bell,
} from 'lucide-react';
import { format, addDays, differenceInDays, isPast, isFuture } from 'date-fns';

// Compliance score breakdown
const complianceMetrics = {
  overallScore: 94,
  categories: [
    { name: 'Filing Timeliness', score: 100, status: 'excellent', description: 'All filings submitted on time' },
    { name: 'Deposit Compliance', score: 92, status: 'good', description: '1 deposit made 2 days late in Q4' },
    { name: 'Form Accuracy', score: 95, status: 'excellent', description: 'Minor corrections on 2 W-2s' },
    { name: 'Record Keeping', score: 88, status: 'good', description: 'Missing I-9 for 3 employees' },
  ],
};

// Filing status tracking
const filingStatus = [
  { 
    form: 'Form 941', 
    period: 'Q1 2026', 
    dueDate: new Date(2026, 3, 30), 
    status: 'pending',
    estimatedAmount: 132770,
    description: 'Quarterly Federal Tax Return'
  },
  { 
    form: 'Form 941', 
    period: 'Q4 2025', 
    dueDate: new Date(2026, 0, 31), 
    status: 'filed',
    filedDate: new Date(2026, 0, 28),
    amount: 145230,
    description: 'Quarterly Federal Tax Return'
  },
  { 
    form: 'Form 940', 
    period: '2025', 
    dueDate: new Date(2026, 0, 31), 
    status: 'filed',
    filedDate: new Date(2026, 0, 29),
    amount: 6420,
    description: 'Annual FUTA Tax Return'
  },
  { 
    form: 'W-2/W-3', 
    period: '2025', 
    dueDate: new Date(2026, 0, 31), 
    status: 'filed',
    filedDate: new Date(2026, 0, 25),
    employeeCount: 247,
    description: 'Wage and Tax Statements'
  },
  { 
    form: '1099-NEC', 
    period: '2025', 
    dueDate: new Date(2026, 0, 31), 
    status: 'filed',
    filedDate: new Date(2026, 0, 27),
    contractorCount: 12,
    description: 'Nonemployee Compensation'
  },
];

// Deposit history
const depositHistory = [
  { date: new Date(2026, 0, 15), amount: 42500, dueDate: new Date(2026, 0, 15), status: 'on-time', period: 'Dec 2025' },
  { date: new Date(2025, 11, 15), amount: 44200, dueDate: new Date(2025, 11, 15), status: 'on-time', period: 'Nov 2025' },
  { date: new Date(2025, 10, 17), amount: 41800, dueDate: new Date(2025, 10, 15), status: 'late', daysLate: 2, period: 'Oct 2025' },
  { date: new Date(2025, 9, 15), amount: 43100, dueDate: new Date(2025, 9, 15), status: 'on-time', period: 'Sep 2025' },
  { date: new Date(2025, 8, 15), amount: 42900, dueDate: new Date(2025, 8, 15), status: 'on-time', period: 'Aug 2025' },
];

// Compliance alerts
const complianceAlerts = [
  { 
    severity: 'warning', 
    title: 'Q1 941 Due in 45 Days', 
    description: 'Form 941 for Q1 2026 is due April 30, 2026. Estimated liability: $132,770',
    action: 'Review Form',
    href: '/payroll/forms'
  },
  { 
    severity: 'info', 
    title: 'I-9 Audit Recommended', 
    description: '3 employees are missing I-9 verification. Complete within 3 business days of hire.',
    action: 'View Employees',
    href: '/payroll/employees'
  },
  { 
    severity: 'success', 
    title: 'All 2025 Forms Filed', 
    description: 'W-2s, 1099s, 940, and Q4 941 have been successfully filed with the IRS.',
    action: 'View Archive',
    href: '/payroll/settings'
  },
];

// Penalty risk assessment
const penaltyRisks = [
  { 
    violation: 'Late Tax Deposit', 
    penalty: '2-15%',
    description: 'Penalty based on days late: 2% (1-5 days), 5% (6-15 days), 10% (16+ days), 15% (10+ days after IRS notice)',
    status: 'low',
    lastIncident: 'Oct 2025 (2 days late)'
  },
  { 
    violation: 'Failure to File', 
    penalty: '5% per month',
    description: 'Up to 25% of unpaid tax for each month return is late',
    status: 'none',
    lastIncident: 'Never'
  },
  { 
    violation: 'Incorrect W-2/1099', 
    penalty: '$60-$310/form',
    description: 'Penalty varies based on correction timing. Higher for intentional disregard.',
    status: 'low',
    lastIncident: '2 W-2 corrections in 2025'
  },
  { 
    violation: 'Worker Misclassification', 
    penalty: '1.5-40%',
    description: 'SS/Medicare taxes plus penalties. Criminal penalties possible for willful violations.',
    status: 'none',
    lastIncident: 'Never'
  },
];

// Upcoming deadlines
const upcomingDeadlines = [
  { name: 'Q1 2026 Form 941', date: new Date(2026, 3, 30), type: 'filing' },
  { name: 'Q1 Tax Deposit (Feb)', date: new Date(2026, 1, 15), type: 'deposit' },
  { name: 'Q1 Tax Deposit (Mar)', date: new Date(2026, 2, 15), type: 'deposit' },
  { name: 'Q1 Tax Deposit (Apr)', date: new Date(2026, 3, 15), type: 'deposit' },
  { name: 'Q2 2026 Form 941', date: new Date(2026, 6, 31), type: 'filing' },
];

export default function TaxCompliance() {
  const [lastScanDate] = useState(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'filed':
        return <Badge className="bg-sage text-white"><CheckCircle className="h-3 w-3 mr-1" />Filed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-sage';
    if (score >= 85) return 'text-gold';
    if (score >= 70) return 'text-orange-500';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 95) return 'bg-sage';
    if (score >= 85) return 'bg-gold';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-destructive';
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-gold" />
              Tax Compliance Monitor
            </h1>
            <p className="text-muted-foreground">Track filings, deposits, and compliance health</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Last scan: {format(lastScanDate, 'MMM d, yyyy h:mm a')}
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Compliance Score Card */}
        <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className={`text-5xl font-bold ${getScoreColor(complianceMetrics.overallScore)}`}>
                    {complianceMetrics.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Compliance Score</div>
                </div>
                <div className="h-20 w-px bg-border" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {complianceMetrics.categories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getScoreBg(cat.score)}`} />
                      <span className="text-sm">{cat.name}: <span className="font-semibold">{cat.score}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-sage text-white mb-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Good Standing
                </Badge>
                <p className="text-sm text-muted-foreground">No critical issues detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {complianceAlerts.length > 0 && (
          <div className="space-y-2">
            {complianceAlerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  alert.severity === 'warning'
                    ? 'bg-gold/10 border-gold/30'
                    : alert.severity === 'info'
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-sage/10 border-sage/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-gold" />
                  ) : alert.severity === 'info' ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-sage" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={alert.href}>
                    {alert.action}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        <Tabs defaultValue="filings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="filings">Filing Status</TabsTrigger>
            <TabsTrigger value="deposits">Deposit History</TabsTrigger>
            <TabsTrigger value="penalties">Penalty Risk</TabsTrigger>
            <TabsTrigger value="calendar">Deadlines</TabsTrigger>
          </TabsList>

          {/* Filing Status Tab */}
          <TabsContent value="filings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Filing Status Tracker
                </CardTitle>
                <CardDescription>Monitor all federal tax filings and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Form</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filingStatus.map((filing, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{filing.form}</div>
                              <div className="text-xs text-muted-foreground">{filing.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{filing.period}</TableCell>
                          <TableCell>{format(filing.dueDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell>{getStatusBadge(filing.status)}</TableCell>
                          <TableCell>
                            {filing.status === 'filed' && 'filedDate' in filing && (
                              <span className="text-sm">Filed {format(filing.filedDate as Date, 'MMM d, yyyy')}</span>
                            )}
                            {filing.status === 'pending' && 'estimatedAmount' in filing && (
                              <span className="text-sm text-gold font-medium">Est. ${(filing.estimatedAmount as number).toLocaleString()}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/payroll/forms">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposit History Tab */}
          <TabsContent value="deposits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gold" />
                  Tax Deposit History
                </CardTitle>
                <CardDescription>Track federal tax deposits and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-sage/10 border border-sage/20">
                    <div className="text-sm text-muted-foreground">On-Time Deposits</div>
                    <div className="text-2xl font-bold text-sage">
                      {depositHistory.filter(d => d.status === 'on-time').length} / {depositHistory.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 5 deposits</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                    <div className="text-sm text-muted-foreground">Late Deposits</div>
                    <div className="text-2xl font-bold text-gold">
                      {depositHistory.filter(d => d.status === 'late').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Potential penalty exposure</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground">Total Deposited</div>
                    <div className="text-2xl font-bold">
                      ${depositHistory.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Last 5 months</div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Deposit Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depositHistory.map((deposit, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{deposit.period}</TableCell>
                          <TableCell>{format(deposit.dueDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(deposit.date, 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right font-medium">${deposit.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {deposit.status === 'on-time' ? (
                              <Badge className="bg-sage/10 text-sage border-sage/30" variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                On Time
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {deposit.daysLate} days late
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penalty Risk Tab */}
          <TabsContent value="penalties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-gold" />
                  Penalty Risk Assessment
                </CardTitle>
                <CardDescription>Understand potential penalties and your risk exposure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {penaltyRisks.map((risk, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{risk.violation}</h4>
                          {risk.status === 'none' ? (
                            <Badge className="bg-sage/10 text-sage border-sage/30" variant="outline">No Risk</Badge>
                          ) : risk.status === 'low' ? (
                            <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">Low Risk</Badge>
                          ) : (
                            <Badge variant="destructive">High Risk</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-destructive">{risk.penalty}</div>
                        <div className="text-xs text-muted-foreground">Penalty Range</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                      Last Incident: {risk.lastIncident}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Never miss a filing or deposit deadline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => {
                    const daysUntil = differenceInDays(deadline.date, new Date());
                    const isUrgent = daysUntil <= 14;
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isUrgent ? 'bg-gold/5 border-gold/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${deadline.type === 'filing' ? 'bg-primary/10' : 'bg-sage/10'}`}>
                            {deadline.type === 'filing' ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : (
                              <DollarSign className="h-5 w-5 text-sage" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{deadline.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(deadline.date, 'EEEE, MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={isUrgent ? 'default' : 'outline'} className={isUrgent ? 'bg-gold text-white' : ''}>
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
