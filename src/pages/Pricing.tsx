import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const packages = [
  {
    name: "CFO Essentials",
    price: "$2,000",
    period: "/month",
    description: "Starting point for growing businesses ready for CFO-level insight.",
    ideal: "$500k+ revenue, 10-50 employees",
    features: [
      "GL upload with ERP recognition",
      "Automated IS, BS, and Cash Flow",
      "AI CFO analysis with health score",
      "Basic 12-month rolling projection",
      "Simple scenario toggles",
      "Quarterly CFO strategy call (60-90 min)",
      "Action Plan with 3-5 items tracked",
      "Onboarding and quick-start workflow",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "CFO + Payroll Performance",
    price: "$3,500",
    period: "/month",
    description: "For businesses where payroll is a major cost driver.",
    ideal: "20-200+ employees, labor-heavy industries",
    features: [
      "Everything in CFO Essentials",
      "Integrated payroll and payroll tax lens",
      "Unified KPIs: labor cost %, revenue per employee",
      "Payroll tax ratios and overtime tracking",
      "Payroll Health Report each period",
      "Monthly CFO calls with action plan review",
      "Quarterly/year-end payroll tax via PayrollTax Pro",
      "Divergence alerts (payroll vs. GL)",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Strategic Operations CFO",
    price: "$6,000",
    period: "/month",
    description: "Full-service virtual CFO for complex, multi-location businesses.",
    ideal: "50-500+ employees, multiple locations/segments",
    features: [
      "Everything in CFO + Payroll Performance",
      "Quarterly-updated 12-month projections",
      "Detailed scenario toggles by product/segment",
      "Segment views (department/location P&L)",
      "Customer/project margin signals",
      "Monthly 60-min CFO + email/Slack support",
      "Leadership meeting participation",
      "Tailored CEO and Operations packs",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

const payrollTaxFeatures = [
  "Employee data import with flexible column mapping",
  "Employee management with auto-calculated taxes",
  "Quarterly Form 941 generation",
  "Annual Form 940 (FUTA) calculation",
  "W-2 wage statements preparation",
  "W-3 transmittal generation",
  "Tax reconciliation and discrepancy flagging",
  "Tax summary dashboard with deadlines",
];

const faqs = [
  {
    question: "What is the minimum engagement length?",
    answer: "We typically work with clients for a minimum of 6-12 months to see meaningful impact. This allows time for onboarding, establishing baseline KPIs, and completing at least one full financial cycle together.",
  },
  {
    question: "How long does onboarding take?",
    answer: "Most clients are fully onboarded within 2-4 weeks. We'll work with you to upload your data, map your accounts, and generate your first AI CFO analysis. Your first CFO call typically happens within the first month.",
  },
  {
    question: "What data do I need to get started?",
    answer: "At minimum, you'll need a General Ledger export from your accounting system. For payroll services, we'll also need payroll data exports. We support most ERP formats and can help with custom mapping if needed.",
  },
  {
    question: "How do AI analysis and human advisory combine?",
    answer: "Our AI generates statements, dashboards, and recommendations automatically. Your CFO advisor reviews these insights, adds strategic context, and works with you to create actionable plans. It's the best of both worlds: AI efficiency with human judgment.",
  },
  {
    question: "Do you provide fundraising or M&A services?",
    answer: "No. TauBridge focuses exclusively on operational financial clarity and payroll strategy. We do not offer fundraising, capital raising, or M&A advisory services.",
  },
  {
    question: "Can PayrollTax Pro work as a standalone service?",
    answer: "Yes! While PayrollTax Pro is integrated into our CFO + Payroll Performance and Strategic Operations CFO packages, it's also available as a standalone service for businesses that primarily need payroll tax compliance and strategy.",
  },
];

export default function Pricing() {
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
              <span className="text-sm text-white/90">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Plans & Pricing
            </h1>
            <p className="text-xl text-white/70">
              Choose the level of CFO support that fits your business. All plans include AI dashboards, action plans, and strategic guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-background">
        <div className="section-container">
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
                    ? "bg-primary text-white ring-4 ring-secondary scale-105"
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
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold ${pkg.highlight ? "text-secondary" : "text-gradient-gold"}`}>
                    {pkg.price}
                  </span>
                  <span className={`${pkg.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                    {pkg.period}
                  </span>
                </div>
                <p className={`text-sm mb-4 ${pkg.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                  {pkg.description}
                </p>
                <p className={`text-xs mb-6 px-3 py-2 rounded-lg ${pkg.highlight ? "bg-white/10" : "bg-muted"}`}>
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
                  <Link to="/contact">{pkg.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PayrollTax Pro */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Also Available</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                PayrollTax Pro Standalone
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                For businesses that need focused payroll tax compliance without full CFO services. Get the same AI-powered workflow and expert oversight.
              </p>
              <p className="text-muted-foreground mb-8">
                PayrollTax Pro is included and integrated in CFO + Payroll Performance and Strategic Operations CFO packages. Contact us for standalone pricing.
              </p>
              <Button variant="gold" asChild>
                <Link to="/contact">
                  Get Pricing
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              <h3 className="font-semibold text-xl mb-6">What's Included</h3>
              <ul className="space-y-3">
                {payrollTaxFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Common Questions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to choose your plan?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Schedule a Financial Clarity Call to discuss your needs and find the right fit.
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