import { motion } from "framer-motion";
import { Eye, Shield, DollarSign, Clock } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Financial Clarity",
    description: "See past, present, and future in one place. Understand what's driving your numbers and where you're headed.",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: Shield,
    title: "Payroll & Tax Confidence",
    description: "Fewer IRS surprises and penalties. Proactive compliance that protects your business and your peace of mind.",
    color: "bg-sage/10",
    iconColor: "text-sage",
  },
  {
    icon: DollarSign,
    title: "Cash & Margin Control",
    description: "Labor and operating costs managed proactively. Know where every dollar goes and optimize your profitability.",
    color: "bg-navy/10",
    iconColor: "text-navy",
  },
  {
    icon: Clock,
    title: "Time Back for Leadership",
    description: "Focus on customers and teams, not spreadsheets. Let us handle the financial complexity so you can lead.",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-primary">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What you get with TauBridge
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            More than dashboards and reports—a complete financial operating system that gives you control.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-6`}>
                <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-white/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
