import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link, useNavigate } from 'react-router-dom';
import { mockCompanyData } from '@/data/mockCompanyData';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  FileSpreadsheet,
  Target,
  BarChart3,
  Briefcase,
  Wallet,
  Calculator,
  BarChart2,
  FileText,
  Sparkles,
} from 'lucide-react';

// Mock data for demo
const mockDashboardData = {
  healthScore: 82,
  healthStatus: 'Good',
  quarter: 'Q1 2026',
  executiveSummary: 'Payroll rising faster than revenue. Cash position remains healthy.',
  kpis: [
    { label: 'Revenue', value: '$1.47M', change: '+14%', trend: 'up', status: 'good' },
    { label: 'Labor Cost', value: '38%', change: '+3%', trend: 'up', status: 'warning' },
    { label: 'Gross Margin', value: '47%', change: '+2%', trend: 'up', status: 'good' },
    { label: 'Cash Runway', value: '4.2 mo', change: '-0.3', trend: 'down', status: 'good' },
    { label: 'Rev/Employee', value: '$187k', change: '+5%', trend: 'up', status: 'good' },
    { label: 'Payroll Tax', value: '8.2%', change: '0%', trend: 'flat', status: 'good' },
  ],
  quickActions: [
    { icon: FileSpreadsheet, label: '1 GL file pending', link: '/cfo/upload', urgent: true },
    { icon: Briefcase, label: 'Q1 Payroll needed', link: '/payroll/upload', urgent: true },
    { icon: Target, label: '3 actions due this week', link: '/action-plan', urgent: false },
  ],
  actionPlanProgress: {
    completed: 2,
    total: 5,
  },
};

interface OnboardingProgress {
  companyCompleted: boolean;
  glCompleted: boolean;
  payrollCompleted: boolean;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null);
  const hasShownCompletionToast = useRef(false);

  const companyName = profile?.company_name || mockCompanyData.companyName;
  const companyEIN = mockCompanyData.ein;

  // Check onboarding progress
  useEffect(() => {
    const checkOnboardingProgress = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_company_completed, onboarding_gl_completed, onboarding_payroll_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setOnboardingProgress({
          companyCompleted: data.onboarding_company_completed || false,
          glCompleted: data.onboarding_gl_completed || false,
          payrollCompleted: data.onboarding_payroll_completed || false,
        });
      }
    };

    checkOnboardingProgress();
  }, [user?.id]);

  const isOnboardingComplete = onboardingProgress && 
    onboardingProgress.companyCompleted && onboardingProgress.glCompleted && onboardingProgress.payrollCompleted;

  const isOnboardingIncomplete = onboardingProgress && !isOnboardingComplete;

  const completedSteps = onboardingProgress 
    ? [onboardingProgress.companyCompleted, onboardingProgress.glCompleted, onboardingProgress.payrollCompleted].filter(Boolean).length 
    : 0;

  // Show congratulations toast when onboarding is complete
  useEffect(() => {
    if (isOnboardingComplete && !hasShownCompletionToast.current) {
      hasShownCompletionToast.current = true;
      toast({
        title: "🎉 Setup Complete!",
        description: "Congratulations! You've unlocked all features. Your TauBridge dashboard is ready.",
      });
    }
  }, [isOnboardingComplete, toast]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Resume Setup Banner */}
        {isOnboardingIncomplete && (
          <Card className="border-gold/50 bg-gradient-to-r from-gold/10 to-gold/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gold/20">
                    <Sparkles className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Complete your setup</p>
                    <p className="text-sm text-muted-foreground">
                      {completedSteps}/3 steps completed — finish to unlock all features
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="bg-gold text-primary-foreground hover:bg-gold/90"
                >
                  Resume Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3">
                <Progress value={(completedSteps / 3) * 100} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Mode Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome, {companyName}
            </h1>
            <p className="text-muted-foreground">
              EIN: {companyEIN} • Your financial overview at a glance
            </p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Executive Summary Card */}
        <Card className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold">{mockDashboardData.healthScore}</div>
                  <div className="text-sm text-primary-foreground/70">Health Score</div>
                </div>
                <div className="h-12 w-px bg-primary-foreground/20" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5 text-sage" />
                    <span className="font-medium">{mockDashboardData.healthStatus}</span>
                    <span className="text-primary-foreground/70">| {mockDashboardData.quarter}</span>
                  </div>
                  <p className="text-primary-foreground/80 text-sm max-w-md">
                    "{mockDashboardData.executiveSummary}"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary-foreground/70">Action Plan:</span>
                <span className="font-medium">{mockDashboardData.actionPlanProgress.completed}/{mockDashboardData.actionPlanProgress.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockDashboardData.kpis.map((kpi) => (
            <Card key={kpi.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  {kpi.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-gold" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-sage" />
                  )}
                </div>
                <div className="text-xl font-bold">{kpi.value}</div>
                <div className={`flex items-center gap-1 text-xs ${
                  kpi.trend === 'up' ? 'text-sage' : kpi.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : kpi.trend === 'down' ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {kpi.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {mockDashboardData.quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.urgent ? 'bg-gold/10 text-gold' : 'bg-muted text-muted-foreground'}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/cfo/analysis">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-gold/10 text-gold mb-4 group-hover:bg-gold group-hover:text-primary-foreground transition-colors">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">AI CFO Analysis</h3>
                <p className="text-sm text-muted-foreground">View insights</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cfo/reports">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-rose-500/10 text-rose-600 mb-4 group-hover:bg-rose-500 group-hover:text-primary-foreground transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Board Reports</h3>
                <p className="text-sm text-muted-foreground">Investor-ready docs</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cfo/cash-flow">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 mb-4 group-hover:bg-emerald-500 group-hover:text-primary-foreground transition-colors">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Cash Flow</h3>
                <p className="text-sm text-muted-foreground">Forecast & optimize</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cfo/budget-planning">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-violet-500/10 text-violet-600 mb-4 group-hover:bg-violet-500 group-hover:text-primary-foreground transition-colors">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Budget & Planning</h3>
                <p className="text-sm text-muted-foreground">Build & reforecast</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/payroll/dashboard">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">PayrollTax Pro</h3>
                <p className="text-sm text-muted-foreground">Manage payroll & taxes</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cfo/upload">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-sage/10 text-sage mb-4 group-hover:bg-sage group-hover:text-primary-foreground transition-colors">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Upload GL Data</h3>
                <p className="text-sm text-muted-foreground">Import financial data</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cfo/benchmarking">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-600 mb-4 group-hover:bg-cyan-500 group-hover:text-primary-foreground transition-colors">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Benchmarking</h3>
                <p className="text-sm text-muted-foreground">Peer comparisons</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/action-plan">
            <Card className="hover:border-gold hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-4 group-hover:bg-destructive group-hover:text-primary-foreground transition-colors">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Action Plan</h3>
                <p className="text-sm text-muted-foreground">Track priority actions</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
