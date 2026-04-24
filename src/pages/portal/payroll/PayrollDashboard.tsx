import { useMemo } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Upload,
  Settings,
  Calculator,
  FileSpreadsheet,
  CalendarClock,
  Building2,
} from 'lucide-react';
import { addDays, addWeeks, nextWednesday, nextFriday, format, isAfter, isBefore, getDay, addMonths, setDate } from 'date-fns';

type DepositSchedule = 'monthly' | 'semi-weekly';

// Demo payroll data
const demoPayrollData = {
  lookbackPeriodLiability: 42000, // Under $50,000 = monthly depositor
  quarterlyTaxLiability: 132770,
  payFrequency: 'biweekly' as 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly',
  firstPayDate: new Date(2026, 0, 9), // January 9, 2026
  employees: 247,
  quarterlyWages: 1470000,
};

// Mock data
const stats = [
  { label: 'Total Employees', value: '247', icon: Users, change: '+12 this quarter' },
  { label: 'Q1 Payroll', value: '$1.47M', icon: DollarSign, change: '+8% YoY' },
  { label: 'Total Tax Liability', value: '$132k', icon: Calculator, change: 'Due Apr 30' },
  { label: 'Forms Pending', value: '2', icon: FileText, change: '941, W-3' },
];

const upcomingDeadlines = [
  { form: 'Q1 Form 941', dueDate: 'Apr 30, 2026', status: 'pending', urgent: true },
  { form: 'W-2 Distribution', dueDate: 'Jan 31, 2026', status: 'completed', urgent: false },
  { form: 'W-3 Transmittal', dueDate: 'Jan 31, 2026', status: 'completed', urgent: false },
  { form: 'Form 940', dueDate: 'Jan 31, 2026', status: 'completed', urgent: false },
];

import { Shield } from 'lucide-react';

const quickLinks = [
  { label: 'Upload Payroll Data', href: '/payroll/upload', icon: Upload },
  { label: 'Employee List', href: '/payroll/employees', icon: Users },
  { label: 'Tax Forms', href: '/payroll/forms', icon: FileText },
  { label: 'Tax Compliance', href: '/payroll/compliance', icon: Shield },
  { label: 'Payroll Settings', href: '/payroll/settings', icon: Settings },
];

const alerts = [
  { type: 'warning', message: '2 employees missing SS wages data', action: 'Review', href: '/payroll/employees' },
  { type: 'info', message: 'Q1 941 ready for review', action: 'View Form', href: '/payroll/forms' },
];

export default function PayrollDashboard() {
  // Determine deposit schedule based on lookback period liability
  const depositSchedule: DepositSchedule = useMemo(() => {
    return demoPayrollData.lookbackPeriodLiability > 50000 ? 'semi-weekly' : 'monthly';
  }, []);

  // Calculate tax deposit schedule based on pay frequency and IRS rules
  const taxDepositSchedule = useMemo(() => {
    const schedule: Array<{
      payDate: Date;
      depositDueDate: Date;
      estimatedTax: number;
      rule: string;
    }> = [];

    let currentPayDate = demoPayrollData.firstPayDate;
    const payPeriodsPerYear = demoPayrollData.payFrequency === 'weekly' ? 52 :
      demoPayrollData.payFrequency === 'biweekly' ? 26 :
      demoPayrollData.payFrequency === 'semi-monthly' ? 24 : 12;
    
    const taxPerPayPeriod = demoPayrollData.quarterlyTaxLiability / (payPeriodsPerYear / 4);

    // Generate next 3 pay periods
    for (let i = 0; i < 3; i++) {
      let depositDueDate: Date;
      let rule: string;

      if (depositSchedule === 'monthly') {
        // Monthly depositors: Due by the 15th of the following month
        const nextMonth = addMonths(currentPayDate, 1);
        depositDueDate = setDate(nextMonth, 15);
        rule = 'Due 15th of following month';
      } else {
        // Semi-weekly depositors based on IRS rules
        const dayOfWeek = getDay(currentPayDate);
        
        if (dayOfWeek >= 3 && dayOfWeek <= 5) {
          // Wed, Thu, Fri paydays: Deposit due following Wednesday
          depositDueDate = nextWednesday(currentPayDate);
          rule = 'Due following Wednesday';
        } else {
          // Sat, Sun, Mon, Tue paydays: Deposit due following Friday
          depositDueDate = nextFriday(currentPayDate);
          rule = 'Due following Friday';
        }
      }

      schedule.push({
        payDate: currentPayDate,
        depositDueDate,
        estimatedTax: Math.round(taxPerPayPeriod),
        rule,
      });

      // Advance to next pay date
      switch (demoPayrollData.payFrequency) {
        case 'weekly':
          currentPayDate = addWeeks(currentPayDate, 1);
          break;
        case 'biweekly':
          currentPayDate = addWeeks(currentPayDate, 2);
          break;
        case 'semi-monthly':
          currentPayDate = addDays(currentPayDate, 15);
          break;
        case 'monthly':
          currentPayDate = addMonths(currentPayDate, 1);
          break;
      }
    }

    return schedule;
  }, [depositSchedule]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PayrollTax Pro</h1>
            <p className="text-muted-foreground">Payroll compliance and tax management</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-gold" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-sage mt-1">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  alert.type === 'warning'
                    ? 'bg-gold/10 border border-gold/30'
                    : 'bg-primary/5 border border-primary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-gold" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium">{alert.message}</span>
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

        {/* IRS Tax Deposit Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-gold" />
              IRS Tax Deposit Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Depositor Status */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">Your Depositor Status</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={depositSchedule === 'monthly' 
                    ? 'bg-sage/10 text-sage border-sage/30' 
                    : 'bg-gold/10 text-gold border-gold/30'}
                >
                  {depositSchedule === 'monthly' ? 'Monthly Depositor' : 'Semi-Weekly Depositor'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on lookback period liability of ${demoPayrollData.lookbackPeriodLiability.toLocaleString()}
                  {depositSchedule === 'monthly' ? ' (under $50,000)' : ' (over $50,000)'}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Deposit Rule (IRS Circular E)</span>
                </div>
                {depositSchedule === 'monthly' ? (
                  <p className="text-sm">
                    Deposit taxes by the <span className="font-bold text-primary">15th of the following month</span>
                  </p>
                ) : (
                  <div className="text-sm space-y-1">
                    <p>• Wed-Fri paydays: Deposit by <span className="font-semibold">following Wednesday</span></p>
                    <p>• Sat-Tue paydays: Deposit by <span className="font-semibold">following Friday</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Deposit Deadlines */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                Upcoming Deposit Deadlines
              </h4>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Pay Date</TableHead>
                      <TableHead>Deposit Due Date</TableHead>
                      <TableHead>Estimated Tax</TableHead>
                      <TableHead>IRS Rule</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxDepositSchedule.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(item.payDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">
                            {format(item.depositDueDate, 'MMM d, yyyy')}
                          </span>
                        </TableCell>
                        <TableCell>${item.estimatedTax.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.rule}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Penalty Warning */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Late Deposit Penalties</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Penalties range from 2% (1-5 days late) to 15% (10+ days late). 
                    Set up EFTPS for timely deposits.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Filing Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className={`h-4 w-4 ${deadline.urgent ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium text-sm">{deadline.form}</p>
                        <p className="text-xs text-muted-foreground">Due: {deadline.dueDate}</p>
                      </div>
                    </div>
                    {deadline.status === 'completed' ? (
                      <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Filed
                      </Badge>
                    ) : deadline.urgent ? (
                      <Button variant="gold" size="sm" asChild>
                        <a 
                          href="https://sa.www4.irs.gov/sso/?resumePath=%2Fas%2FJhfABC9e2q%2Fresume%2Fas%2Fauthorization.ping&allowInteraction=true&reauth=false&connectionId=SADIPACLIENT&REF=D3984F6FD5A6815303E86DAFA2C375EF310A7E136039B975A13C000000CC&vnd_pi_requested_resource=https%3A%2F%2Fsa.www4.irs.gov%2Fbola%2F&vnd_pi_application_name=BOLA"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          File Now
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:border-gold hover:bg-gold/5 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-gold/10">
                      <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-gold" />
                    </div>
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-gold" />
              Q1 2026 Tax Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Total Wages</div>
                <div className="text-xl font-bold">$1,470,000</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Federal Withholding</div>
                <div className="text-xl font-bold">$89,000</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Social Security (12.4%)</div>
                <div className="text-xl font-bold">$91,140</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Medicare (2.9%)</div>
                <div className="text-xl font-bold">$42,630</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <div className="text-sm text-muted-foreground">Total Tax Liability</div>
                <div className="text-2xl font-bold text-primary">$132,770</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Deposits Made</div>
                <div className="text-2xl font-bold text-sage">$125,000</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Balance Due</div>
                <div className="text-2xl font-bold text-gold">$7,770</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
