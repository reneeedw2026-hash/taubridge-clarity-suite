import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  DollarSign,
  FileSpreadsheet,
  Settings,
  BarChart3,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Briefcase,
} from 'lucide-react';
import taubridgeLogo from '@/assets/taubridge-logo.png';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
}

const revenueRanges = [
  { value: 'under-500k', label: 'Under $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m-10m', label: '$5M - $10M' },
  { value: '10m-25m', label: '$10M - $25M' },
  { value: '25m-50m', label: '$25M - $50M' },
  { value: 'over-50m', label: 'Over $50M' },
];

const employeeRanges = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '101-250', label: '101-250 employees' },
  { value: '251-500', label: '251-500 employees' },
  { value: 'over-500', label: '500+ employees' },
];

const industries = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'construction', label: 'Construction & Real Estate' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'education', label: 'Education' },
  { value: 'nonprofit', label: 'Nonprofit & Government' },
  { value: 'other', label: 'Other' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, refreshProfile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  // Form state
  const [companyName, setCompanyName] = useState(profile?.company_name || '');
  const [revenueRange, setRevenueRange] = useState(profile?.revenue_range || '');
  const [employeeCount, setEmployeeCount] = useState(profile?.employee_count?.toString() || '');
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Step completion tracking
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({
    'company-profile': false,
    'gl-upload': false,
    'payroll-config': false,
    'first-analysis': false,
    'clarity-call': false,
  });

  // Load step completion from database on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) {
        setIsLoadingProgress(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_company_completed, onboarding_gl_completed, onboarding_payroll_completed, company_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setStepsCompleted(prev => ({
            ...prev,
            'company-profile': data.onboarding_company_completed || !!data.company_name,
            'gl-upload': data.onboarding_gl_completed || false,
            'payroll-config': data.onboarding_payroll_completed || false,
          }));
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  // Handle returning from GL or Payroll pages - persist to database and show toast
  useEffect(() => {
    const returnFrom = searchParams.get('return_from');
    if (!returnFrom || !user?.id) return;

    const persistAndNotify = async () => {
      if (returnFrom === 'gl') {
        setCurrentStep(2);
        setStepsCompleted(prev => ({ ...prev, 'gl-upload': true }));
        
        await supabase
          .from('profiles')
          .update({ onboarding_gl_completed: true })
          .eq('user_id', user.id);
        
        toast.success('GL data upload step completed!', {
          description: 'Your progress has been saved.',
        });
      } else if (returnFrom === 'payroll') {
        setCurrentStep(2);
        setStepsCompleted(prev => ({ ...prev, 'payroll-config': true }));
        
        await supabase
          .from('profiles')
          .update({ onboarding_payroll_completed: true })
          .eq('user_id', user.id);
        
        toast.success('Payroll configuration step completed!', {
          description: 'Your progress has been saved.',
        });
      }
    };

    persistAndNotify();
  }, [searchParams, user?.id]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to TauBridge',
      description: 'Let\'s get your account set up in just a few minutes',
      icon: Sparkles,
      completed: true,
    },
    {
      id: 'company-profile',
      title: 'Company Profile',
      description: 'Tell us about your business',
      icon: Building2,
      completed: stepsCompleted['company-profile'],
    },
    {
      id: 'data-sources',
      title: 'Connect Data Sources',
      description: 'Set up your financial data connections',
      icon: FileSpreadsheet,
      completed: stepsCompleted['gl-upload'] && stepsCompleted['payroll-config'],
    },
    {
      id: 'next-steps',
      title: 'Your Next Steps',
      description: 'Get started with your first analysis',
      icon: BarChart3,
      completed: stepsCompleted['first-analysis'],
    },
  ];

  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const handleSaveCompanyProfile = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter your company name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const employeeNum = selectedEmployeeRange ? 
        parseInt(selectedEmployeeRange.split('-')[0]) : 
        parseInt(employeeCount) || null;

      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: companyName,
          revenue_range: revenueRange,
          employee_count: employeeNum,
          industry: industry || null,
          onboarding_company_completed: true,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setStepsCompleted(prev => ({ ...prev, 'company-profile': true }));
      await refreshProfile();
      toast.success('Company profile saved!');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user?.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Welcome aboard! Let\'s get started.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipToLater = async () => {
    setStepsCompleted(prev => ({ ...prev, 'gl-upload': true, 'payroll-config': true }));
    
    // Persist skip to database
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ 
          onboarding_gl_completed: true, 
          onboarding_payroll_completed: true 
        })
        .eq('user_id', user.id);
    }
    
    setCurrentStep(3);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gold/10">
          <Sparkles className="h-12 w-12 text-gold" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Welcome to TauBridge{profile?.email ? `, ${profile.email.split('@')[0]}` : ''}!
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Your AI-powered financial clarity platform. Complete your setup to unlock powerful insights for your business.
        </p>
      </div>

      <div className="grid gap-4 max-w-lg mx-auto">
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card text-left">
          <div className="p-2 rounded-lg bg-sage/10">
            <Building2 className="h-5 w-5 text-sage" />
          </div>
          <div>
            <p className="font-medium">Set up your company profile</p>
            <p className="text-sm text-muted-foreground">Basic information about your business</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card text-left">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Connect your financial data</p>
            <p className="text-sm text-muted-foreground">Upload GL data and configure payroll</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card text-left">
          <div className="p-2 rounded-lg bg-gold/10">
            <BarChart3 className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium">Get your first analysis</p>
            <p className="text-sm text-muted-foreground">AI-powered insights in minutes</p>
          </div>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={() => setCurrentStep(1)}
        className="bg-gold text-primary-foreground hover:bg-gold/90"
      >
        Let's Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );

  const renderCompanyProfileStep = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-sage/10">
          <Building2 className="h-8 w-8 text-sage" />
        </div>
        <h2 className="text-2xl font-bold">Company Profile</h2>
        <p className="text-muted-foreground">Tell us about your business to personalize your experience</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenueRange">Annual Revenue</Label>
          <Select value={revenueRange} onValueChange={setRevenueRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeCount">Number of Employees</Label>
          <Select value={selectedEmployeeRange} onValueChange={setSelectedEmployeeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee range" />
            </SelectTrigger>
            <SelectContent>
              {employeeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Used for industry benchmarking comparisons</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(0)} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleSaveCompanyProfile} 
          disabled={isSubmitting}
          className="flex-1 bg-gold text-primary-foreground hover:bg-gold/90"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDataSourcesStep = () => (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10">
          <FileSpreadsheet className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Connect Your Data</h2>
        <p className="text-muted-foreground">Set up your financial data sources to enable powerful insights</p>
      </div>

      <div className="space-y-4">
        <Card 
          className={`cursor-pointer transition-all hover:border-gold ${stepsCompleted['gl-upload'] ? 'border-sage bg-sage/5' : ''}`}
          onClick={() => navigate('/cfo/upload?from=onboarding')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stepsCompleted['gl-upload'] ? 'bg-sage/10' : 'bg-muted'}`}>
                  <Upload className={`h-5 w-5 ${stepsCompleted['gl-upload'] ? 'text-sage' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-medium">Upload GL Data</p>
                  <p className="text-sm text-muted-foreground">Import your General Ledger files</p>
                </div>
              </div>
              {stepsCompleted['gl-upload'] ? (
                <CheckCircle className="h-5 w-5 text-sage" />
              ) : (
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-gold ${stepsCompleted['payroll-config'] ? 'border-sage bg-sage/5' : ''}`}
          onClick={() => navigate('/payroll/settings?from=onboarding')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stepsCompleted['payroll-config'] ? 'bg-sage/10' : 'bg-muted'}`}>
                  <Settings className={`h-5 w-5 ${stepsCompleted['payroll-config'] ? 'text-sage' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-medium">Configure Payroll</p>
                  <p className="text-sm text-muted-foreground">Set up payroll tax settings</p>
                </div>
              </div>
              {stepsCompleted['payroll-config'] ? (
                <CheckCircle className="h-5 w-5 text-sage" />
              ) : (
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Don't have your data ready? No problem!
        </p>
        <p className="text-sm text-muted-foreground">
          You can skip this step and explore with our demo data.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          variant="outline"
          onClick={handleSkipToLater}
          className="flex-1"
        >
          Skip for Now
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)}
          disabled={!stepsCompleted['gl-upload'] && !stepsCompleted['payroll-config']}
          className="flex-1 bg-gold text-primary-foreground hover:bg-gold/90"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderNextStepsStep = () => (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gold/10">
          <CheckCircle className="h-8 w-8 text-gold" />
        </div>
        <h2 className="text-2xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground">Here's what to do next to get the most from TauBridge</p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Your Monthly Workflow</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-sm font-bold">1</div>
              <span>Upload GL data at month end</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-sm font-bold">2</div>
              <span>Upload payroll data</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-sm font-bold">3</div>
              <span>Review AI analysis & action items</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-center">Recommended First Steps</h3>
        
        <Card 
          className="cursor-pointer transition-all hover:border-gold"
          onClick={() => navigate('/cfo/analysis')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gold/10">
                  <BarChart3 className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">Generate First Analysis</p>
                  <p className="text-sm text-muted-foreground">See AI-powered insights for your business</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:border-gold"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-sage/10">
                  <Calendar className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="font-medium">Book Financial Clarity Call</p>
                  <p className="text-sm text-muted-foreground">Schedule a call with our CFO team</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleCompleteOnboarding}
          disabled={isSubmitting}
          className="flex-1 bg-gold text-primary-foreground hover:bg-gold/90"
        >
          {isSubmitting ? 'Completing...' : 'Go to Dashboard'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeStep();
      case 1:
        return renderCompanyProfileStep();
      case 2:
        return renderDataSourcesStep();
      case 3:
        return renderNextStepsStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={taubridgeLogo} alt="TauBridge" className="h-8 w-auto" />
            <span className="font-semibold text-xl">TauBridge</span>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Setup Wizard
          </Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium">
              {steps[currentStep]?.title}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center gap-1 ${
                  index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < currentStep ? 'bg-sage text-white' : 
                    index === currentStep ? 'bg-gold text-primary-foreground' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
              <p className="text-muted-foreground">Loading your progress...</p>
            </div>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </main>
    </div>
  );
}
