import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Building2,
  Users,
  DollarSign,
  Target,
  Award,
  Download,
  RefreshCw,
  Info,
  ChevronUp,
  ChevronDown,
  Percent,
  Clock,
  Zap,
  PieChart,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from "recharts";

// Mock data for peer comparison
const peerComparisonData = [
  { metric: "Gross Margin", yourCompany: 42.5, industryAvg: 38.2, topQuartile: 48.5, unit: "%" },
  { metric: "Operating Margin", yourCompany: 15.8, industryAvg: 12.4, topQuartile: 18.2, unit: "%" },
  { metric: "Net Profit Margin", yourCompany: 8.2, industryAvg: 7.1, topQuartile: 11.5, unit: "%" },
  { metric: "Revenue Growth", yourCompany: 18.5, industryAvg: 12.8, topQuartile: 24.3, unit: "%" },
  { metric: "Current Ratio", yourCompany: 2.1, industryAvg: 1.8, topQuartile: 2.5, unit: "x" },
  { metric: "Quick Ratio", yourCompany: 1.4, industryAvg: 1.2, topQuartile: 1.8, unit: "x" },
  { metric: "Debt-to-Equity", yourCompany: 0.45, industryAvg: 0.65, topQuartile: 0.35, unit: "x" },
  { metric: "Asset Turnover", yourCompany: 1.8, industryAvg: 1.5, topQuartile: 2.2, unit: "x" },
];

const radarData = [
  { metric: "Profitability", yourCompany: 78, industryAvg: 65, fullMark: 100 },
  { metric: "Liquidity", yourCompany: 82, industryAvg: 70, fullMark: 100 },
  { metric: "Efficiency", yourCompany: 75, industryAvg: 68, fullMark: 100 },
  { metric: "Growth", yourCompany: 85, industryAvg: 62, fullMark: 100 },
  { metric: "Leverage", yourCompany: 88, industryAvg: 72, fullMark: 100 },
  { metric: "Coverage", yourCompany: 72, industryAvg: 65, fullMark: 100 },
];

const industryKPIs = [
  {
    category: "Profitability",
    icon: DollarSign,
    kpis: [
      { name: "Gross Profit Margin", value: 42.5, benchmark: 38.2, trend: "up", percentile: 72 },
      { name: "EBITDA Margin", value: 18.2, benchmark: 15.5, trend: "up", percentile: 68 },
      { name: "Return on Assets (ROA)", value: 12.8, benchmark: 9.5, trend: "up", percentile: 75 },
      { name: "Return on Equity (ROE)", value: 18.5, benchmark: 14.2, trend: "up", percentile: 70 },
    ]
  },
  {
    category: "Operational Efficiency",
    icon: Zap,
    kpis: [
      { name: "Revenue per Employee", value: 285000, benchmark: 245000, trend: "up", percentile: 78, format: "currency" },
      { name: "Operating Expense Ratio", value: 24.2, benchmark: 28.5, trend: "down", percentile: 82 },
      { name: "Inventory Turnover", value: 8.5, benchmark: 6.2, trend: "up", percentile: 74, unit: "x" },
      { name: "Days Sales Outstanding", value: 32, benchmark: 45, trend: "down", percentile: 85, unit: "days" },
    ]
  },
  {
    category: "Growth & Scale",
    icon: TrendingUp,
    kpis: [
      { name: "YoY Revenue Growth", value: 18.5, benchmark: 12.8, trend: "up", percentile: 76 },
      { name: "Customer Acquisition Rate", value: 15.2, benchmark: 11.5, trend: "up", percentile: 71 },
      { name: "Market Share", value: 4.2, benchmark: 2.8, trend: "up", percentile: 68 },
      { name: "Customer Retention", value: 92.5, benchmark: 85.2, trend: "up", percentile: 82 },
    ]
  },
  {
    category: "Financial Health",
    icon: Target,
    kpis: [
      { name: "Current Ratio", value: 2.1, benchmark: 1.8, trend: "up", percentile: 65, unit: "x" },
      { name: "Interest Coverage", value: 8.5, benchmark: 5.2, trend: "up", percentile: 78, unit: "x" },
      { name: "Debt-to-EBITDA", value: 1.8, benchmark: 2.5, trend: "down", percentile: 72, unit: "x" },
      { name: "Free Cash Flow Margin", value: 12.5, benchmark: 8.2, trend: "up", percentile: 74 },
    ]
  },
];

const trendData = [
  { quarter: "Q1 2024", yourCompany: 38, industryAvg: 35, topQuartile: 42 },
  { quarter: "Q2 2024", yourCompany: 40, industryAvg: 36, topQuartile: 44 },
  { quarter: "Q3 2024", yourCompany: 41, industryAvg: 37, topQuartile: 46 },
  { quarter: "Q4 2024", yourCompany: 42.5, industryAvg: 38.2, topQuartile: 48.5 },
];

const peerCompanies = [
  { name: "Industry Median", revenue: "$45M", employees: 180, margin: "12.4%", growth: "8.5%" },
  { name: "Top Quartile Avg", revenue: "$78M", employees: 285, margin: "18.2%", growth: "15.2%" },
  { name: "Bottom Quartile Avg", revenue: "$22M", employees: 95, margin: "5.8%", growth: "2.1%" },
  { name: "Your Company", revenue: "$52M", employees: 165, margin: "15.8%", growth: "18.5%", highlight: true },
];

interface ImprovementOpportunity {
  id: string;
  area: string;
  current: number;
  benchmark: number;
  opportunity: string;
  impact: string;
  priority: "high" | "medium" | "low";
  suggestedOwner: string;
  suggestedDueDate: string;
}

const improvementOpportunities: ImprovementOpportunity[] = [
  {
    id: "opp-1",
    area: "Days Payable Outstanding",
    current: 28,
    benchmark: 42,
    opportunity: "Extend payment terms to improve cash position",
    impact: "$180K additional float",
    priority: "high",
    suggestedOwner: "CFO",
    suggestedDueDate: "2026-03-15"
  },
  {
    id: "opp-2",
    area: "Inventory Days",
    current: 45,
    benchmark: 35,
    opportunity: "Implement JIT practices to reduce carrying costs",
    impact: "$95K annual savings",
    priority: "medium",
    suggestedOwner: "Operations Manager",
    suggestedDueDate: "2026-04-30"
  },
  {
    id: "opp-3",
    area: "SG&A as % Revenue",
    current: 18.5,
    benchmark: 15.2,
    opportunity: "Automate administrative processes",
    impact: "3.3% margin improvement",
    priority: "high",
    suggestedOwner: "COO",
    suggestedDueDate: "2026-03-31"
  },
  {
    id: "opp-4",
    area: "Customer Acquisition Cost",
    current: 850,
    benchmark: 650,
    opportunity: "Optimize marketing spend allocation",
    impact: "$200K annual savings",
    priority: "medium",
    suggestedOwner: "CMO",
    suggestedDueDate: "2026-04-15"
  },
];

const IndustryBenchmarking = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState("professional-services");
  const [selectedSize, setSelectedSize] = useState("mid-market");
  const [activeTab, setActiveTab] = useState("overview");
  const [createActionDialogOpen, setCreateActionDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ImprovementOpportunity | null>(null);
  const [createdActions, setCreatedActions] = useState<string[]>([]);
  
  // Form state for creating action
  const [actionForm, setActionForm] = useState({
    title: "",
    owner: "",
    dueDate: "",
    impact: "",
    notes: ""
  });

  const handleOpenCreateAction = (opp: ImprovementOpportunity) => {
    setSelectedOpportunity(opp);
    setActionForm({
      title: `Improve ${opp.area}: ${opp.opportunity}`,
      owner: opp.suggestedOwner,
      dueDate: opp.suggestedDueDate,
      impact: opp.impact,
      notes: `Benchmark gap: Current ${opp.current} vs Industry ${opp.benchmark}\nSource: Industry Benchmarking Analysis`
    });
    setCreateActionDialogOpen(true);
  };

  const handleCreateAction = () => {
    if (!selectedOpportunity) return;
    
    // In a real app, this would save to the database
    // For now, we'll store in localStorage and navigate to Action Plan
    const existingActions = JSON.parse(localStorage.getItem('pendingBenchmarkActions') || '[]');
    const newAction = {
      id: `benchmark-${selectedOpportunity.id}-${Date.now()}`,
      title: actionForm.title,
      owner: actionForm.owner,
      dueDate: actionForm.dueDate,
      impact: actionForm.impact,
      notes: actionForm.notes,
      priority: selectedOpportunity.priority,
      source: 'benchmarking',
      sourceArea: selectedOpportunity.area,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('pendingBenchmarkActions', JSON.stringify([...existingActions, newAction]));
    setCreatedActions(prev => [...prev, selectedOpportunity.id]);
    setCreateActionDialogOpen(false);
    
    toast.success("Action created successfully!", {
      description: "View it in your Action Plan",
      action: {
        label: "View Action Plan",
        onClick: () => navigate('/action-plan')
      }
    });
  };

  const isActionCreated = (oppId: string) => createdActions.includes(oppId);

  const getPerformanceColor = (percentile: number) => {
    if (percentile >= 75) return "text-green-600";
    if (percentile >= 50) return "text-blue-600";
    if (percentile >= 25) return "text-amber-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (percentile: number) => {
    if (percentile >= 75) return { label: "Top Quartile", variant: "default" as const, className: "bg-green-100 text-green-700" };
    if (percentile >= 50) return { label: "Above Median", variant: "secondary" as const, className: "bg-blue-100 text-blue-700" };
    if (percentile >= 25) return { label: "Below Median", variant: "secondary" as const, className: "bg-amber-100 text-amber-700" };
    return { label: "Bottom Quartile", variant: "destructive" as const, className: "bg-red-100 text-red-700" };
  };

  const formatValue = (value: number, format?: string, unit?: string) => {
    if (format === "currency") return `$${(value / 1000).toFixed(0)}K`;
    if (unit) return `${value}${unit === "x" ? "x" : ` ${unit}`}`;
    return `${value}%`;
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Industry Benchmarking</h1>
            <p className="text-muted-foreground">Compare your performance against industry peers</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional-services">Professional Services</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">$5M - $20M</SelectItem>
                <SelectItem value="mid-market">$20M - $100M</SelectItem>
                <SelectItem value="enterprise">$100M+</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Performance Score Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" strokeDasharray={`${72 * 3.51} 351`} className="text-primary" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <span className="text-3xl font-bold text-primary">72</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-2">Overall Percentile</p>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Top Quartile Metrics</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">6</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Above Median</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Minus className="h-5 w-5 text-amber-600" />
                    <span className="text-2xl font-bold text-amber-600">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Below Median</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">0</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bottom Quartile</p>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-sm text-muted-foreground mb-1">Peer Group</p>
                <p className="font-semibold">Professional Services</p>
                <p className="text-sm text-muted-foreground">$20M - $100M Revenue</p>
                <p className="text-xs text-muted-foreground mt-1">Based on 1,247 companies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kpis">KPI Dashboard</TabsTrigger>
            <TabsTrigger value="peers">Peer Comparison</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Performance Profile
                  </CardTitle>
                  <CardDescription>Multi-dimensional comparison vs industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Your Company" dataKey="yourCompany" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                        <Radar name="Industry Avg" dataKey="industryAvg" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Gross Margin Trend
                  </CardTitle>
                  <CardDescription>Your performance vs industry over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                        <YAxis domain={[30, 55]} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        <Line type="monotone" dataKey="yourCompany" name="Your Company" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                        <Line type="monotone" dataKey="industryAvg" name="Industry Avg" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="topQuartile" name="Top Quartile" stroke="hsl(142, 76%, 36%)" strokeWidth={2} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Key Metrics Comparison
                </CardTitle>
                <CardDescription>How you stack up against industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peerComparisonData} layout="vertical" margin={{ left: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="metric" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Bar dataKey="yourCompany" name="Your Company" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="industryAvg" name="Industry Avg" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="topQuartile" name="Top Quartile" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Dashboard Tab */}
          <TabsContent value="kpis" className="space-y-6">
            {industryKPIs.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {category.kpis.map((kpi) => {
                      const badge = getPerformanceBadge(kpi.percentile);
                      return (
                        <div key={kpi.name} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                            <Badge className={badge.className}>{badge.label}</Badge>
                          </div>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold">{formatValue(kpi.value, kpi.format, kpi.unit)}</span>
                            {kpi.trend === "up" ? (
                              <ChevronUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Benchmark: {formatValue(kpi.benchmark, kpi.format, kpi.unit)}</span>
                              <span className={getPerformanceColor(kpi.percentile)}>{kpi.percentile}th percentile</span>
                            </div>
                            <Progress value={kpi.percentile} className="h-1.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Peer Comparison Tab */}
          <TabsContent value="peers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Peer Group Analysis
                </CardTitle>
                <CardDescription>Anonymous comparison with similar companies in your industry</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Peer Group</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead className="text-right">Operating Margin</TableHead>
                      <TableHead className="text-right">Revenue Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peerCompanies.map((peer) => (
                      <TableRow key={peer.name} className={peer.highlight ? "bg-primary/5 font-medium" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {peer.highlight && <Award className="h-4 w-4 text-primary" />}
                            {peer.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{peer.revenue}</TableCell>
                        <TableCell className="text-right">{peer.employees}</TableCell>
                        <TableCell className="text-right">{peer.margin}</TableCell>
                        <TableCell className="text-right">
                          <span className={peer.highlight ? "text-green-600 font-semibold" : ""}>
                            {peer.growth}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Detailed Metrics Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metric Breakdown</CardTitle>
                <CardDescription>Side-by-side comparison across all benchmarked metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Your Company</TableHead>
                      <TableHead className="text-right">Industry Avg</TableHead>
                      <TableHead className="text-right">Top Quartile</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peerComparisonData.map((row) => {
                      const variance = row.yourCompany - row.industryAvg;
                      const isPositive = row.metric === "Debt-to-Equity" ? variance < 0 : variance > 0;
                      const percentile = ((row.yourCompany - row.industryAvg) / (row.topQuartile - row.industryAvg)) * 25 + 50;
                      const badge = getPerformanceBadge(Math.min(100, Math.max(0, percentile)));
                      
                      return (
                        <TableRow key={row.metric}>
                          <TableCell className="font-medium">{row.metric}</TableCell>
                          <TableCell className="text-right font-semibold">{row.yourCompany}{row.unit}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{row.industryAvg}{row.unit}</TableCell>
                          <TableCell className="text-right text-green-600">{row.topQuartile}{row.unit}</TableCell>
                          <TableCell className="text-right">
                            <span className={isPositive ? "text-green-600" : "text-red-600"}>
                              {isPositive ? "+" : ""}{variance.toFixed(1)}{row.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={badge.className}>{badge.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            {/* Summary of created actions */}
            {createdActions.length > 0 && (
              <Card className="bg-sage/5 border-sage/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-sage" />
                      <div>
                        <p className="font-medium text-sage">{createdActions.length} action{createdActions.length > 1 ? 's' : ''} created from benchmarking gaps</p>
                        <p className="text-sm text-muted-foreground">Track progress in your Action Plan</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/action-plan')}>
                      View Action Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Improvement Opportunities
                </CardTitle>
                <CardDescription>Areas where you can close the gap with top performers. Create tracked action items to address these gaps.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {improvementOpportunities.map((opp) => (
                    <div key={opp.id} className={`p-4 rounded-lg border ${isActionCreated(opp.id) ? 'bg-sage/5 border-sage/20' : 'bg-card'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{opp.area}</h4>
                            <Badge variant={opp.priority === "high" ? "destructive" : "secondary"}>
                              {opp.priority === "high" ? "High Priority" : "Medium Priority"}
                            </Badge>
                            {isActionCreated(opp.id) && (
                              <Badge className="bg-sage/10 text-sage border-sage/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Action Created
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{opp.opportunity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{opp.impact}</p>
                          <p className="text-xs text-muted-foreground">Potential Impact</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="font-medium">{opp.current}{typeof opp.current === "number" && opp.current < 100 ? (opp.area.includes("%") ? "%" : "") : ""}</p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, (opp.current / opp.benchmark) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Benchmark</p>
                          <p className="font-medium text-green-600">{opp.benchmark}{typeof opp.benchmark === "number" && opp.benchmark < 100 ? (opp.area.includes("%") ? "%" : "") : ""}</p>
                        </div>
                        {isActionCreated(opp.id) ? (
                          <Button size="sm" variant="outline" onClick={() => navigate('/action-plan')}>
                            View Action
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleOpenCreateAction(opp)}>
                            Create Action
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  About This Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium">Data Freshness</p>
                    <p className="text-sm text-muted-foreground">Updated quarterly from industry surveys and public filings</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium">Peer Group Size</p>
                    <p className="text-sm text-muted-foreground">1,247 companies in Professional Services, $20M-$100M</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Percent className="h-5 w-5 text-primary mb-2" />
                    <p className="font-medium">Confidence Level</p>
                    <p className="text-sm text-muted-foreground">95% statistical confidence for all benchmarks shown</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        {/* Create Action Dialog */}
        <Dialog open={createActionDialogOpen} onOpenChange={setCreateActionDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Action from Benchmark Gap</DialogTitle>
              <DialogDescription>
                Track this improvement opportunity in your Action Plan
              </DialogDescription>
            </DialogHeader>
            {selectedOpportunity && (
              <div className="space-y-4 py-2">
                {/* Source indicator */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Benchmark Gap:</span>
                    <span className="text-muted-foreground">{selectedOpportunity.area}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>Current: <strong>{selectedOpportunity.current}</strong></span>
                    <span>→</span>
                    <span className="text-green-600">Target: <strong>{selectedOpportunity.benchmark}</strong></span>
                  </div>
                </div>

                <div>
                  <Label>Action Title</Label>
                  <Input 
                    value={actionForm.title}
                    onChange={(e) => setActionForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Owner</Label>
                    <Input 
                      value={actionForm.owner}
                      onChange={(e) => setActionForm(prev => ({ ...prev, owner: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input 
                      type="date" 
                      value={actionForm.dueDate}
                      onChange={(e) => setActionForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Expected Impact</Label>
                  <Input 
                    value={actionForm.impact}
                    onChange={(e) => setActionForm(prev => ({ ...prev, impact: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    value={actionForm.notes}
                    onChange={(e) => setActionForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setCreateActionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAction}>
                    <Target className="h-4 w-4 mr-2" />
                    Create Action
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default IndustryBenchmarking;
