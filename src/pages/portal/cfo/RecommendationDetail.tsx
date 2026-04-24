import { useParams, Link, useNavigate } from 'react-router-dom';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Zap,
} from 'lucide-react';

// Extended recommendation data with detailed explanations
const recommendationsData: Record<string, {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  icon: typeof AlertCircle;
  // Detailed analysis
  what: {
    summary: string;
    keyFindings: string[];
    dataPoints: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  };
  when: {
    identified: string;
    timeframe: string;
    urgency: string;
    timeline: { phase: string; duration: string; description: string }[];
  };
  how: {
    methodology: string;
    steps: { step: number; title: string; description: string }[];
    expectedOutcomes: string[];
    risks: string[];
    successMetrics: { metric: string; current: string; target: string }[];
  };
}> = {
  'payroll-up-22-qoq': {
    priority: 'high',
    title: 'Payroll up 22% QoQ',
    description: 'Labor costs growing faster than revenue. Consider reducing overtime hours.',
    action: 'Cut overtime by 15%',
    impact: '$28k/mo savings',
    icon: AlertCircle,
    what: {
      summary: 'Our AI analysis detected that your payroll expenses increased by 22% quarter-over-quarter, significantly outpacing your 14% revenue growth. This divergence is creating margin compression and could threaten profitability if left unaddressed.',
      keyFindings: [
        'Total payroll increased from $412,000 to $502,680 (+$90,680)',
        'Overtime hours increased 47% while regular hours only increased 12%',
        'New hires in Q1: 3 employees added, but productivity metrics declined 8%',
        '68% of overtime concentrated in Operations and Customer Support departments',
        'Average overtime per employee: 12.4 hours/week (industry benchmark: 6.2 hours/week)',
      ],
      dataPoints: [
        { label: 'Q4 Payroll', value: '$412,000', trend: 'neutral' },
        { label: 'Q1 Payroll', value: '$502,680', trend: 'up' },
        { label: 'QoQ Change', value: '+22%', trend: 'up' },
        { label: 'Revenue Growth', value: '+14%', trend: 'up' },
        { label: 'Margin Impact', value: '-1.2%', trend: 'down' },
      ],
    },
    when: {
      identified: 'January 15, 2026',
      timeframe: 'Q1 2026 Analysis Period',
      urgency: 'Immediate action recommended within 30 days to prevent further margin erosion',
      timeline: [
        { phase: 'Phase 1: Assessment', duration: 'Week 1-2', description: 'Audit current overtime patterns and identify root causes' },
        { phase: 'Phase 2: Policy Update', duration: 'Week 3', description: 'Implement overtime approval workflow and caps' },
        { phase: 'Phase 3: Execution', duration: 'Week 4-8', description: 'Monitor and enforce new overtime policies' },
        { phase: 'Phase 4: Review', duration: 'Week 12', description: 'Evaluate savings and adjust approach as needed' },
      ],
    },
    how: {
      methodology: 'Our AI analyzed 6 months of payroll data, comparing it against revenue trends, industry benchmarks, and historical patterns. We used machine learning to identify anomalies and predict future trends.',
      steps: [
        { step: 1, title: 'Audit Overtime by Department', description: 'Review the detailed breakdown of overtime hours by department and role to identify the primary drivers of increased labor costs.' },
        { step: 2, title: 'Implement Approval Workflow', description: 'Require manager approval for any overtime exceeding 5 hours per week per employee. Set up alerts for departments approaching overtime budgets.' },
        { step: 3, title: 'Cross-Train Employees', description: 'Identify skill gaps causing overtime bottlenecks. Invest in cross-training to distribute workload more evenly across the team.' },
        { step: 4, title: 'Evaluate Staffing Needs', description: 'Analyze whether adding 1-2 part-time employees could reduce overtime costs while maintaining productivity.' },
        { step: 5, title: 'Monitor Weekly Metrics', description: 'Track overtime hours weekly and review in management meetings to ensure compliance with new targets.' },
      ],
      expectedOutcomes: [
        'Reduce monthly payroll by approximately $28,000',
        'Improve operating margin by 1.5-2%',
        'Reduce employee burnout and improve retention',
        'Better workload distribution across teams',
      ],
      risks: [
        'Initial productivity dip during transition period',
        'Potential employee pushback on reduced overtime pay',
        'May require temporary contractor support during adjustment',
      ],
      successMetrics: [
        { metric: 'Monthly Overtime Hours', current: '1,240 hrs', target: '650 hrs' },
        { metric: 'Payroll as % of Revenue', current: '45%', target: '38%' },
        { metric: 'Operating Margin', current: '14.6%', target: '16.5%' },
      ],
    },
  },
  'marketing-roi-declining': {
    priority: 'medium',
    title: 'Marketing ROI declining',
    description: 'Q1 marketing spend up 30% but leads only up 12%.',
    action: 'Pause low-ROI campaigns',
    impact: '3% margin lift',
    icon: Lightbulb,
    what: {
      summary: 'Marketing efficiency has declined significantly in Q1 2026. While marketing spend increased by 30%, lead generation only improved by 12%, indicating diminishing returns on advertising investments.',
      keyFindings: [
        'Marketing spend increased from $45,000/mo to $58,500/mo',
        'Cost per lead rose from $127 to $186 (+46%)',
        'Google Ads performance declined 28% while spend increased 35%',
        'Social media campaigns showing negative ROI on 3 of 5 platforms',
        'Email marketing maintaining 340% ROI (best performing channel)',
      ],
      dataPoints: [
        { label: 'Q4 Marketing Spend', value: '$45,000/mo', trend: 'neutral' },
        { label: 'Q1 Marketing Spend', value: '$58,500/mo', trend: 'up' },
        { label: 'Lead Growth', value: '+12%', trend: 'up' },
        { label: 'Cost per Lead', value: '$186', trend: 'up' },
        { label: 'Conversion Rate', value: '2.1%', trend: 'down' },
      ],
    },
    when: {
      identified: 'January 22, 2026',
      timeframe: 'Q4 2025 - Q1 2026 Comparison',
      urgency: 'Address within 45 days to optimize Q2 marketing budget allocation',
      timeline: [
        { phase: 'Phase 1: Campaign Audit', duration: 'Week 1', description: 'Review all active campaigns and calculate individual ROI' },
        { phase: 'Phase 2: Pause & Reallocate', duration: 'Week 2', description: 'Pause underperforming campaigns and redirect budget' },
        { phase: 'Phase 3: Optimize', duration: 'Week 3-6', description: 'A/B test new approaches on high-performing channels' },
        { phase: 'Phase 4: Scale Winners', duration: 'Week 7-12', description: 'Double down on campaigns showing positive ROI' },
      ],
    },
    how: {
      methodology: 'AI analyzed marketing attribution data across all channels, comparing spend-to-lead ratios, customer acquisition costs, and lifetime value predictions.',
      steps: [
        { step: 1, title: 'Pause Low-Performing Campaigns', description: 'Immediately pause campaigns with negative or break-even ROI, including specific Google Ads campaigns and underperforming social ads.' },
        { step: 2, title: 'Reallocate to Email Marketing', description: 'Shift 40% of freed budget to email marketing campaigns, which show the highest ROI at 340%.' },
        { step: 3, title: 'Optimize Landing Pages', description: 'Current landing page conversion is 2.1%. A/B test new designs to target 3.5% conversion rate.' },
        { step: 4, title: 'Implement Better Attribution', description: 'Set up multi-touch attribution to better understand the customer journey and optimize spend accordingly.' },
      ],
      expectedOutcomes: [
        'Reduce marketing spend by $17,550/mo while maintaining lead volume',
        'Improve cost per lead from $186 to under $130',
        'Increase overall marketing ROI by 45%',
        'Better visibility into channel performance',
      ],
      risks: [
        'Short-term lead volume may dip by 5-10%',
        'Brand awareness metrics may decline temporarily',
        'Requires 6-8 weeks to see full impact',
      ],
      successMetrics: [
        { metric: 'Cost per Lead', current: '$186', target: '$125' },
        { metric: 'Marketing ROI', current: '180%', target: '280%' },
        { metric: 'Conversion Rate', current: '2.1%', target: '3.5%' },
      ],
    },
  },
  'vendor-consolidation': {
    priority: 'medium',
    title: 'Vendor consolidation opportunity',
    description: '3 overlapping software subscriptions identified.',
    action: 'Consolidate vendors',
    impact: '$4.2k/mo savings',
    icon: Lightbulb,
    what: {
      summary: 'Our AI detected redundant software subscriptions across your organization. Three separate tools are providing overlapping functionality, creating unnecessary costs and workflow inefficiencies.',
      keyFindings: [
        'Duplicate project management tools: Asana ($800/mo) and Monday.com ($650/mo)',
        'Overlapping CRM capabilities: HubSpot ($1,200/mo) duplicating Salesforce features',
        'Two separate analytics platforms with 70% feature overlap',
        'Average employee uses only 2.3 of 7 available tools regularly',
        'IT support tickets related to tool confusion: 23% of all tickets',
      ],
      dataPoints: [
        { label: 'Current SaaS Spend', value: '$12,400/mo', trend: 'neutral' },
        { label: 'Overlapping Tools', value: '3 pairs', trend: 'neutral' },
        { label: 'Potential Savings', value: '$4,200/mo', trend: 'neutral' },
        { label: 'Tool Utilization', value: '34%', trend: 'down' },
        { label: 'IT Tickets (Tool Issues)', value: '23%', trend: 'up' },
      ],
    },
    when: {
      identified: 'January 18, 2026',
      timeframe: 'Annual software audit',
      urgency: 'Moderate - align with contract renewal dates for maximum savings',
      timeline: [
        { phase: 'Phase 1: Usage Audit', duration: 'Week 1-2', description: 'Analyze actual usage patterns for all software tools' },
        { phase: 'Phase 2: Vendor Negotiations', duration: 'Week 3-4', description: 'Negotiate better rates or prepare for cancellation' },
        { phase: 'Phase 3: Migration Planning', duration: 'Week 5-6', description: 'Create migration plan for consolidated tools' },
        { phase: 'Phase 4: Implementation', duration: 'Week 7-12', description: 'Execute migration and train employees on consolidated stack' },
      ],
    },
    how: {
      methodology: 'AI analyzed software usage data, login frequencies, feature utilization, and cross-referenced with billing data to identify redundancies.',
      steps: [
        { step: 1, title: 'Survey Team Preferences', description: 'Gather input from teams on which tools they prefer and why to ensure smooth transition.' },
        { step: 2, title: 'Map Feature Requirements', description: 'Document all required features and ensure the retained tool covers 100% of critical needs.' },
        { step: 3, title: 'Negotiate with Vendors', description: 'Use the consolidation as leverage to negotiate 15-20% better rates with retained vendors.' },
        { step: 4, title: 'Execute Migration', description: 'Migrate data, update workflows, and train team members on the consolidated tool stack.' },
      ],
      expectedOutcomes: [
        'Save $4,200/month ($50,400/year) in subscription costs',
        'Reduce IT support tickets by 15-20%',
        'Improve workflow efficiency by eliminating context switching',
        'Better data consolidation and reporting',
      ],
      risks: [
        'Employee resistance to changing familiar tools',
        'Data migration complexity and potential data loss',
        'Short-term productivity impact during transition',
      ],
      successMetrics: [
        { metric: 'Monthly SaaS Spend', current: '$12,400', target: '$8,200' },
        { metric: 'Tool Utilization Rate', current: '34%', target: '75%' },
        { metric: 'IT Support Tickets', current: '23%', target: '10%' },
      ],
    },
  },
  'revenue-per-employee': {
    priority: 'low',
    title: 'Revenue per employee below benchmark',
    description: 'Current $187k vs industry $215k average.',
    action: 'Evaluate headcount efficiency',
    impact: 'Long-term growth',
    icon: TrendingUp,
    what: {
      summary: 'Your revenue per employee ($187,000) is 13% below the industry benchmark of $215,000. While not immediately critical, addressing this gap could unlock significant growth potential.',
      keyFindings: [
        'Current headcount: 43 employees generating $8.04M annual revenue',
        'Industry benchmark suggests same revenue achievable with 37 employees',
        'Productivity has declined 8% since Q3 2025',
        'Training investment per employee: $1,200 vs industry average $2,800',
        'Tool and automation adoption rate: 45% vs industry 72%',
      ],
      dataPoints: [
        { label: 'Revenue/Employee', value: '$187,000', trend: 'neutral' },
        { label: 'Industry Benchmark', value: '$215,000', trend: 'neutral' },
        { label: 'Gap to Benchmark', value: '-13%', trend: 'down' },
        { label: 'Current Headcount', value: '43', trend: 'neutral' },
        { label: 'Productivity Trend', value: '-8%', trend: 'down' },
      ],
    },
    when: {
      identified: 'January 25, 2026',
      timeframe: 'Long-term strategic initiative',
      urgency: 'Low - implement over 6-12 months as part of growth strategy',
      timeline: [
        { phase: 'Phase 1: Assessment', duration: 'Month 1', description: 'Analyze productivity by department and role' },
        { phase: 'Phase 2: Training Program', duration: 'Month 2-3', description: 'Implement enhanced training and upskilling' },
        { phase: 'Phase 3: Process Automation', duration: 'Month 4-6', description: 'Identify and automate repetitive tasks' },
        { phase: 'Phase 4: Optimization', duration: 'Month 7-12', description: 'Continuous improvement and metric tracking' },
      ],
    },
    how: {
      methodology: 'AI benchmarked your metrics against 500+ similar companies in your industry, analyzing revenue, headcount, and productivity patterns.',
      steps: [
        { step: 1, title: 'Productivity Analysis', description: 'Conduct a detailed analysis of productivity by department to identify underperforming areas.' },
        { step: 2, title: 'Invest in Training', description: 'Increase training budget to industry standard ($2,800/employee) focusing on high-impact skills.' },
        { step: 3, title: 'Implement Automation', description: 'Identify 10-15 repetitive processes that can be automated to free up employee time for higher-value work.' },
        { step: 4, title: 'Strategic Hiring', description: 'Focus future hiring on roles that directly drive revenue rather than support functions.' },
      ],
      expectedOutcomes: [
        'Increase revenue per employee to $205,000+ within 12 months',
        'Improve overall productivity by 15-20%',
        'Reduce time spent on repetitive tasks by 30%',
        'Better position company for scalable growth',
      ],
      risks: [
        'Automation investments require upfront capital',
        'Training takes 3-6 months to show productivity gains',
        'May uncover need for difficult personnel decisions',
      ],
      successMetrics: [
        { metric: 'Revenue/Employee', current: '$187,000', target: '$205,000' },
        { metric: 'Training Investment', current: '$1,200', target: '$2,800' },
        { metric: 'Automation Rate', current: '45%', target: '70%' },
      ],
    },
  },
};

export default function RecommendationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const recommendation = id ? recommendationsData[id] : null;
  
  if (!recommendation) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Recommendation Not Found</h1>
          <Button onClick={() => navigate('/cfo/analysis')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </PortalLayout>
    );
  }

  const IconComponent = recommendation.icon;

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/cfo/analysis')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title Card */}
        <Card className={`border-2 ${
          recommendation.priority === 'high'
            ? 'border-destructive/50 bg-destructive/5'
            : recommendation.priority === 'medium'
            ? 'border-gold/50 bg-gold/5'
            : 'border-border bg-muted/30'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                recommendation.priority === 'high'
                  ? 'bg-destructive/10 text-destructive'
                  : recommendation.priority === 'medium'
                  ? 'bg-gold/10 text-gold'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{recommendation.title}</h1>
                  <Badge 
                    variant={recommendation.priority === 'high' ? 'destructive' : recommendation.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-sm"
                  >
                    {recommendation.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">{recommendation.description}</p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span><strong>Action:</strong> {recommendation.action}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{recommendation.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              What We Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{recommendation.what.summary}</p>
            
            {/* Key Findings */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold" />
                Key Findings
              </h4>
              <ul className="space-y-2">
                {recommendation.what.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Data Points */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gold" />
                Data Points
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {recommendation.what.dataPoints.map((point, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{point.label}</div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      {point.value}
                      {point.trend === 'up' && <TrendingUp className="h-4 w-4 text-sage" />}
                      {point.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              When & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Identified</div>
                <div className="font-semibold">{recommendation.when.identified}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Analysis Period</div>
                <div className="font-semibold">{recommendation.when.timeframe}</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="text-xs text-primary mb-1">Urgency</div>
                <div className="font-semibold text-sm">{recommendation.when.urgency}</div>
              </div>
            </div>

            <Separator />

            {/* Implementation Timeline */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" />
                Implementation Timeline
              </h4>
              <div className="space-y-4">
                {recommendation.when.timeline.map((phase, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      {index < recommendation.when.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{phase.phase}</h5>
                        <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gold" />
              How to Implement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-gold" />
                Methodology
              </h4>
              <p className="text-sm text-muted-foreground">{recommendation.how.methodology}</p>
            </div>

            <Separator />

            {/* Action Steps */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" />
                Action Steps
              </h4>
              <div className="space-y-4">
                {recommendation.how.steps.map((step) => (
                  <div key={step.step} className="bg-background border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h5 className="font-semibold mb-1">{step.title}</h5>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Expected Outcomes & Risks */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sage">
                  <CheckCircle2 className="h-4 w-4" />
                  Expected Outcomes
                </h4>
                <ul className="space-y-2">
                  {recommendation.how.expectedOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-sage mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Potential Risks
                </h4>
                <ul className="space-y-2">
                  {recommendation.how.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator />

            {/* Success Metrics */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gold" />
                Success Metrics
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendation.how.successMetrics.map((metric, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2">{metric.metric}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="font-semibold text-destructive">{metric.current}</div>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Target</div>
                        <div className="font-semibold text-sage">{metric.target}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/cfo/analysis')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
          <Link to="/action-plan">
            <Button variant="gold">
              <Target className="h-4 w-4 mr-2" />
              Add to Action Plan
            </Button>
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
