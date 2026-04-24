import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import VirtualCFO from "./pages/services/VirtualCFO";
import PayrollTaxPro from "./pages/services/PayrollTaxPro";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Portal pages
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/portal/Dashboard";
import CFOAnalysis from "./pages/portal/cfo/CFOAnalysis";
import RecommendationDetail from "./pages/portal/cfo/RecommendationDetail";
import GLUpload from "./pages/portal/cfo/GLUpload";
import CashFlowOptimizer from "./pages/portal/cfo/CashFlowOptimizer";
import BudgetPlanning from "./pages/portal/cfo/BudgetPlanning";
import IndustryBenchmarking from "./pages/portal/cfo/IndustryBenchmarking";
import BoardReports from "./pages/portal/cfo/BoardReports";
import ActionPlan from "./pages/portal/ActionPlan";
import PayrollDashboard from "./pages/portal/payroll/PayrollDashboard";
import PayrollUpload from "./pages/portal/payroll/PayrollUpload";
import PayrollForms from "./pages/portal/payroll/PayrollForms";
import PayrollSettings from "./pages/portal/payroll/PayrollSettings";
import PayrollEmployees from "./pages/portal/payroll/PayrollEmployees";
import TaxCompliance from "./pages/portal/payroll/TaxCompliance";
import Reports from "./pages/portal/Reports";
import Settings from "./pages/portal/Settings";
import Leads from "./pages/portal/Leads";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services/virtual-cfo" element={<VirtualCFO />} />
            <Route path="/services/payroll-tax-pro" element={<PayrollTaxPro />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />

            {/* Protected Portal Routes */}
            <Route path="/onboarding" element={<ProtectedRoute skipOnboardingCheck><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cfo/analysis" element={<ProtectedRoute><CFOAnalysis /></ProtectedRoute>} />
            <Route path="/cfo/recommendation/:id" element={<ProtectedRoute><RecommendationDetail /></ProtectedRoute>} />
            <Route path="/cfo/upload" element={<ProtectedRoute skipOnboardingCheck><GLUpload /></ProtectedRoute>} />
            <Route path="/cfo/cash-flow" element={<ProtectedRoute><CashFlowOptimizer /></ProtectedRoute>} />
            <Route path="/cfo/budget-planning" element={<ProtectedRoute><BudgetPlanning /></ProtectedRoute>} />
            <Route path="/cfo/benchmarking" element={<ProtectedRoute><IndustryBenchmarking /></ProtectedRoute>} />
            <Route path="/cfo/reports" element={<ProtectedRoute><BoardReports /></ProtectedRoute>} />
            <Route path="/action-plan" element={<ProtectedRoute><ActionPlan /></ProtectedRoute>} />
            <Route path="/payroll/dashboard" element={<ProtectedRoute><PayrollDashboard /></ProtectedRoute>} />
            <Route path="/payroll/upload" element={<ProtectedRoute><PayrollUpload /></ProtectedRoute>} />
            <Route path="/payroll/forms" element={<ProtectedRoute><PayrollForms /></ProtectedRoute>} />
            <Route path="/payroll/settings" element={<ProtectedRoute skipOnboardingCheck><PayrollSettings /></ProtectedRoute>} />
            <Route path="/payroll/employees" element={<ProtectedRoute><PayrollEmployees /></ProtectedRoute>} />
            <Route path="/payroll/compliance" element={<ProtectedRoute><TaxCompliance /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
