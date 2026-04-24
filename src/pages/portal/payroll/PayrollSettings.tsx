import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format, addDays, addWeeks, addMonths, setDate, getDay, nextWednesday, nextFriday } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  CalendarIcon,
  Settings,
  CheckCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Building,
  Archive,
  ChevronDown,
  Download,
  FileSpreadsheet,
  ArrowLeft,
  Eye,
} from 'lucide-react';

type DepositSchedule = 'monthly' | 'semi-weekly';

// Mock payroll data (would come from uploaded spreadsheet in production)
const mockPayrollData = {
  totalEmployees: 247,
  quarterlyWages: 1470000,
  federalWithholding: 89000,
  socialSecurityTax: 91140,
  medicareTax: 42630,
  totalTaxLiability: 132770,
  lookbackPeriodLiability: 45000, // Under $50k = monthly depositor
};

type PayrollFrequency = 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly';

interface FrequencyOption {
  value: PayrollFrequency;
  label: string;
  description: string;
  periodsPerYear: number;
}

const frequencyOptions: FrequencyOption[] = [
  {
    value: 'weekly',
    label: 'Weekly',
    description: '52 pay periods per year',
    periodsPerYear: 52,
  },
  {
    value: 'biweekly',
    label: 'Biweekly',
    description: '26 pay periods per year',
    periodsPerYear: 26,
  },
  {
    value: 'semi-monthly',
    label: 'Semi-Monthly',
    description: '24 pay periods per year (1st & 15th)',
    periodsPerYear: 24,
  },
  {
    value: 'monthly',
    label: 'Monthly',
    description: '12 pay periods per year',
    periodsPerYear: 12,
  },
];

// Mock archive data - filed forms and uploaded spreadsheets
const archiveData = {
  2026: {
    forms: [
      { name: 'Form 941 Q1', filedDate: '2026-04-28', status: 'filed', type: 'tax-form' },
    ],
    uploads: [
      { name: 'Q1 Payroll Data.xlsx', uploadedDate: '2026-03-15', records: 247, type: 'spreadsheet' },
      { name: 'January Payroll.xlsx', uploadedDate: '2026-01-31', records: 245, type: 'spreadsheet' },
      { name: 'February Payroll.xlsx', uploadedDate: '2026-02-28', records: 246, type: 'spreadsheet' },
      { name: 'March Payroll.xlsx', uploadedDate: '2026-03-31', records: 247, type: 'spreadsheet' },
    ],
  },
  2025: {
    forms: [
      { name: 'Form 941 Q4', filedDate: '2025-01-30', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q3', filedDate: '2025-10-29', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q2', filedDate: '2025-07-28', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q1', filedDate: '2025-04-28', status: 'filed', type: 'tax-form' },
      { name: 'Form 940 Annual', filedDate: '2025-01-31', status: 'filed', type: 'tax-form' },
      { name: 'W-2 Distribution', filedDate: '2025-01-31', status: 'filed', type: 'tax-form' },
      { name: 'W-3 Transmittal', filedDate: '2025-01-31', status: 'filed', type: 'tax-form' },
    ],
    uploads: [
      { name: 'Q4 Payroll Data.xlsx', uploadedDate: '2025-12-31', records: 240, type: 'spreadsheet' },
      { name: 'Q3 Payroll Data.xlsx', uploadedDate: '2025-09-30', records: 235, type: 'spreadsheet' },
      { name: 'Q2 Payroll Data.xlsx', uploadedDate: '2025-06-30', records: 230, type: 'spreadsheet' },
      { name: 'Q1 Payroll Data.xlsx', uploadedDate: '2025-03-31', records: 225, type: 'spreadsheet' },
      { name: 'Annual W-2 Export.xlsx', uploadedDate: '2025-01-15', records: 240, type: 'spreadsheet' },
    ],
  },
  2024: {
    forms: [
      { name: 'Form 941 Q4', filedDate: '2024-01-30', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q3', filedDate: '2024-10-28', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q2', filedDate: '2024-07-29', status: 'filed', type: 'tax-form' },
      { name: 'Form 941 Q1', filedDate: '2024-04-29', status: 'filed', type: 'tax-form' },
      { name: 'Form 940 Annual', filedDate: '2024-01-31', status: 'filed', type: 'tax-form' },
      { name: 'W-2 Distribution', filedDate: '2024-01-31', status: 'filed', type: 'tax-form' },
      { name: 'W-3 Transmittal', filedDate: '2024-01-31', status: 'filed', type: 'tax-form' },
    ],
    uploads: [
      { name: 'Q4 Payroll Data.xlsx', uploadedDate: '2024-12-31', records: 220, type: 'spreadsheet' },
      { name: 'Q3 Payroll Data.xlsx', uploadedDate: '2024-09-30', records: 215, type: 'spreadsheet' },
      { name: 'Q2 Payroll Data.xlsx', uploadedDate: '2024-06-30', records: 210, type: 'spreadsheet' },
      { name: 'Q1 Payroll Data.xlsx', uploadedDate: '2024-03-31', records: 205, type: 'spreadsheet' },
    ],
  },
};

export default function PayrollSettings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isFromOnboarding = searchParams.get('from') === 'onboarding';

  const [frequency, setFrequency] = useState<PayrollFrequency>('biweekly');
  const [firstPayDate, setFirstPayDate] = useState<Date | undefined>(undefined);
  const [isSaved, setIsSaved] = useState(false);

  // Determine deposit schedule based on lookback period (IRS Circular E rules)
  const depositSchedule: DepositSchedule = useMemo(() => {
    // If lookback period liability > $50,000 = semi-weekly depositor
    // Otherwise = monthly depositor
    return mockPayrollData.lookbackPeriodLiability > 50000 ? 'semi-weekly' : 'monthly';
  }, []);

  // Calculate next 12 pay dates based on frequency and first pay date
  const upcomingPayDates = useMemo(() => {
    if (!firstPayDate) return [];

    const dates: Date[] = [];
    let currentDate = new Date(firstPayDate);

    for (let i = 0; i < 12; i++) {
      dates.push(new Date(currentDate));

      switch (frequency) {
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'biweekly':
          currentDate = addWeeks(currentDate, 2);
          break;
        case 'semi-monthly':
          // For semi-monthly: 1st and 15th
          if (currentDate.getDate() <= 1) {
            currentDate = setDate(currentDate, 15);
          } else if (currentDate.getDate() <= 15) {
            currentDate = setDate(addMonths(currentDate, 0), 15);
            if (dates[dates.length - 1].getDate() === 15) {
              currentDate = setDate(addMonths(currentDate, 1), 1);
            }
          } else {
            currentDate = setDate(addMonths(currentDate, 1), 1);
          }
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
    }

    return dates;
  }, [firstPayDate, frequency]);

  // Calculate tax deposit due dates based on IRS Circular E
  const taxDepositSchedule = useMemo(() => {
    if (!firstPayDate || upcomingPayDates.length === 0) return [];

    return upcomingPayDates.map((payDate) => {
      let depositDueDate: Date;
      let rule: string;

      if (depositSchedule === 'monthly') {
        // Monthly depositors: Due by 15th of following month
        depositDueDate = setDate(addMonths(payDate, 1), 15);
        rule = 'Due by 15th of following month';
      } else {
        // Semi-weekly depositors based on day of week
        const dayOfWeek = getDay(payDate);
        
        if (dayOfWeek >= 3 && dayOfWeek <= 5) {
          // Wed-Fri payroll → Due following Wednesday
          depositDueDate = nextWednesday(payDate);
          rule = 'Wed-Fri payroll → Due next Wednesday';
        } else {
          // Sat-Tue payroll → Due following Friday
          depositDueDate = nextFriday(payDate);
          rule = 'Sat-Tue payroll → Due next Friday';
        }
      }

      // Estimate tax per period
      const periodsPerYear = frequencyOptions.find(f => f.value === frequency)?.periodsPerYear || 26;
      const estimatedTax = Math.round(mockPayrollData.totalTaxLiability / (periodsPerYear / 4));

      return {
        payDate,
        depositDueDate,
        rule,
        estimatedTax,
      };
    });
  }, [upcomingPayDates, depositSchedule, frequency, firstPayDate]);

  const selectedFrequency = frequencyOptions.find(f => f.value === frequency);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Back to Onboarding Button */}
        {isFromOnboarding && (
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding?return_from=payroll')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Onboarding
          </Button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-gold" />
              Payroll Frequency Settings
            </h1>
            <p className="text-muted-foreground">Configure your payroll schedule for accurate tax calculations</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Frequency Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Pay Frequency
              </CardTitle>
              <CardDescription>
                Select how often you process payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={frequency}
                onValueChange={(value) => setFrequency(value as PayrollFrequency)}
                className="space-y-3"
              >
                {frequencyOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer",
                      frequency === option.value
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold/50"
                    )}
                    onClick={() => setFrequency(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {option.periodsPerYear}/year
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* First Pay Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gold" />
                First Pay Date
              </CardTitle>
              <CardDescription>
                Select the starting date for your payroll schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !firstPayDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {firstPayDate ? (
                      format(firstPayDate, "EEEE, MMMM d, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={firstPayDate}
                    onSelect={setFirstPayDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {firstPayDate && selectedFrequency && (
                <div className="p-4 rounded-lg bg-sage/10 border border-sage/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-sage" />
                    <span className="font-medium text-sage">Schedule Configured</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>{selectedFrequency.label}</strong> payroll starting{' '}
                    <strong>{format(firstPayDate, "MMMM d, yyyy")}</strong>
                  </p>
                </div>
              )}

              <Button
                variant="gold"
                className="w-full"
                disabled={!firstPayDate}
                onClick={handleSave}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Settings Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* IRS Deposit Schedule Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-gold" />
              IRS Tax Deposit Schedule
            </CardTitle>
            <CardDescription>
              Based on IRS Circular E (Publication 15) deposit rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "p-4 rounded-lg border",
              depositSchedule === 'monthly' 
                ? "bg-sage/10 border-sage/30" 
                : "bg-gold/10 border-gold/30"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  depositSchedule === 'monthly' ? "bg-sage/20" : "bg-gold/20"
                )}>
                  <FileText className={cn(
                    "h-5 w-5",
                    depositSchedule === 'monthly' ? "text-sage" : "text-gold"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {depositSchedule === 'monthly' ? 'Monthly Depositor' : 'Semi-Weekly Depositor'}
                    </span>
                    <Badge variant="outline">
                      {depositSchedule === 'monthly' ? 'Lower Volume' : 'Higher Volume'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {depositSchedule === 'monthly' 
                      ? 'Your lookback period liability is $50,000 or less. Deposits are due by the 15th of the following month.'
                      : 'Your lookback period liability exceeds $50,000. Deposits follow the semi-weekly schedule based on payday.'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Lookback Period Liability:</strong> ${mockPayrollData.lookbackPeriodLiability.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Rules Summary */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-lg border",
                depositSchedule === 'monthly' ? "border-sage/30" : "border-border"
              )}>
                <div className="font-medium mb-2">Monthly Depositor Rules</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Lookback liability ≤ $50,000</li>
                  <li>• Deposit by 15th of following month</li>
                  <li>• Use Form 941 quarterly</li>
                </ul>
              </div>
              <div className={cn(
                "p-4 rounded-lg border",
                depositSchedule === 'semi-weekly' ? "border-gold/30" : "border-border"
              )}>
                <div className="font-medium mb-2">Semi-Weekly Depositor Rules</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Lookback liability &gt; $50,000</li>
                  <li>• Wed-Fri pay → Due next Wednesday</li>
                  <li>• Sat-Tue pay → Due next Friday</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pay Date Preview with Tax Deposits */}
        {firstPayDate && taxDepositSchedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gold" />
                Pay Dates & Tax Deposit Deadlines
              </CardTitle>
              <CardDescription>
                Complete schedule with estimated tax deposits and IRS due dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Period</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Pay Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Deposit Due</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Est. Tax</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">IRS Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxDepositSchedule.map((item, index) => (
                      <tr key={index} className={cn(
                        "border-b",
                        index === 0 && "bg-gold/5"
                      )}>
                        <td className="py-3 px-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium">{format(item.payDate, "MMM d, yyyy")}</div>
                          <div className="text-xs text-muted-foreground">{format(item.payDate, "EEEE")}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-destructive">{format(item.depositDueDate, "MMM d, yyyy")}</div>
                          <div className="text-xs text-muted-foreground">{format(item.depositDueDate, "EEEE")}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-semibold">${item.estimatedTax.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-xs text-muted-foreground">{item.rule}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Summary */}
              <div className="mt-6 grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Federal Withholding</div>
                  <div className="text-xl font-bold">${mockPayrollData.federalWithholding.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Social Security (12.4%)</div>
                  <div className="text-xl font-bold">${mockPayrollData.socialSecurityTax.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Medicare (2.9%)</div>
                  <div className="text-xl font-bold">${mockPayrollData.medicareTax.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-sm text-muted-foreground">Total Q1 Liability</div>
                  <div className="text-xl font-bold text-primary">${mockPayrollData.totalTaxLiability.toLocaleString()}</div>
                </div>
              </div>

              {/* Important Reminder */}
              <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <div className="font-medium text-destructive">IRS Deposit Penalty Warning</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Late deposits may result in penalties ranging from 2% to 15% depending on lateness. 
                      Always deposit via EFTPS (Electronic Federal Tax Payment System) to ensure timely processing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Archive */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Archive className="h-5 w-5 text-gold" />
              Document Archive
            </CardTitle>
            <CardDescription>
              History of filed tax forms and uploaded payroll spreadsheets by year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(archiveData)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, data]) => (
                <Collapsible key={year} defaultOpen={year === '2026'}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-gold" />
                      <span className="font-semibold text-lg">{year} Tax Year</span>
                      <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                        {data.forms.length} forms
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {data.uploads.length} files
                      </Badge>
                    </div>
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="rounded-lg border overflow-hidden">
                      {/* Filed Forms Section */}
                      <div className="bg-muted/30 px-4 py-2 border-b">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gold" />
                          Filed Tax Forms
                        </span>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Filed Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.forms.map((form, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {form.name}
                                </div>
                              </TableCell>
                              <TableCell>{format(new Date(form.filedDate), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Filed
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Uploaded Spreadsheets Section */}
                      <div className="bg-muted/30 px-4 py-2 border-t border-b">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-primary" />
                          Uploaded Payroll Spreadsheets
                        </span>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.uploads.map((upload, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                  {upload.name}
                                </div>
                              </TableCell>
                              <TableCell>{format(new Date(upload.uploadedDate), 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {upload.records} employees
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
