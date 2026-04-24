import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
} from 'lucide-react';
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
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';

// Mock data
const revenueData = [
  { month: 'Sep', revenue: 120000, expenses: 95000, profit: 25000 },
  { month: 'Oct', revenue: 135000, expenses: 102000, profit: 33000 },
  { month: 'Nov', revenue: 128000, expenses: 98000, profit: 30000 },
  { month: 'Dec', revenue: 155000, expenses: 115000, profit: 40000 },
  { month: 'Jan', revenue: 142000, expenses: 108000, profit: 34000 },
  { month: 'Feb', revenue: 168000, expenses: 125000, profit: 43000 },
];

const expenseBreakdown = [
  { name: 'Payroll', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Operations', value: 20, color: 'hsl(var(--gold))' },
  { name: 'Marketing', value: 15, color: 'hsl(var(--sage))' },
  { name: 'Software', value: 12, color: 'hsl(var(--navy-light))' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted-foreground))' },
];

const recommendations = [
  {
    id: 'payroll-up-22-qoq',
    priority: 'high',
    title: 'Payroll up 22% QoQ',
    description: 'Labor costs growing faster than revenue. Consider reducing overtime hours.',
    action: 'Cut overtime by 15%',
    impact: '$28k/mo savings',
    icon: AlertCircle,
  },
  {
    id: 'marketing-roi-declining',
    priority: 'medium',
    title: 'Marketing ROI declining',
    description: 'Q1 marketing spend up 30% but leads only up 12%.',
    action: 'Pause low-ROI campaigns',
    impact: '3% margin lift',
    icon: Lightbulb,
  },
  {
    id: 'vendor-consolidation',
    priority: 'medium',
    title: 'Vendor consolidation opportunity',
    description: '3 overlapping software subscriptions identified.',
    action: 'Consolidate vendors',
    impact: '$4.2k/mo savings',
    icon: Lightbulb,
  },
  {
    id: 'revenue-per-employee',
    priority: 'low',
    title: 'Revenue per employee below benchmark',
    description: 'Current $187k vs industry $215k average.',
    action: 'Evaluate headcount efficiency',
    impact: 'Long-term growth',
    icon: TrendingUp,
  },
];

const kpis = [
  { label: 'Revenue', value: '$1.47M', change: '+14%', trend: 'up' },
  { label: 'Net Profit', value: '$215k', change: '+8%', trend: 'up' },
  { label: 'Gross Margin', value: '47%', change: '+2%', trend: 'up' },
  { label: 'Operating Margin', value: '14.6%', change: '-1.2%', trend: 'down' },
];

export default function CFOAnalysis() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI CFO Analysis</h1>
            <p className="text-muted-foreground">Q1 2026 Financial Performance Review</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
              Demo Mode
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-gold mb-2">82</div>
                <div className="text-sm text-primary-foreground/70">Health Score</div>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="h-4 w-4 text-sage" />
                  <span className="text-sm">Good Standing</span>
                </div>
              </div>
              <div className="flex-1 md:border-l md:border-primary-foreground/20 md:pl-6">
                <h3 className="font-bold text-gold mb-2">Executive Summary</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  Revenue grew 14% quarter-over-quarter, driven by strong performance in your core service lines. 
                  However, payroll expenses increased 22%, outpacing revenue growth and putting pressure on operating margins. 
                  Cash position remains healthy at 4.2 months runway. Recommend addressing labor cost efficiency as top priority.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{kpi.label}</div>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trend === 'up' ? 'text-sage' : 'text-destructive'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {kpi.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LineChart className="h-5 w-5 text-gold" />
                Revenue & Profit Trends
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                6-month comparison showing revenue growth of 40% and expense increases tracking closely. February showed strongest performance with $168k revenue.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${(value/1000).toFixed(0)}k`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--sage))" fill="hsl(var(--sage))" fillOpacity={0.3} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.3} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5 text-gold" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {expenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-gold" />
              AI Recommendations
            </CardTitle>
            <Link to="/action-plan">
              <Button variant="gold" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Create Action Plan
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Link
                  key={index}
                  to={`/cfo/recommendation/${rec.id}`}
                  className={`block p-4 rounded-lg border transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer ${
                    rec.priority === 'high'
                      ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
                      : rec.priority === 'medium'
                      ? 'border-gold/30 bg-gold/5 hover:border-gold/50'
                      : 'border-border bg-muted/30 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high'
                        ? 'bg-destructive/10 text-destructive'
                        : rec.priority === 'medium'
                        ? 'bg-gold/10 text-gold'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <rec.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-foreground">
                            <strong>Action:</strong> {rec.action}
                          </span>
                          <span className="text-sage font-medium">→ {rec.impact}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
