import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
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
  Target,
  BarChart3,
  RefreshCw,
  Save,
  Download,
  Plus,
  Lightbulb,
  FileText,
  Building2,
  Users,
  ChevronDown,
  ChevronRight,
  Edit,
  Copy,
  Clock,
  AlertCircle,
  Banknote,
  PiggyBank,
  Calculator,
  TrendingUp as TrendUp,
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
  ComposedChart,
} from 'recharts';

// Budget categories with monthly data
const budgetCategories = [
  {
    id: 'revenue',
    name: 'Revenue',
    type: 'income',
    subcategories: [
      { id: 'product-sales', name: 'Product Sales', budget: 150000, actual: 142000, forecast: 148000 },
      { id: 'services', name: 'Services', budget: 45000, actual: 52000, forecast: 50000 },
      { id: 'other-income', name: 'Other Income', budget: 5000, actual: 4200, forecast: 4500 },
    ],
  },
  {
    id: 'cogs',
    name: 'Cost of Goods Sold',
    type: 'expense',
    subcategories: [
      { id: 'materials', name: 'Raw Materials', budget: 45000, actual: 48000, forecast: 46000 },
      { id: 'labor-direct', name: 'Direct Labor', budget: 32000, actual: 35000, forecast: 34000 },
      { id: 'manufacturing', name: 'Manufacturing Overhead', budget: 12000, actual: 11500, forecast: 12000 },
    ],
  },
  {
    id: 'opex',
    name: 'Operating Expenses',
    type: 'expense',
    subcategories: [
      { id: 'payroll', name: 'Salaries & Wages', budget: 65000, actual: 72000, forecast: 70000 },
      { id: 'benefits', name: 'Employee Benefits', budget: 15000, actual: 16500, forecast: 16000 },
      { id: 'rent', name: 'Rent & Utilities', budget: 8500, actual: 8500, forecast: 8500 },
      { id: 'marketing', name: 'Marketing & Advertising', budget: 12000, actual: 15000, forecast: 13000 },
      { id: 'software', name: 'Software & Technology', budget: 6000, actual: 7200, forecast: 6800 },
      { id: 'insurance', name: 'Insurance', budget: 3500, actual: 3500, forecast: 3500 },
      { id: 'professional', name: 'Professional Services', budget: 5000, actual: 8000, forecast: 6500 },
    ],
  },
];

// Monthly trend data
const monthlyTrendData = [
  { month: 'Jan', budget: 200000, actual: 195000, forecast: 198000 },
  { month: 'Feb', budget: 200000, actual: 188000, forecast: 192000 },
  { month: 'Mar', budget: 200000, actual: 210000, forecast: 208000 },
  { month: 'Apr', budget: 200000, actual: 198000, forecast: 200000 },
  { month: 'May', budget: 200000, actual: 0, forecast: 205000 },
  { month: 'Jun', budget: 200000, actual: 0, forecast: 210000 },
  { month: 'Jul', budget: 200000, actual: 0, forecast: 215000 },
  { month: 'Aug', budget: 200000, actual: 0, forecast: 212000 },
  { month: 'Sep', budget: 200000, actual: 0, forecast: 218000 },
  { month: 'Oct', budget: 200000, actual: 0, forecast: 225000 },
  { month: 'Nov', budget: 200000, actual: 0, forecast: 230000 },
  { month: 'Dec', budget: 200000, actual: 0, forecast: 235000 },
];

// Variance action items
const varianceActionItems = [
  {
    id: 1,
    category: 'Payroll',
    variance: 7000,
    variancePercent: 10.8,
    status: 'in-progress',
    priority: 'high',
    action: 'Review overtime hours and implement scheduling optimization',
    owner: 'HR Director',
    dueDate: '2026-02-15',
    notes: 'Overtime driven by Q1 project deadlines. Evaluating temp staffing options.',
  },
  {
    id: 2,
    category: 'Marketing',
    variance: 3000,
    variancePercent: 25,
    status: 'pending',
    priority: 'medium',
    action: 'Audit campaign ROI and pause underperforming channels',
    owner: 'Marketing Manager',
    dueDate: '2026-02-10',
    notes: 'Social media spend increased for product launch.',
  },
  {
    id: 3,
    category: 'Professional Services',
    variance: 3000,
    variancePercent: 60,
    status: 'pending',
    priority: 'high',
    action: 'Renegotiate consulting contracts or bring expertise in-house',
    owner: 'CFO',
    dueDate: '2026-02-20',
    notes: 'One-time legal fees for contract review. Should normalize.',
  },
  {
    id: 4,
    category: 'Software',
    variance: 1200,
    variancePercent: 20,
    status: 'completed',
    priority: 'low',
    action: 'Consolidated 2 overlapping SaaS subscriptions',
    owner: 'IT Manager',
    dueDate: '2026-01-31',
    notes: 'Savings of $400/month achieved starting February.',
  },
  {
    id: 5,
    category: 'Services Revenue',
    variance: -7000,
    variancePercent: -15.6,
    status: 'in-progress',
    priority: 'high',
    action: 'Identify new service opportunities and upsell existing clients',
    owner: 'Sales Director',
    dueDate: '2026-02-28',
    notes: 'Positive variance - exceeded budget. Expanding consulting offerings.',
  },
];

// Reforecast scenarios
const reforecastScenarios = [
  { id: 'current', name: 'Current Forecast', revenue: 2280000, expenses: 1920000, profit: 360000 },
  { id: 'optimistic', name: 'Optimistic', revenue: 2450000, expenses: 1950000, profit: 500000 },
  { id: 'conservative', name: 'Conservative', revenue: 2150000, expenses: 1980000, profit: 170000 },
  { id: 'worst-case', name: 'Worst Case', revenue: 1980000, expenses: 2050000, profit: -70000 },
];

// Capital projects
const capitalProjects = [
  {
    id: 1,
    name: 'Manufacturing Equipment Upgrade',
    status: 'approved',
    totalCost: 250000,
    fundedAmount: 175000,
    roi: 18,
    paybackMonths: 24,
    priority: 'high',
    startDate: '2026-Q2',
  },
  {
    id: 2,
    name: 'Office Expansion',
    status: 'pending',
    totalCost: 150000,
    fundedAmount: 0,
    roi: 12,
    paybackMonths: 36,
    priority: 'medium',
    startDate: '2026-Q3',
  },
  {
    id: 3,
    name: 'ERP System Implementation',
    status: 'approved',
    totalCost: 85000,
    fundedAmount: 85000,
    roi: 25,
    paybackMonths: 18,
    priority: 'high',
    startDate: '2026-Q1',
  },
  {
    id: 4,
    name: 'Fleet Vehicles',
    status: 'evaluation',
    totalCost: 120000,
    fundedAmount: 0,
    roi: 8,
    paybackMonths: 48,
    priority: 'low',
    startDate: '2026-Q4',
  },
];

// Funding sources
const fundingSources = [
  { source: 'Retained Earnings', available: 320000, allocated: 175000 },
  { source: 'Bank Line of Credit', available: 500000, allocated: 85000 },
  { source: 'Equipment Financing', available: 300000, allocated: 0 },
  { source: 'SBA Loan', available: 250000, allocated: 0 },
];

export default function BudgetPlanning() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['revenue', 'opex']);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<typeof varianceActionItems[0] | null>(null);
  const [reforecastDialogOpen, setReforecastDialogOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-muted-foreground';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const totalBudget = budgetCategories.reduce((sum, cat) =>
    sum + cat.subcategories.reduce((s, sub) => s + (cat.type === 'income' ? sub.budget : -sub.budget), 0), 0);
  const totalActual = budgetCategories.reduce((sum, cat) =>
    sum + cat.subcategories.reduce((s, sub) => s + (cat.type === 'income' ? sub.actual : -sub.actual), 0), 0);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Budget & Planning</h1>
            <p className="text-muted-foreground">Annual budget, reforecasting, variance analysis, and capital planning</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">FY 2024</SelectItem>
                <SelectItem value="2025">FY 2025</SelectItem>
                <SelectItem value="2026">FY 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Budget</p>
                  <p className="text-2xl font-bold">$2.4M</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">FY {selectedYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">YTD Actual</p>
                  <p className="text-2xl font-bold">$791k</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>2.3% over budget</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Forecast</p>
                  <p className="text-2xl font-bold">$2.28M</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>$360k projected profit</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Action Items</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>3 pending review</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="budget">Annual Budget</TabsTrigger>
            <TabsTrigger value="reforecast">Reforecasting</TabsTrigger>
            <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
            <TabsTrigger value="capital">Capital Planning</TabsTrigger>
          </TabsList>

          {/* Annual Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>FY {selectedYear} Budget Builder</CardTitle>
                    <CardDescription>Build and manage your annual operating budget</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy from Prior Year
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Budget
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {budgetCategories.map((category) => (
                    <Collapsible
                      key={category.id}
                      open={expandedCategories.includes(category.id)}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                          <div className="flex items-center gap-3">
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-semibold">{category.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.subcategories.length} items
                            </Badge>
                          </div>
                          <div className="flex items-center gap-8 text-sm">
                            <div className="text-right">
                              <span className="text-muted-foreground">Budget: </span>
                              <span className="font-semibold">
                                ${category.subcategories.reduce((s, sub) => s + sub.budget, 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-muted-foreground">Actual: </span>
                              <span className="font-semibold">
                                ${category.subcategories.reduce((s, sub) => s + sub.actual, 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">Line Item</TableHead>
                              <TableHead className="text-right">Budget</TableHead>
                              <TableHead className="text-right">Actual (YTD)</TableHead>
                              <TableHead className="text-right">Variance</TableHead>
                              <TableHead className="text-right">Forecast</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.subcategories.map((sub) => {
                              const variance = sub.actual - sub.budget;
                              const isExpense = category.type === 'expense';
                              const varianceColor = isExpense
                                ? variance > 0 ? 'text-red-600' : 'text-green-600'
                                : variance < 0 ? 'text-red-600' : 'text-green-600';
                              return (
                                <TableRow key={sub.id}>
                                  <TableCell className="font-medium pl-10">{sub.name}</TableCell>
                                  <TableCell className="text-right">${sub.budget.toLocaleString()}</TableCell>
                                  <TableCell className="text-right">${sub.actual.toLocaleString()}</TableCell>
                                  <TableCell className={`text-right ${varianceColor}`}>
                                    {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">${sub.forecast.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget vs Actual Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted))" />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        name="Forecast"
                        stroke="hsl(var(--gold))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reforecasting Tab */}
          <TabsContent value="reforecast" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Reforecast Scenarios</h3>
                <p className="text-sm text-muted-foreground">Compare forecast scenarios and update projections</p>
              </div>
              <Button onClick={() => setReforecastDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Reforecast
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {reforecastScenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">{scenario.name}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">${(scenario.revenue / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expenses</span>
                        <span className="font-medium">${(scenario.expenses / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">Net Profit</span>
                          <span className={`font-bold ${scenario.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {scenario.profit >= 0 ? '' : '-'}${Math.abs(scenario.profit / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reforecastScenarios}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" />
                      <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--muted-foreground))" />
                      <Bar dataKey="profit" name="Profit" fill="hsl(var(--gold))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reforecast Assumptions</CardTitle>
                <CardDescription>Key assumptions driving the current forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Revenue Assumptions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Product sales growth: 8% YoY</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Services revenue: 15% expansion from consulting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Q3 seasonal dip expected (-5%)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Expense Assumptions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Headcount: 2 new hires in Q2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Rent increase: 3% starting July</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Marketing: Reduced 10% after Q1 push</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variance Analysis Tab */}
          <TabsContent value="variance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Variance Analysis with Action Items</CardTitle>
                    <CardDescription>Track variances and associated corrective actions</CardDescription>
                  </div>
                  <Link to="/action-plan">
                    <Button variant="outline" size="sm">
                      View Full Action Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Variance ($)</TableHead>
                      <TableHead className="text-right">Variance (%)</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action Required</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {varianceActionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className={`text-right ${getVarianceColor(item.variance)}`}>
                          {item.variance >= 0 ? '+' : ''}${item.variance.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right ${getVarianceColor(item.variance)}`}>
                          {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                        </TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.action}</TableCell>
                        <TableCell>{item.owner}</TableCell>
                        <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAction(item);
                              setActionDialogOpen(true);
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Variance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Over Budget (Expenses)</span>
                      </div>
                      <span className="font-bold text-red-600">+$14,200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Favorable (Revenue)</span>
                      </div>
                      <span className="font-bold text-green-600">+$7,000</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted border rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5" />
                        <span className="font-medium">Net Variance</span>
                      </div>
                      <span className="font-bold text-red-600">-$7,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Item Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completed</span>
                        <span className="font-medium">1 of 5</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">1</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">2</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">2</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Capital Planning Tab */}
          <TabsContent value="capital" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total CapEx Budget</p>
                      <p className="text-2xl font-bold">$605,000</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Funded</p>
                      <p className="text-2xl font-bold text-green-600">$260,000</p>
                    </div>
                    <Banknote className="h-8 w-8 text-green-600" />
                  </div>
                  <Progress value={43} className="mt-3" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Funding</p>
                      <p className="text-2xl font-bold">$1.11M</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-gold" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Capital Projects</CardTitle>
                    <CardDescription>Track and manage capital expenditure projects</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Funded</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                      <TableHead className="text-right">Payback</TableHead>
                      <TableHead>Start</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capitalProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              project.status === 'approved' ? 'text-green-600 border-green-200' :
                              project.status === 'pending' ? 'text-yellow-600 border-yellow-200' :
                              'text-muted-foreground'
                            }
                          >
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                        <TableCell className="text-right">${project.totalCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={project.fundedAmount > 0 ? 'text-green-600' : ''}>
                            ${project.fundedAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{project.roi}%</TableCell>
                        <TableCell className="text-right">{project.paybackMonths} mo</TableCell>
                        <TableCell>{project.startDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funding Sources</CardTitle>
                <CardDescription>Available capital and allocation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fundingSources.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{source.source}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            ${source.allocated.toLocaleString()} / ${source.available.toLocaleString()}
                          </span>
                          <span className="font-medium w-16 text-right">
                            {Math.round((source.allocated / source.available) * 100)}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(source.allocated / source.available) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Item Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Variance Action Item</DialogTitle>
              <DialogDescription>
                {selectedAction?.category} - {selectedAction?.variancePercent}% variance
              </DialogDescription>
            </DialogHeader>
            {selectedAction && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  {getPriorityBadge(selectedAction.priority)}
                  {getStatusBadge(selectedAction.status)}
                </div>
                <div>
                  <Label className="text-muted-foreground">Variance Amount</Label>
                  <p className={`text-lg font-bold ${getVarianceColor(selectedAction.variance)}`}>
                    {selectedAction.variance >= 0 ? '+' : ''}${selectedAction.variance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Required Action</Label>
                  <p className="font-medium">{selectedAction.action}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Owner</Label>
                    <p>{selectedAction.owner}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p>{new Date(selectedAction.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="text-sm">{selectedAction.notes}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Close
              </Button>
              <Button>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reforecast Dialog */}
        <Dialog open={reforecastDialogOpen} onOpenChange={setReforecastDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Reforecast</DialogTitle>
              <DialogDescription>
                Update your financial projections based on current performance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Scenario Name</Label>
                <Input placeholder="e.g., Q2 Updated Forecast" />
              </div>
              <div>
                <Label>Revenue Adjustment (%)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Expense Adjustment (%)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Notes & Assumptions</Label>
                <Textarea placeholder="Describe key changes and assumptions..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReforecastDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setReforecastDialogOpen(false)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Reforecast
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
}
