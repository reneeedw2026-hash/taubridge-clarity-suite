import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  Target,
  LineChart,
} from "lucide-react";

const sharedFeatures = [
  { icon: FileText, title: "Automated Financial Statements", description: "Income Statement, Balance Sheet, and Cash Flow generated from your GL data." },
  { icon: BarChart3, title: "AI CFO Analysis", description: "Executive summary, health score, and category-based recommendations." },
  { icon: TrendingUp, title: "Financial Trends Dashboard", description: "Revenue, expenses, profit, and margin tracked over time." },
  { icon: Target, title: "Action Plan Module", description: "Select 3-5 recommendations per period with owner, due date, and status tracking." },
  { icon: LineChart, title: "12-Month Forward View", description: "Rolling projection with scenario toggles to see impact on profit and cash." },
  { icon: FileText, title: "CEO Summary Pack", description: "2-3 page export with KPIs, risks, opportunities, and action plan status." },
];

const packages = [
  {
    name: "CFO Essentials",
    price: "From $2,000/month",
    ideal: "Growing businesses at $500k+ revenue, 10-50 employees",
    features: [
      "GL upload with ERP recognition",
      "Automated IS, BS, and Cash Flow",
      "AI CFO analysis with health score",
      "Basic 12-month rolling projection",
      "Simple scenario toggles",
      "Quarterly CFO strategy call (60-90 min)",
      "Action Plan with 3-5 items tracked",
      "Onboarding and 'Start here' workflow",
    ],
    highlight: false,
  },
  {
    name: "CFO + Payroll Performance",
    price: "From $3,500/month",
    ideal: "20-200+ employee businesses where payroll is a major cost",
    features: [
      "Everything in CFO Essentials",
      "Integrated payroll and payroll tax lens",
      "Unified KPIs from GL + payroll + tax data",
      "Labor cost %, revenue per employee, payroll tax ratios",
      "Payroll Health Report each period",
      "Monthly CFO calls with action plan review",
      "Quarterly/year-end payroll tax via PayrollTax Pro",
      "Alerts if payroll and GL totals diverge",
    ],
    highlight: true,
  },
  {
    name: "Strategic Operations CFO",
    price: "From $6,000/month",
    ideal: "Multi-location or faster-growing businesses, 50-500+ employees",
    features: [
      "Everything in CFO + Payroll Performance",
      "Quarterly-updated 12-month projections",
      "Detailed toggles per product/segment",
      "Segment views (department/location P&L)",
      "Customer/project margin signals",
      "Monthly 60-min CFO sessions + email/Slack support",
      "Participation in leadership meetings",
      "Tailored CEO and Operations packs",
    ],
    highlight: false,
  },
];

export default function VirtualCFO() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">Virtual CFO Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              CFO-Level Insight Without the Full-Time Cost
            </h1>
            <p className="text-xl text-white/70 mb-8">
              AI-powered dashboards, deep payroll expertise, and recurring strategy calls with structured action plans. Get clarity, control, and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Book a Financial Clarity Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/pricing">See Plans & Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Virtual CFO */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is a Virtual CFO?
            </h2>
            <p className="text-lg text-muted-foreground">
              A Virtual CFO gives you the strategic financial leadership of a Chief Financial Officer—without hiring one full-time. At TauBridge, we combine AI-powered analysis with human expertise to deliver:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {sharedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-muted rounded-2xl p-8 text-center">
            <p className="text-lg font-medium mb-2">What We Don't Do:</p>
            <p className="text-muted-foreground">
              TauBridge does not provide fundraising or M&A services. We focus 100% on operational financial clarity and payroll strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your CFO Package
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every package includes our core AI workflows, dashboards, and action plans. Choose the depth that fits your business.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-8 ${
                  pkg.highlight
                    ? "bg-primary text-white ring-4 ring-secondary"
                    : "bg-card border border-border"
                }`}
              >
                {pkg.highlight && (
                  <span className="inline-block bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${pkg.highlight ? "text-white" : ""}`}>
                  {pkg.name}
                </h3>
                <p className={`text-3xl font-bold mb-4 ${pkg.highlight ? "text-secondary" : "text-gradient-gold"}`}>
                  {pkg.price}
                </p>
                <p className={`text-sm mb-6 ${pkg.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                  Ideal for: {pkg.ideal}
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.highlight ? "text-secondary" : "text-sage"}`} />
                      <span className={`text-sm ${pkg.highlight ? "text-white/90" : ""}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.highlight ? "hero" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get CFO-level clarity?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Book a free Financial Clarity Call to discuss your business needs and find the right package.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Schedule Your Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}