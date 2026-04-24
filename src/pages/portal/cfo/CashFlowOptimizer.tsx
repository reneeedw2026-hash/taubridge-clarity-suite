import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
  RefreshCw,
  Play,
  Save,
  Download,
  Plus,
  Lightbulb,
  Target,
  Clock,
  Building2,
  Users,
  CreditCard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from 'recharts';

// 13-Week Cash Forecast Data
const generateForecastData = () => {
  const weeks = [];
  let balance = 245000;
  const baseInflows = 85000;
  const baseOutflows = 72000;
  
  for (let i = 0; i < 13; i++) {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + (i * 7));
    
    const variance = Math.random() * 0.2 - 0.1;
    const inflows = Math.round(baseInflows * (1 + variance));
    const outflows = Math.round(baseOutflows * (1 + variance * 0.8));
    const netCash = inflows - outflows;
    balance += netCash;
    
    weeks.push({
      week: `W${i + 1}`,
      date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      inflows,
      outflows,
      netCash,
      balance,
      isProjected: i > 1,
    });
  }
  return weeks;
};

const forecastData = generateForecastData();

// Scenario data
const scenarios = [
  {
    id: 'baseline',
    name: 'Baseline',
    description: 'Current trajectory with no changes',
    endingBalance: 312000,
    minBalance: 198000,
    riskLevel: 'low',
  },
  {
    id: 'growth',
    name: 'Aggressive Growth',
    description: '+20% revenue, +35% expenses',
    endingBalance: 285000,
    minBalance: 142000,
    riskLevel: 'medium',
  },
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Reduced spending, steady revenue',
    endingBalance: 378000,
    minBalance: 245000,
    riskLevel: 'low',
  },
  {
    id: 'downturn',
    name: 'Market Downturn',
    description: '-15% revenue, same expenses',
    endingBalance: 178000,
    minBalance: 95000,
    riskLevel: 'high',
  },
];

// Working Capital Metrics
const workingCapitalMetrics = {
  currentRatio: 2.4,
  quickRatio: 1.8,
  cashConversionCycle: 42,
  daysPayableOutstanding: 28,
  daysSalesOutstanding: 35,
  daysInventoryOutstanding: 35,
};

// AR Aging data
const arAging = [
  { period: 'Current', amount: 125000, percent: 52, status: 'good' },
  { period: '1-30 Days', amount: 68000, percent: 28, status: 'good' },
  { period: '31-60 Days', amount: 32000, percent: 13, status: 'warning' },
  { period: '61-90 Days', amount: 12000, percent: 5, status: 'danger' },
  { period: '90+ Days', amount: 5000, percent: 2, status: 'critical' },
];

// AP Aging data
const apAging = [
  { period: 'Current', amount: 85000, percent: 58 },
  { period: '1-30 Days', amount: 42000, percent: 29 },
  { period: '31-60 Days', amount: 15000, percent: 10 },
  { period: '61-90 Days', amount: 4000, percent: 3 },
];

// Cash flow drivers
const cashFlowDrivers = [
  { category: 'Collections', impact: 95000, trend: 'up', change: '+8%' },
  { category: 'Payroll', impact: -48000, trend: 'stable', change: '+2%' },
  { category: 'Vendor Payments', impact: -28000, trend: 'down', change: '-5%' },
  { category: 'Rent & Utilities', impact: -8500, trend: 'stable', change: '0%' },
  { category: 'Loan Payments', impact: -6200, trend: 'stable', change: '0%' },
  { category: 'Tax Payments', impact: -12000, trend: 'up', change: '+15%' },
];

// Optimization opportunities
const optimizationOpportunities = [
  {
    id: 1,
    title: 'Early Payment Discounts',
    description: 'Negotiate 2/10 Net 30 terms with top 5 vendors',
    potentialSavings: 8400,
    implementation: 'Easy',
    timeframe: '2 weeks',
  },
  {
    id: 2,
    title: 'AR Collection Acceleration',
    description: 'Implement automated reminder system for 30+ day invoices',
    potentialSavings: 15000,
    implementation: 'Medium',
    timeframe: '4 weeks',
  },
  {
    id: 3,
    title: 'Payment Timing Optimization',
    description: 'Shift non-critical vendor payments to align with collection cycles',
    potentialSavings: 4200,
    implementation: 'Easy',
    timeframe: '1 week',
  },
  {
    id: 4,
    title: 'Credit Line Restructuring',
    description: 'Refinance LOC at lower rate based on improved cash position',
    potentialSavings: 12000,
    implementation: 'Hard',
    timeframe: '8 weeks',
  },
];

export default function CashFlowOptimizer() {
  const [activeScenario, setActiveScenario] = useState('baseline');
  const [scenarioDialogOpen, setScenarioDialogOpen] = useState(false);
  const [customScenario, setCustomScenario] = useState({
    revenueChange: 0,
    expenseChange: 0,
    collectionDays: 35,
    paymentDays: 28,
  });

  const selectedScenario = scenarios.find(s => s.id === activeScenario);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Cash Flow Optimizer</h1>
          <p className="text-muted-foreground">13-week forecasting, scenario planning, and working capital optimization</p>
        </div>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Cash</p>
                  <p className="text-2xl font-bold">$245,000</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">13-Week Forecast</p>
                  <p className="text-2xl font-bold">$312,000</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$67k projected</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Min Balance (13W)</p>
                  <p className="text-2xl font-bold">$198,000</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Week 7 projection</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cash Runway</p>
                  <p className="text-2xl font-bold">4.2 months</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Healthy runway</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="forecast">13-Week Forecast</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
            <TabsTrigger value="working-capital">Working Capital</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          {/* 13-Week Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>13-Week Cash Flow Forecast</CardTitle>
                    <CardDescription>Rolling weekly projection with inflows and outflows</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        className="text-xs"
                      />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                        labelFormatter={(label) => `Week ${label.replace('W', '')}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Cash Balance"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                      />
                      <ReferenceLine
                        y={150000}
                        stroke="hsl(var(--destructive))"
                        strokeDasharray="5 5"
                        label={{ value: 'Min Reserve', position: 'right' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-80 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Week</TableHead>
                          <TableHead className="text-right">Inflows</TableHead>
                          <TableHead className="text-right">Outflows</TableHead>
                          <TableHead className="text-right">Net</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forecastData.map((week) => (
                          <TableRow key={week.week}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{week.week}</span>
                                {week.isProjected && (
                                  <Badge variant="outline" className="text-xs">Proj</Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{week.date}</span>
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              +${week.inflows.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                              -${week.outflows.toLocaleString()}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${week.netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {week.netCash >= 0 ? '+' : ''}${week.netCash.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ${week.balance.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cash Flow Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cashFlowDrivers.map((driver, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${driver.impact >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium">{driver.category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-semibold ${driver.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {driver.impact >= 0 ? '+' : ''}${Math.abs(driver.impact).toLocaleString()}
                          </span>
                          <Badge variant="outline" className={`text-xs ${
                            driver.change.startsWith('+') ? 'text-green-600' : 
                            driver.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {driver.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scenario Planning Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Scenario Analysis</h3>
                <p className="text-sm text-muted-foreground">Compare different business scenarios and their cash impact</p>
              </div>
              <Button onClick={() => setScenarioDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Scenario
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className={`cursor-pointer transition-all ${
                    activeScenario === scenario.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveScenario(scenario.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{scenario.name}</h4>
                      <Badge className={getRiskColor(scenario.riskLevel)}>
                        {scenario.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ending Balance</span>
                        <span className="font-semibold">${scenario.endingBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min Balance</span>
                        <span className={`font-semibold ${scenario.minBalance < 150000 ? 'text-red-600' : ''}`}>
                          ${scenario.minBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scenario Comparison Chart</CardTitle>
                <CardDescription>13-week cash balance projection by scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Baseline"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <ReferenceLine
                        y={150000}
                        stroke="hsl(var(--destructive))"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Working Capital Tab */}
          <TabsContent value="working-capital" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Current Ratio</p>
                    <Badge variant="outline" className="text-green-600">Healthy</Badge>
                  </div>
                  <p className="text-3xl font-bold">{workingCapitalMetrics.currentRatio}</p>
                  <p className="text-sm text-muted-foreground mt-1">Target: &gt;1.5</p>
                  <Progress value={Math.min((workingCapitalMetrics.currentRatio / 3) * 100, 100)} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Quick Ratio</p>
                    <Badge variant="outline" className="text-green-600">Healthy</Badge>
                  </div>
                  <p className="text-3xl font-bold">{workingCapitalMetrics.quickRatio}</p>
                  <p className="text-sm text-muted-foreground mt-1">Target: &gt;1.0</p>
                  <Progress value={Math.min((workingCapitalMetrics.quickRatio / 2.5) * 100, 100)} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Cash Conversion Cycle</p>
                    <Badge variant="outline" className="text-yellow-600">Monitor</Badge>
                  </div>
                  <p className="text-3xl font-bold">{workingCapitalMetrics.cashConversionCycle} days</p>
                  <p className="text-sm text-muted-foreground mt-1">Industry avg: 38 days</p>
                  <Progress value={60} className="mt-3" />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowDownRight className="h-5 w-5 text-green-600" />
                    Accounts Receivable Aging
                  </CardTitle>
                  <CardDescription>Total AR: $242,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {arAging.map((item) => (
                      <div key={item.period} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.period}</span>
                          <div className="flex items-center gap-4">
                            <span>${item.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground w-12 text-right">{item.percent}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatusColor(item.status)}`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">$17,000 at risk (60+ days)</span>
                    </div>
                    <Button variant="link" className="px-0 h-auto mt-1 text-primary">
                      View collection actions <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                    Accounts Payable Aging
                  </CardTitle>
                  <CardDescription>Total AP: $146,000</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apAging.map((item) => (
                      <div key={item.period} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.period}</span>
                          <div className="flex items-center gap-4">
                            <span>${item.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground w-12 text-right">{item.percent}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Days Payable</p>
                      <p className="text-xl font-bold">{workingCapitalMetrics.daysPayableOutstanding}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Days Sales</p>
                      <p className="text-xl font-bold">{workingCapitalMetrics.daysSalesOutstanding}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-gold" />
                  Cash Flow Optimization Opportunities
                </CardTitle>
                <CardDescription>
                  AI-identified opportunities to improve cash position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationOpportunities.map((opp) => (
                    <div key={opp.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{opp.title}</h4>
                            <Badge variant="outline" className={
                              opp.implementation === 'Easy' ? 'text-green-600 border-green-200' :
                              opp.implementation === 'Medium' ? 'text-yellow-600 border-yellow-200' :
                              'text-red-600 border-red-200'
                            }>
                              {opp.implementation}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{opp.description}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                ${opp.potentialSavings.toLocaleString()}/year
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{opp.timeframe}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          Take Action
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">Total Potential Annual Savings</h4>
                      <p className="text-sm text-green-700">Implementing all opportunities</p>
                    </div>
                    <p className="text-2xl font-bold text-green-800">
                      ${optimizationOpportunities.reduce((sum, o) => sum + o.potentialSavings, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Custom Scenario Dialog */}
        <Dialog open={scenarioDialogOpen} onOpenChange={setScenarioDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Custom Scenario</DialogTitle>
              <DialogDescription>
                Adjust parameters to model different business conditions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Revenue Change: {customScenario.revenueChange > 0 ? '+' : ''}{customScenario.revenueChange}%</Label>
                <Slider
                  value={[customScenario.revenueChange]}
                  onValueChange={([value]) => setCustomScenario(prev => ({ ...prev, revenueChange: value }))}
                  min={-30}
                  max={30}
                  step={5}
                />
              </div>
              <div className="space-y-3">
                <Label>Expense Change: {customScenario.expenseChange > 0 ? '+' : ''}{customScenario.expenseChange}%</Label>
                <Slider
                  value={[customScenario.expenseChange]}
                  onValueChange={([value]) => setCustomScenario(prev => ({ ...prev, expenseChange: value }))}
                  min={-30}
                  max={30}
                  step={5}
                />
              </div>
              <div className="space-y-3">
                <Label>Collection Days: {customScenario.collectionDays}</Label>
                <Slider
                  value={[customScenario.collectionDays]}
                  onValueChange={([value]) => setCustomScenario(prev => ({ ...prev, collectionDays: value }))}
                  min={15}
                  max={60}
                  step={5}
                />
              </div>
              <div className="space-y-3">
                <Label>Payment Days: {customScenario.paymentDays}</Label>
                <Slider
                  value={[customScenario.paymentDays]}
                  onValueChange={([value]) => setCustomScenario(prev => ({ ...prev, paymentDays: value }))}
                  min={15}
                  max={60}
                  step={5}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setScenarioDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setScenarioDialogOpen(false)}>
                <Play className="h-4 w-4 mr-2" />
                Run Scenario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
}
