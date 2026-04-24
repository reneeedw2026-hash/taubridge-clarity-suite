import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Upload,
  Sparkles,
  BarChart3,
  Users,
  FileText,
  Target,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const workflowSteps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload GL Data",
    description: "Upload your General Ledger data (and optionally Chart of Accounts). Our system recognizes your ERP and maps your accounts automatically.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI CFO Generates Statements",
    description: "Our AI CFO generates your Income Statement, Balance Sheet, and Cash Flow—then runs comprehensive analysis including health score and recommendations.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "View Dashboards & KPIs",
    description: "See revenue, costs, profit, and margins visualized. Track trends over time and spot opportunities before they become problems.",
  },
  {
    icon: Users,
    number: "04",
    title: "Add Payroll Data (Optional)",
    description: "Upload payroll exports to PayrollTax Pro. System calculates taxes, generates forms, and adds payroll KPIs to your unified dashboard.",
  },
  {
    icon: Target,
    number: "05",
    title: "Create Your Action Plan",
    description: "Select 3-5 AI/analyst recommendations. Assign owners, due dates, and track status. These appear in your meeting pack and CFO calls.",
  },
  {
    icon: Calendar,
    number: "06",
    title: "Meet with Your CFO",
    description: "Monthly or quarterly calls review performance, action plan progress, and updated projections. Leave each call with clear next steps.",
  },
];

const dashboardFeatures = [
  { label: "Revenue Trends", value: "Track monthly/quarterly growth" },
  { label: "Labor Cost %", value: "Labor as percentage of revenue" },
  { label: "Revenue per Employee", value: "Productivity metrics" },
  { label: "Payroll Tax Ratios", value: "Tax as % of payroll & expenses" },
  { label: "Margin Analysis", value: "Gross and net margin tracking" },
  { label: "Cash Flow Outlook", value: "12-month projection" },
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">AI Workflows & Dashboards</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              How TauBridge Works
            </h1>
            <p className="text-xl text-white/70 mb-8">
              From data upload to actionable insights in minutes. Our AI-powered workflow turns your financial data into clarity and control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The AI CFO Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, repeatable process that keeps your finances clear and your business on track.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-secondary/30">{step.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Here Box */}
      <section className="py-16 bg-cream-dark">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-hero rounded-3xl p-8 md:p-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="text-sm text-white/90">Start Here This Month</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                Your monthly workflow in 4 simple steps:
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { step: "1", text: "Upload your latest GL file" },
                  { step: "2", text: "Upload payroll export" },
                  { step: "3", text: "Click 'Generate AI Analysis'" },
                  { step: "4", text: "Review CFO Brief & action plan before your call" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-6 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary font-bold mb-3">
                      {item.step}
                    </span>
                    <p className="text-white/90 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unified Dashboard */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Unified CFO Dashboard
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Everything you need to understand your business in one place. GL data, payroll exports, and tax information combined into clear, actionable insights.
              </p>
              <div className="space-y-4">
                {dashboardFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">{feature.label}</span>
                    <span className="text-sm text-muted-foreground">{feature.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-muted-foreground text-sm">Financial Health Score</p>
                    <p className="text-3xl font-bold">87<span className="text-secondary">/100</span></p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-sage" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className="font-bold">$2.4M</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Margin</p>
                    <p className="font-bold">34%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Labor %</p>
                    <p className="font-bold">42%</p>
                  </div>
                </div>
                <div className="h-24 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((h, i) => (
                    <div key={i} className="flex-1 bg-secondary/20 rounded-t relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-secondary rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to see your finances clearly?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Book a Financial Clarity Call to see our workflows and dashboards in action.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Book Your Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}