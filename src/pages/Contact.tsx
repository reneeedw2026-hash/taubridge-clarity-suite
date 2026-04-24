import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  Wrench,
  AlertTriangle,
  Target,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";


const painPoints = [
  { id: "cash-flow", label: "I don't have a clear picture of profit and cash flow" },
  { id: "payroll-costs", label: "Payroll costs feel out of control or unpredictable" },
  { id: "tax-compliance", label: "I'm worried about payroll tax compliance or IRS notices" },
  { id: "report-confusion", label: "My reports exist, but I don't understand what to do with them" },
  { id: "time-drain", label: "I spend too much time on finance/payroll instead of running the business" },
  { id: "other-pain", label: "Other" },
];

const recentIssues = [
  { id: "late-filings", label: "Late or amended payroll tax filings" },
  { id: "irs-notices", label: "IRS or state notices related to payroll or employment taxes" },
  { id: "missed-payments", label: "Missed or late vendor/loan payments" },
  { id: "payroll-difficulty", label: "Difficulty making payroll" },
  { id: "year-end-surprises", label: "Major surprises at year-end with taxes or financials" },
  { id: "none", label: "None of the above" },
  { id: "other-issue", label: "Other" },
];

const reportingFrequencies = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Only at year-end / tax time",
];

const readinessLevels = [
  { value: "active", label: "I am actively looking to engage a virtual CFO/payroll partner within the next 1–3 months." },
  { value: "exploring", label: "I am exploring options and timing is flexible." },
  { value: "gathering", label: "I am mainly gathering information." },
];

interface FormData {
  // Step 1: About Your Business
  businessDescription: string;
  
  // Step 2: Current Tools
  accountingTool: string;
  payrollTool: string;
  otherTools: string;
  
  // Step 3: Pain Points
  painPoints: string[];
  painPointsOther: string;
  
  // Step 4: Recent Issues
  recentIssues: string[];
  recentIssuesDetails: string;
  
  // Step 5: Goals
  goals: string;
  
  // Step 6: Decision Making
  bookkeepingResponsible: string;
  financialDecisionMaker: string;
  hasOutsideAdvisor: string;
  
  // Step 7: Reporting
  reportingFrequency: string;
  reportingFrustrations: string;
  
  // Step 8: Readiness & Contact
  readinessLevel: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  anythingElse: string;
}

const initialFormData: FormData = {
  businessDescription: "",
  accountingTool: "",
  payrollTool: "",
  otherTools: "",
  painPoints: [],
  painPointsOther: "",
  recentIssues: [],
  recentIssuesDetails: "",
  goals: "",
  bookkeepingResponsible: "",
  financialDecisionMaker: "",
  hasOutsideAdvisor: "",
  reportingFrequency: "",
  reportingFrustrations: "",
  readinessLevel: "",
  name: "",
  email: "",
  phone: "",
  companyName: "",
  anythingElse: "",
};

const steps = [
  { id: 1, title: "About Your Business", icon: Building2, required: true },
  { id: 2, title: "Current Tools", icon: Wrench, required: true },
  { id: 3, title: "Pain Points", icon: AlertTriangle, required: true },
  { id: 4, title: "Recent Issues", icon: HelpCircle, required: true },
  { id: 5, title: "Your Goals", icon: Target, required: true },
  { id: 6, title: "Decision Making", icon: Users, required: false },
  { id: 7, title: "Reporting", icon: BarChart3, required: false },
  { id: 8, title: "Contact & Submit", icon: CheckCircle2, required: true },
];

export default function Contact() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "painPoints" | "recentIssues", item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.businessDescription;
      case 2:
        return !!formData.accountingTool && !!formData.payrollTool;
      case 3:
        return formData.painPoints.length > 0;
      case 4:
        return true; // Recent issues are optional
      case 5:
        return !!formData.goals;
      case 6:
        return true; // Optional step
      case 7:
        return true; // Optional step
      case 8:
        return !!formData.name && !!formData.email && !!formData.companyName && !!formData.readinessLevel;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 8));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(8)) {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-questionnaire-email", {
        body: formData,
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast({
        title: "Questionnaire received!",
        description: "We'll review your answers and reach out within 1 business day.",
      });
    } catch (error: any) {
      console.error("Error submitting questionnaire:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your questionnaire. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 8) * 100;

  if (submitted) {
    return (
      <Layout>
        <section className="py-32 bg-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-sage" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Thank You, {formData.name}!</h1>
              <p className="text-muted-foreground mb-8">
                Your pre-call questionnaire has been received. We'll review your answers and reach out within 1 business day to schedule your Financial Clarity Call.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Having this information ahead of our call means we can focus on solutions, not fact-gathering.
              </p>
              <Button variant="gold" onClick={() => { setSubmitted(false); setFormData(initialFormData); setCurrentStep(1); }}>
                Submit Another Request
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">Free 30-Minute Consultation</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pre-Call Questionnaire
            </h1>
            <p className="text-lg text-white/70">
              Help us prepare for your Financial Clarity Call by answering a few questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Step Navigation Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-4">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Progress</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Step {currentStep} of 8</p>
                </div>
                
                <nav className="space-y-1">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          isActive 
                            ? "bg-secondary/10 text-secondary font-medium" 
                            : isCompleted 
                              ? "text-sage hover:bg-muted" 
                              : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{step.title}</span>
                        {!step.required && <span className="text-xs text-muted-foreground">(opt)</span>}
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-sage ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-6 border-t border-border space-y-4">
                  <h3 className="font-semibold text-sm">Contact Directly</h3>
                  <a
                    href="mailto:hello@taubridge.com"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    hello@taubridge.com
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    (123) 456-7890
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: About Your Business */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">About Your Business</h2>
                          <p className="text-muted-foreground">Tell us about your company and team structure.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessDescription">What does your business do, and who do you primarily serve? *</Label>
                          <Textarea
                            id="businessDescription"
                            value={formData.businessDescription}
                            onChange={(e) => updateFormData("businessDescription", e.target.value)}
                            placeholder="E.g., We're a marketing agency serving mid-market tech companies..."
                            className="min-h-[100px]"
                          />
                        </div>

                      </motion.div>
                    )}

                    {/* Step 2: Current Tools */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Current Finance & Payroll Tools</h2>
                          <p className="text-muted-foreground">Which systems do you currently use?</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accountingTool">Accounting / GL System *</Label>
                          <Input
                            id="accountingTool"
                            value={formData.accountingTool}
                            onChange={(e) => updateFormData("accountingTool", e.target.value)}
                            placeholder="E.g., QuickBooks Online, Xero, NetSuite, Sage..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payrollTool">Payroll System *</Label>
                          <Input
                            id="payrollTool"
                            value={formData.payrollTool}
                            onChange={(e) => updateFormData("payrollTool", e.target.value)}
                            placeholder="E.g., Gusto, ADP, Paychex, in-house..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="otherTools">Any other key tools? (billing, CRM, time tracking)</Label>
                          <Input
                            id="otherTools"
                            value={formData.otherTools}
                            onChange={(e) => updateFormData("otherTools", e.target.value)}
                            placeholder="E.g., HubSpot, Salesforce, Harvest..."
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Pain Points */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Biggest Pain Points</h2>
                          <p className="text-muted-foreground">What are your top frustrations today? (Choose 2–3) *</p>
                        </div>

                        <div className="space-y-3">
                          {painPoints.map((point) => (
                            <div key={point.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={point.id}
                                checked={formData.painPoints.includes(point.id)}
                                onCheckedChange={() => toggleArrayItem("painPoints", point.id)}
                              />
                              <Label htmlFor={point.id} className="font-normal cursor-pointer leading-relaxed">
                                {point.label}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {formData.painPoints.includes("other-pain") && (
                          <div className="space-y-2">
                            <Label htmlFor="painPointsOther">Please describe your other pain point(s):</Label>
                            <Textarea
                              id="painPointsOther"
                              value={formData.painPointsOther}
                              onChange={(e) => updateFormData("painPointsOther", e.target.value)}
                              placeholder="Describe your challenges..."
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 4: Recent Issues */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Recent Issues or Risks</h2>
                          <p className="text-muted-foreground">In the last 12–18 months, have you had any of the following?</p>
                        </div>

                        <div className="space-y-3">
                          {recentIssues.map((issue) => (
                            <div key={issue.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={issue.id}
                                checked={formData.recentIssues.includes(issue.id)}
                                onCheckedChange={() => toggleArrayItem("recentIssues", issue.id)}
                              />
                              <Label htmlFor={issue.id} className="font-normal cursor-pointer leading-relaxed">
                                {issue.label}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {formData.recentIssues.length > 0 && !formData.recentIssues.includes("none") && (
                          <div className="space-y-2">
                            <Label htmlFor="recentIssuesDetails">Please briefly describe the issues you selected:</Label>
                            <Textarea
                              id="recentIssuesDetails"
                              value={formData.recentIssuesDetails}
                              onChange={(e) => updateFormData("recentIssuesDetails", e.target.value)}
                              placeholder="Provide any relevant details..."
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 5: Goals */}
                    {currentStep === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Your Goals for the Next 12 Months</h2>
                          <p className="text-muted-foreground">What are the top 3 outcomes you want from working with a virtual CFO / payroll strategy partner? *</p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                          <p className="font-medium mb-2">Examples:</p>
                          <ul className="space-y-1">
                            <li>• Improve cash flow visibility</li>
                            <li>• Raise profitability margins</li>
                            <li>• Clean up books and get caught up</li>
                            <li>• Reduce tax risk and stay compliant</li>
                            <li>• Prepare for growth or investment</li>
                            <li>• Free up founder/owner time</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="goals">Your top 3 goals *</Label>
                          <Textarea
                            id="goals"
                            value={formData.goals}
                            onChange={(e) => updateFormData("goals", e.target.value)}
                            placeholder="1. Improve cash flow so I can plan ahead confidently&#10;2. Get our payroll taxes under control&#10;3. Have monthly reports I actually understand"
                            className="min-h-[150px]"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 6: Decision Making */}
                    {currentStep === 6 && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">How Decisions Are Made Today</h2>
                          <p className="text-muted-foreground">Help us understand your current finance structure. (Optional)</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bookkeepingResponsible">Who is primarily responsible for day-to-day bookkeeping and payroll?</Label>
                          <Input
                            id="bookkeepingResponsible"
                            value={formData.bookkeepingResponsible}
                            onChange={(e) => updateFormData("bookkeepingResponsible", e.target.value)}
                            placeholder="E.g., Office manager, outsourced bookkeeper, myself..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="financialDecisionMaker">Who is responsible for financial decision-making?</Label>
                          <Input
                            id="financialDecisionMaker"
                            value={formData.financialDecisionMaker}
                            onChange={(e) => updateFormData("financialDecisionMaker", e.target.value)}
                            placeholder="E.g., Owner, COO, Finance lead..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hasOutsideAdvisor">Do you have any outside CPA, bookkeeper, or advisor you already work with?</Label>
                          <Input
                            id="hasOutsideAdvisor"
                            value={formData.hasOutsideAdvisor}
                            onChange={(e) => updateFormData("hasOutsideAdvisor", e.target.value)}
                            placeholder="E.g., Yes, we have a CPA for taxes / No, we handle everything in-house"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 7: Reporting */}
                    {currentStep === 7 && (
                      <motion.div
                        key="step7"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Reporting & Visibility</h2>
                          <p className="text-muted-foreground">How do you currently track your finances? (Optional)</p>
                        </div>

                        <div className="space-y-3">
                          <Label>How often do you currently review financials (P&L, balance sheet, cash) and payroll reports?</Label>
                          <RadioGroup
                            value={formData.reportingFrequency}
                            onValueChange={(value) => updateFormData("reportingFrequency", value)}
                          >
                            {reportingFrequencies.map((freq) => (
                              <div key={freq} className="flex items-center space-x-3">
                                <RadioGroupItem value={freq.toLowerCase().replace(/\s+/g, "-")} id={`report-${freq}`} />
                                <Label htmlFor={`report-${freq}`} className="font-normal cursor-pointer">{freq}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reportingFrustrations">What is most confusing or frustrating about your current reports?</Label>
                          <Textarea
                            id="reportingFrustrations"
                            value={formData.reportingFrustrations}
                            onChange={(e) => updateFormData("reportingFrustrations", e.target.value)}
                            placeholder="E.g., I don't know what numbers to focus on, reports are always late, data doesn't match..."
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 8: Contact & Submit */}
                    {currentStep === 8 && (
                      <motion.div
                        key="step8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
                          <p className="text-muted-foreground">Your contact information and any final thoughts.</p>
                        </div>

                        <div className="space-y-3">
                          <Label>Which statement best describes you right now? *</Label>
                          <RadioGroup
                            value={formData.readinessLevel}
                            onValueChange={(value) => updateFormData("readinessLevel", value)}
                          >
                            {readinessLevels.map((level) => (
                              <div key={level.value} className="flex items-start space-x-3">
                                <RadioGroupItem value={level.value} id={`readiness-${level.value}`} className="mt-1" />
                                <Label htmlFor={`readiness-${level.value}`} className="font-normal cursor-pointer leading-relaxed">
                                  {level.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => updateFormData("name", e.target.value)}
                              placeholder="John Smith"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) => updateFormData("companyName", e.target.value)}
                              placeholder="Acme Inc."
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              placeholder="john@company.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="anythingElse">Anything else we should know before our call?</Label>
                          <Textarea
                            id="anythingElse"
                            value={formData.anythingElse}
                            onChange={(e) => updateFormData("anythingElse", e.target.value)}
                            placeholder="Share any context, urgent issues, or specific questions you want answered in our 30-minute session..."
                            className="min-h-[100px]"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground">
                          By submitting, you agree to receive communications from TauBridge. 
                          We respect your privacy and never share your information.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentStep < 8 ? (
                      <Button
                        type="button"
                        variant="gold"
                        onClick={handleNext}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        disabled={isSubmitting}
                        className="gap-2"
                      >
                        {isSubmitting ? "Submitting..." : "Submit & Schedule Call"}
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
