import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Sparkles, text: "AI-driven dashboards that turn your data into clear, actionable insights" },
  { icon: TrendingUp, text: "Virtual CFO guidance without the full-time CFO price tag" },
  { icon: Shield, text: "Deep payroll and payroll tax expertise to protect cash and compliance" },
  { icon: Clock, text: "Monthly or quarterly CFO calls that end with a concrete action plan" },
];

export function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-navy-light/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">AI-Powered Financial Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered CFO and{" "}
              <span className="text-gradient-gold">Payroll Strategy</span>{" "}
              for Growing Businesses
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl">
              TauBridge Financial Strategies delivers intelligent financial solutions that transform how small and medium businesses manage finances, taxes, and strategic planning.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <benefit.icon className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <span className="text-white/80">{benefit.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Financial Clarity Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/pricing">See Plans & Pricing</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative animate-float">
              {/* Main Dashboard Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/60 text-sm">Financial Health Score</p>
                    <p className="text-3xl font-bold text-white">87<span className="text-secondary">/100</span></p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-32 flex items-end gap-2 mb-6">
                  {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((height, i) => (
                    <div key={i} className="flex-1 bg-secondary/30 rounded-t-sm relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary to-gold-light rounded-t-sm transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/60 text-xs mb-1">Revenue</p>
                    <p className="text-white font-semibold">$2.4M</p>
                    <p className="text-sage text-xs">+12%</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/60 text-xs mb-1">Margin</p>
                    <p className="text-white font-semibold">34%</p>
                    <p className="text-sage text-xs">+5%</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/60 text-xs mb-1">Cash</p>
                    <p className="text-white font-semibold">$580K</p>
                    <p className="text-sage text-xs">+8%</p>
                  </div>
                </div>
              </div>

              {/* Floating Action Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Action Plan Ready</p>
                    <p className="text-xs text-muted-foreground">3 items for this quarter</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
