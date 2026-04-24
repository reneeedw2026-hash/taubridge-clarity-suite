import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Upload,
  Users,
  Calendar,
  FileText,
  Calculator,
  FileCheck,
  ClipboardCheck,
  BarChart3,
  Shield,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { addMonths, format, setDate, nextWednesday, nextFriday, isBefore, isAfter, addDays } from "date-fns";

const workflowSteps = [
  {
    icon: Upload,
    number: "01",
    title: "Employee Data Import",
    route: "/payroll/upload",
    description: "Drag-and-drop CSV upload with flexible column mapping. Required fields: name, SSN, gross wages, federal withholding, SS/Medicare wages.",
  },
  {
    icon: Users,
    number: "02",
    title: "Employee Management",
    route: "/payroll/employees",
    description: "Central employee table with edit/delete. Auto-calculated Social Security tax (6.2%) and Medicare tax (1.45%).",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Payroll Frequency Settings",
    route: "/payroll/settings",
    description: "Set frequency (weekly, biweekly, semi-monthly, monthly). Pick first pay date; see next 12 pay dates for cash planning.",
  },
  {
    icon: FileText,
    number: "04",
    title: "Quarterly Form 941",
    route: "/payroll/form-941",
    description: "Select quarter and year. Generate 941 preview with tax liability (SS 12.4%, Medicare 2.9%), deposits, and balance due.",
  },
  {
    icon: Calculator,
    number: "05",
    title: "Annual FUTA – Form 940",
    route: "/payroll/form-940",
    description: "Calculates FUTA-exempt payments, amounts over $7k/employee, taxable wages, FUTA tax at 0.6%, and state credit.",
  },
  {
    icon: FileCheck,
    number: "06",
    title: "W-2 Wage Statements",
    route: "/payroll/w2-summary",
    description: "Per-employee W-2 data for all key boxes. Search by name, filter by year, preview and bulk download.",
  },
  {
    icon: ClipboardCheck,
    number: "07",
    title: "W-3 Transmittal",
    route: "/payroll/w3-form",
    description: "Aggregate all W-2 data into W-3 summary. Ensures W-3 matches underlying W-2 totals.",
  },
  {
    icon: Shield,
    number: "08",
    title: "Tax Reconciliation",
    route: "/payroll/reconciliation",
    description: "Reconcile quarterly 941 totals with annual W-2/W-3 totals and deposits. Flag discrepancies before filing.",
  },
  {
    icon: BarChart3,
    number: "09",
    title: "Tax Summary Dashboard",
    route: "/payroll/tax-summary",
    description: "Upcoming deadlines, total liability by form, payment status, and visual indicators all in one view.",
  },
];

const credentials = [
  "22+ years payroll experience",
  "CPP (Certified Payroll Professional) for 5+ years",
  "Managed payroll for ~3,000 employees",
  "System implementation (outsourced → in-house)",
  "B.S. Computer & Info Sciences, AA Accounting",
  "Master of Accountancy, MBA",
];

// Demo payroll data for tax deposit schedule
const demoPayrollData = {
  lookbackPeriodLiability: 42000, // Under $50,000 = Monthly depositor
  payFrequency: 'biweekly' as const,
  firstPayDate: new Date(2026, 0, 9), // Jan 9, 2026
  quarterlyWages: 1470000,
  federalWithholding: 89000,
  socialSecurityTax: 91140,
  medicareTax: 42630,
};

export default function PayrollTaxPro() {
  // Calculate deposit schedule based on lookback period
  const depositSchedule = useMemo(() => {
    const liability = demoPayrollData.lookbackPeriodLiability;
    if (liability <= 50000) {
      return {
        type: 'monthly' as const,
        rule: 'Deposit by the 15th of the following month',
        description: 'Your lookback period liability is $50,000 or less',
      };
    } else {
      return {
        type: 'semi-weekly' as const,
        rule: 'Deposit by Wednesday (for Sat-Tue paydays) or Friday (for Wed-Fri paydays)',
        description: 'Your lookback period liability exceeds $50,000',
      };
    }
  }, []);

  // Generate pay dates and calculate deposit due dates
  const taxDepositSchedule = useMemo(() => {
    const payDates: Date[] = [];
    let currentDate = new Date(demoPayrollData.firstPayDate);
    
    // Generate next 6 pay dates for demo
    for (let i = 0; i < 6; i++) {
      payDates.push(new Date(currentDate));
      // Biweekly = add 14 days
      currentDate = addDays(currentDate, 14);
    }

    return payDates.map((payDate) => {
      const month = payDate.getMonth();
      const year = payDate.getFullYear();
      const dayOfWeek = payDate.getDay();
      
      let depositDueDate: Date;
      let irsRule: string;

      if (depositSchedule.type === 'monthly') {
        // Monthly depositor: Due by 15th of following month
        const nextMonth = addMonths(payDate, 1);
        depositDueDate = setDate(nextMonth, 15);
        irsRule = `Due by ${format(depositDueDate, 'MMMM d, yyyy')} (15th of following month)`;
      } else {
        // Semi-weekly depositor
        if (dayOfWeek >= 3 && dayOfWeek <= 5) { // Wed-Fri
          depositDueDate = nextFriday(payDate);
          if (depositDueDate <= payDate) {
            depositDueDate = addDays(depositDueDate, 7);
          }
          irsRule = 'Due next Friday (Wed-Fri payday rule)';
        } else { // Sat-Tue
          depositDueDate = nextWednesday(payDate);
          if (depositDueDate <= payDate) {
            depositDueDate = addDays(depositDueDate, 7);
          }
          irsRule = 'Due next Wednesday (Sat-Tue payday rule)';
        }
      }

      // Calculate estimated tax for this pay period (divide quarterly by ~6 pay periods)
      const estimatedTax = Math.round((demoPayrollData.federalWithholding + demoPayrollData.socialSecurityTax + demoPayrollData.medicareTax) / 6);

      return {
        payDate,
        depositDueDate,
        irsRule,
        estimatedTax,
      };
    });
  }, [depositSchedule.type]);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">PayrollTax Pro</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              AI-Driven Payroll Tax Compliance & Strategy
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Built for SMBs that must prepare and file quarterly/annual federal employment tax returns (941, 940) and annual wage statements (W-2/W-3). You upload data; we handle the detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Book a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/services/virtual-cfo">See CFO Packages</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Standalone or Integrated with CFO Services
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                PayrollTax Pro can be your dedicated payroll tax compliance solution, or it integrates seamlessly with our CFO + Payroll Performance and Strategic Operations CFO packages.
              </p>
              <p className="text-muted-foreground mb-8">
                You don't have to understand payroll tax rules. Upload your data, and the system + TauBridge handle the detail while giving you plain-language summaries and alerts.
              </p>
              <div className="bg-muted rounded-xl p-6">
                <p className="font-semibold mb-4">Backed by deep expertise:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {credentials.map((cred, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{cred}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="font-semibold text-xl mb-6">What PayrollTax Pro Covers</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Quarterly Form 941</p>
                    <p className="text-sm text-muted-foreground">Federal employment taxes, deposits, balance due</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Annual Form 940 (FUTA)</p>
                    <p className="text-sm text-muted-foreground">Federal unemployment tax calculation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">W-2 / W-3 Preparation</p>
                    <p className="text-sm text-muted-foreground">Annual wage statements and transmittal</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Tax Reconciliation</p>
                    <p className="text-sm text-muted-foreground">Flag discrepancies before filing</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The PayrollTax Pro Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A complete, step-by-step process from data upload to tax filing and reconciliation.
            </p>
          </motion.div>

          <div className="space-y-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-4xl font-bold text-secondary/30">{step.number}</span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{step.route}</code>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-navy-light/10 rounded-xl p-6 border border-navy/20"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Technical foundation:</strong> PapaParse (CSV parsing), React + shadcn/ui (UI), date-fns (dates), Intl.NumberFormat (currency). 
              Currently uses client-side validation with backend persistence planned for next phase.
            </p>
          </motion.div>
        </div>
      </section>

      {/* IRS Tax Deposit Schedule Demo */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 bg-gold/10 text-gold border-gold/30">
              Live Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              IRS Tax Deposit Schedule
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Based on IRS Circular E (Publication 15), your deposit schedule is determined by your lookback period tax liability.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Depositor Type Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-gold/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-gold" />
                    Your Depositor Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-3 bg-gold text-primary-foreground">
                    {depositSchedule.type === 'monthly' ? 'Monthly Depositor' : 'Semi-Weekly Depositor'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    {depositSchedule.description}
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Lookback Period Liability</p>
                    <p className="text-xl font-bold">${demoPayrollData.lookbackPeriodLiability.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Deposit Rule Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-gold" />
                    Deposit Rule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-sage/10 border border-sage/30 mb-4">
                    <p className="font-medium text-sage">{depositSchedule.rule}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {depositSchedule.type === 'monthly' 
                      ? 'As a monthly depositor, you must deposit employment taxes accumulated during a calendar month by the 15th of the following month.'
                      : 'As a semi-weekly depositor, you follow the Wednesday/Friday rule based on your payday.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tax Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-gold" />
                    Q1 Tax Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Federal Withholding</span>
                    <span className="font-medium">${demoPayrollData.federalWithholding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Social Security (12.4%)</span>
                    <span className="font-medium">${demoPayrollData.socialSecurityTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">Medicare (2.9%)</span>
                    <span className="font-medium">${demoPayrollData.medicareTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded bg-primary/10 border border-primary/20 mt-3">
                    <span className="font-medium">Total Q1 Liability</span>
                    <span className="font-bold text-primary">
                      ${(demoPayrollData.federalWithholding + demoPayrollData.socialSecurityTax + demoPayrollData.medicareTax).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Deposit Schedule Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  Upcoming Deposit Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pay Date</TableHead>
                        <TableHead>Deposit Due Date</TableHead>
                        <TableHead>Est. Tax Deposit</TableHead>
                        <TableHead>IRS Rule Applied</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxDepositSchedule.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(item.payDate, 'MMM d, yyyy')}
                            <span className="block text-xs text-muted-foreground">
                              {format(item.payDate, 'EEEE')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
                              {format(item.depositDueDate, 'MMM d, yyyy')}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${item.estimatedTax.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.irsRule}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Penalty Warning</p>
                      <p className="text-sm text-muted-foreground">
                        Late deposits may result in penalties: 2% (1-5 days late), 5% (6-15 days late), 
                        10% (16+ days late), 15% (if not deposited within 10 days of first IRS notice). 
                        Always verify due dates with the IRS EFTPS system.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Button variant="gold" size="lg" asChild>
              <Link to="/payroll/dashboard">
                Try PayrollTax Pro Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop worrying about payroll taxes
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Let PayrollTax Pro handle compliance while you focus on running your business.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}