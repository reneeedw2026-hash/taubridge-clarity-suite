import { motion } from "framer-motion";
import { Sparkles, Upload, BarChart3, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload your data",
    description: "Simply upload your GL data and payroll exports. Our system handles the rest.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI generates insights",
    description: "Our AI CFO analyzes your data, creating dashboards, statements, and recommendations.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Review your dashboard",
    description: "See clear KPIs, trends, and a focused action plan in one unified view.",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Execute with guidance",
    description: "Meet with your CFO advisor, finalize your action plan, and track progress.",
  },
];

export function SolutionSection() {
  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="text-sm font-medium text-sage">The TauBridge Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your AI-enhanced virtual CFO and payroll strategist
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            You get clarity, control, and confidence without having to become a finance expert. 
            Upload your data; we turn it into dashboards, insights, and a focused action plan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent" />
              )}
              
              <div className="bg-gradient-card rounded-2xl p-6 border border-border h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-4xl font-bold text-secondary/30">{item.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
