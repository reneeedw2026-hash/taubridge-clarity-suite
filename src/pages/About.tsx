import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  GraduationCap,
  Award,
  Briefcase,
  Eye,
  Shield,
  Target,
  Sparkles,
} from "lucide-react";

const credentials = [
  { icon: Award, text: "22+ years payroll experience" },
  { icon: Award, text: "CPP (Certified Payroll Professional) for 5+ years" },
  { icon: Briefcase, text: "Managed payroll for ~3,000 employees" },
  { icon: Briefcase, text: "Led payroll system migration (outsourced → in-house)" },
  { icon: Briefcase, text: "Payroll accountant since 2014" },
  { icon: Briefcase, text: "Managed inventory and other accounts since 2017" },
];

const education = [
  { degree: "B.S. Computer & Information Sciences", school: "Clark Atlanta University, 2003" },
  { degree: "AA in Accounting", school: "" },
  { degree: "Master of Accountancy", school: "Liberty University, 2013" },
  { degree: "MBA", school: "Liberty University, 2015" },
];

const pillars = [
  {
    icon: Eye,
    title: "Clarity",
    description: "See what's happening and what to do next. Your finances should inform decisions, not create confusion.",
  },
  {
    icon: Shield,
    title: "Control",
    description: "Tighten payroll, taxes, and operations with fewer surprises. Proactive management beats reactive firefighting.",
  },
  {
    icon: Target,
    title: "Confidence",
    description: "Make decisions backed by a CFO who understands both systems and people costs. Move forward with conviction.",
  },
];

export default function About() {
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
              <span className="text-sm text-white/90">About TauBridge</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Path to Financial Clarity
            </h1>
            <p className="text-xl text-white/70">
              We bridge the gap between basic bookkeeping and expensive full-time CFOs, combining technology, accounting, and payroll expertise into one virtual CFO partner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why TauBridge Exists
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  After more than two decades working in payroll and accounting, our founder saw the same pattern again and again: growing businesses stuck between basic bookkeeping and prohibitively expensive full-time CFO hires.
                </p>
                <p>
                  Small and medium businesses—especially those with significant labor costs—were overwhelmed by payroll taxes, struggling to understand their financials, and making decisions without the clarity they deserved.
                </p>
                <p>
                  TauBridge was built to solve this problem. By combining AI-powered analysis with deep payroll and accounting expertise, we deliver CFO-level insight at a fraction of the cost.
                </p>
                <p className="font-medium text-foreground">
                  Today, TauBridge helps growing businesses see their finances clearly, stay compliant, and make confident decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-card rounded-2xl border border-border p-8">
                <h3 className="font-semibold text-xl mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-secondary" />
                  Experience
                </h3>
                <ul className="space-y-3">
                  {credentials.map((cred, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <cred.icon className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{cred.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl border border-border p-8">
                <h3 className="font-semibold text-xl mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                  Education
                </h3>
                <ul className="space-y-3">
                  {education.map((edu, i) => (
                    <li key={i}>
                      <p className="font-medium text-sm">{edu.degree}</p>
                      {edu.school && <p className="text-xs text-muted-foreground">{edu.school}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why TauBridge */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The TauBridge Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three pillars that define how we work with every client.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
                  <pillar.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-secondary text-lg font-medium mb-4">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              "We give you CFO-level clarity and payroll tax confidence, so you can run and grow your business without having to manage finance or payroll yourself."
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/services/virtual-cfo">Explore Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}