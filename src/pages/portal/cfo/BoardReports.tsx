import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Presentation,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Copy,
  FileSpreadsheet,
  Building2,
  Target,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell
} from "recharts";

// Mock financial data
const quarterlyRevenue = [
  { quarter: "Q1 2025", revenue: 1250000, expenses: 980000, profit: 270000 },
  { quarter: "Q2 2025", revenue: 1380000, expenses: 1020000, profit: 360000 },
  { quarter: "Q3 2025", revenue: 1420000, expenses: 1080000, profit: 340000 },
  { quarter: "Q4 2025", revenue: 1470000, expenses: 1100000, profit: 370000 },
];

const incomeStatement = [
  { item: "Revenue", current: 1470000, prior: 1250000, change: 17.6 },
  { item: "Cost of Goods Sold", current: 720000, prior: 650000, change: 10.8 },
  { item: "Gross Profit", current: 750000, prior: 600000, change: 25.0, isSubtotal: true },
  { item: "Operating Expenses", current: 380000, prior: 330000, change: 15.2 },
  { item: "EBITDA", current: 370000, prior: 270000, change: 37.0, isSubtotal: true },
  { item: "Depreciation & Amortization", current: 45000, prior: 40000, change: 12.5 },
  { item: "Operating Income", current: 325000, prior: 230000, change: 41.3, isSubtotal: true },
  { item: "Interest Expense", current: 18000, prior: 22000, change: -18.2 },
  { item: "Net Income Before Tax", current: 307000, prior: 208000, change: 47.6 },
  { item: "Income Tax", current: 77000, prior: 52000, change: 48.1 },
  { item: "Net Income", current: 230000, prior: 156000, change: 47.4, isTotal: true },
];

const balanceSheet = [
  { category: "Assets", items: [
    { item: "Cash & Equivalents", current: 850000, prior: 620000 },
    { item: "Accounts Receivable", current: 420000, prior: 380000 },
    { item: "Inventory", current: 180000, prior: 165000 },
    { item: "Property & Equipment", current: 1200000, prior: 1150000 },
    { item: "Total Assets", current: 2650000, prior: 2315000, isTotal: true },
  ]},
  { category: "Liabilities", items: [
    { item: "Accounts Payable", current: 185000, prior: 160000 },
    { item: "Short-term Debt", current: 150000, prior: 200000 },
    { item: "Long-term Debt", current: 450000, prior: 520000 },
    { item: "Total Liabilities", current: 785000, prior: 880000, isTotal: true },
  ]},
  { category: "Equity", items: [
    { item: "Common Stock", current: 500000, prior: 500000 },
    { item: "Retained Earnings", current: 1365000, prior: 935000 },
    { item: "Total Equity", current: 1865000, prior: 1435000, isTotal: true },
  ]},
];

const keyMetrics = [
  { metric: "Revenue Growth", value: "17.6%", target: "15%", status: "above", icon: TrendingUp },
  { metric: "Gross Margin", value: "51.0%", target: "48%", status: "above", icon: DollarSign },
  { metric: "EBITDA Margin", value: "25.2%", target: "22%", status: "above", icon: BarChart3 },
  { metric: "Net Profit Margin", value: "15.6%", target: "12%", status: "above", icon: Target },
  { metric: "Current Ratio", value: "2.8x", target: "2.0x", status: "above", icon: Briefcase },
  { metric: "Debt-to-Equity", value: "0.42x", target: "0.5x", status: "above", icon: Building2 },
  { metric: "Employee Count", value: "165", target: "170", status: "on-track", icon: Users },
  { metric: "Revenue/Employee", value: "$285K", target: "$250K", status: "above", icon: TrendingUp },
];

const revenueBySegment = [
  { name: "Enterprise", value: 45, color: "hsl(var(--primary))" },
  { name: "Mid-Market", value: 30, color: "hsl(142, 76%, 36%)" },
  { name: "SMB", value: 18, color: "hsl(45, 93%, 47%)" },
  { name: "Other", value: 7, color: "hsl(var(--muted-foreground))" },
];

const strategicInitiatives = [
  { initiative: "Product Expansion - Enterprise Tier", status: "on-track", progress: 75, impact: "High" },
  { initiative: "International Market Entry", status: "delayed", progress: 35, impact: "High" },
  { initiative: "Cost Optimization Program", status: "completed", progress: 100, impact: "Medium" },
  { initiative: "Technology Infrastructure Upgrade", status: "on-track", progress: 60, impact: "Medium" },
];

const generatedSummary = `## Q4 2025 Executive Summary

### Financial Performance Highlights
The company delivered strong Q4 results, exceeding targets across all key financial metrics. Revenue grew 17.6% YoY to $1.47M, driven primarily by Enterprise segment expansion (+23%) and improved customer retention (92.5%).

### Key Achievements
- **Profitability**: Net income increased 47.4% to $230K, representing a 15.6% net margin
- **Cash Position**: Cash reserves grew to $850K (+37% YoY), providing 4.2 months runway
- **Operational Efficiency**: EBITDA margin improved to 25.2%, up from 21.6% prior year

### Strategic Progress
- Enterprise product expansion on track (75% complete)
- Cost optimization program completed, delivering $95K annual savings
- International market entry delayed due to regulatory requirements

### Areas of Focus
1. Accelerate international expansion timeline
2. Continue investment in Enterprise sales capacity
3. Monitor labor cost trends (currently 38% of revenue)

### Outlook
Management remains confident in FY 2026 guidance with projected revenue growth of 18-22% and continued margin expansion.`;

const BoardReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("q4-2025");
  const [activeTab, setActiveTab] = useState("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState(generatedSummary);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutiveSummary(generatedSummary);
    setIsGenerating(false);
    toast.success("Executive summary generated successfully!");
  };

  const handleExportDeck = (format: string) => {
    toast.success(`Exporting board deck as ${format}...`, {
      description: "Your download will begin shortly"
    });
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(executiveSummary);
    toast.success("Summary copied to clipboard!");
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Board-Ready Reports</h1>
            <p className="text-muted-foreground">Generate professional reports for board meetings and investors</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
                <SelectItem value="q3-2025">Q3 2025</SelectItem>
                <SelectItem value="q2-2025">Q2 2025</SelectItem>
                <SelectItem value="q1-2025">Q1 2025</SelectItem>
                <SelectItem value="fy-2025">FY 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExportDeck("PDF")}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => handleExportDeck("PowerPoint")}>
              <Presentation className="h-4 w-4 mr-2" />
              Export Deck
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyMetrics.slice(0, 4).map((metric) => (
            <Card key={metric.metric}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{metric.metric}</span>
                  <metric.icon className={`h-4 w-4 ${metric.status === 'above' ? 'text-green-600' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  Target: {metric.target}
                  {metric.status === 'above' && <ArrowUpRight className="h-3 w-3 text-green-600" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="financials">Financial Statements</TabsTrigger>
            <TabsTrigger value="metrics">KPI Dashboard</TabsTrigger>
            <TabsTrigger value="deck">Board Deck</TabsTrigger>
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI-Generated Executive Summary
                    </CardTitle>
                    <CardDescription>Automatically generated from your financial data</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopySummary}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={handleGenerateSummary} disabled={isGenerating}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Regenerate'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Textarea
                    value={executiveSummary}
                    onChange={(e) => setExecutiveSummary(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Strategic Initiatives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Strategic Initiatives Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategicInitiatives.map((initiative, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{initiative.initiative}</span>
                          <Badge 
                            variant={initiative.status === 'completed' ? 'default' : initiative.status === 'on-track' ? 'secondary' : 'destructive'}
                            className={initiative.status === 'completed' ? 'bg-green-100 text-green-700' : initiative.status === 'on-track' ? 'bg-blue-100 text-blue-700' : ''}
                          >
                            {initiative.status === 'completed' ? 'Completed' : initiative.status === 'on-track' ? 'On Track' : 'Delayed'}
                          </Badge>
                          <Badge variant="outline">{initiative.impact} Impact</Badge>
                        </div>
                        <Progress value={initiative.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{initiative.progress}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Statements Tab */}
          <TabsContent value="financials" className="space-y-6">
            {/* Income Statement */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    Income Statement
                  </CardTitle>
                  <Badge variant="outline">Q4 2025 vs Q4 2024</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Line Item</TableHead>
                      <TableHead className="text-right">Q4 2025</TableHead>
                      <TableHead className="text-right">Q4 2024</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeStatement.map((row) => (
                      <TableRow key={row.item} className={row.isTotal ? 'font-bold bg-muted/50' : row.isSubtotal ? 'font-semibold' : ''}>
                        <TableCell className={row.isSubtotal || row.isTotal ? 'font-semibold' : ''}>{row.item}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.current)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatCurrency(row.prior)}</TableCell>
                        <TableCell className="text-right">
                          <span className={row.change > 0 ? 'text-green-600' : row.change < 0 ? 'text-red-600' : ''}>
                            {row.change > 0 ? '+' : ''}{row.change.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Balance Sheet */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Balance Sheet
                  </CardTitle>
                  <Badge variant="outline">As of Dec 31, 2025</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {balanceSheet.map((section) => (
                  <div key={section.category} className="mb-6 last:mb-0">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">{section.category}</h4>
                    <Table>
                      <TableBody>
                        {section.items.map((row) => (
                          <TableRow key={row.item} className={row.isTotal ? 'font-bold bg-muted/50' : ''}>
                            <TableCell className={row.isTotal ? 'font-semibold' : ''}>{row.item}</TableCell>
                            <TableCell className="text-right">{formatCurrency(row.current)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{formatCurrency(row.prior)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Dashboard Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quarterly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={quarterlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" fillOpacity={0.3} stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Area type="monotone" dataKey="profit" name="Net Profit" fill="hsl(142, 76%, 36%)" fillOpacity={0.3} stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Segment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Revenue by Segment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={revenueBySegment}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {revenueBySegment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription>Performance against targets for Q4 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {keyMetrics.map((metric) => (
                    <div key={metric.metric} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <metric.icon className="h-5 w-5 text-primary" />
                        <Badge 
                          variant="outline" 
                          className={metric.status === 'above' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}
                        >
                          {metric.status === 'above' ? 'Exceeding' : 'On Track'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <p className="text-2xl font-bold mt-1">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">Target: {metric.target}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Board Deck Tab */}
          <TabsContent value="deck" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5 text-primary" />
                  Board Deck Generator
                </CardTitle>
                <CardDescription>Generate professional board presentation materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Deck Templates */}
                  <div className="p-4 rounded-lg border bg-card hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Quarterly Board Update</h4>
                        <p className="text-xs text-muted-foreground">12 slides</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Complete quarterly review with financials, KPIs, and strategic updates</p>
                    <Button size="sm" className="w-full" onClick={() => handleExportDeck("PowerPoint")}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Deck
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border bg-card hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Investor Update</h4>
                        <p className="text-xs text-muted-foreground">8 slides</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Investor-ready financials with growth metrics and market positioning</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleExportDeck("PowerPoint")}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Deck
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border bg-card hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Financial Deep Dive</h4>
                        <p className="text-xs text-muted-foreground">15 slides</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Detailed financial analysis with P&L, balance sheet, and cash flow</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleExportDeck("PowerPoint")}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Deck
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download reports in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExportDeck("PDF")}>
                    <FileText className="h-6 w-6 mb-2 text-red-500" />
                    <span className="font-medium">PDF Report</span>
                    <span className="text-xs text-muted-foreground">Print-ready format</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExportDeck("PowerPoint")}>
                    <Presentation className="h-6 w-6 mb-2 text-orange-500" />
                    <span className="font-medium">PowerPoint</span>
                    <span className="text-xs text-muted-foreground">Editable slides</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExportDeck("Excel")}>
                    <FileSpreadsheet className="h-6 w-6 mb-2 text-green-500" />
                    <span className="font-medium">Excel</span>
                    <span className="text-xs text-muted-foreground">Raw financial data</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExportDeck("Word")}>
                    <FileText className="h-6 w-6 mb-2 text-blue-500" />
                    <span className="font-medium">Word Doc</span>
                    <span className="text-xs text-muted-foreground">Narrative report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Exports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Quarterly Board Update</TableCell>
                      <TableCell>Q4 2025</TableCell>
                      <TableCell><Badge variant="outline">PowerPoint</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Jan 15, 2026</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Investor Update</TableCell>
                      <TableCell>Q4 2025</TableCell>
                      <TableCell><Badge variant="outline">PDF</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Jan 12, 2026</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Financial Statements</TableCell>
                      <TableCell>Q3 2025</TableCell>
                      <TableCell><Badge variant="outline">Excel</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Oct 18, 2025</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default BoardReports;
