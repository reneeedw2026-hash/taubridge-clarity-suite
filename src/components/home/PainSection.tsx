import { motion } from "framer-motion";
import { AlertCircle, Eye, FileQuestion, Calculator } from "lucide-react";

const painPoints = [
  {
    icon: AlertCircle,
    title: "Buried in payroll and taxes",
    description: "You're constantly putting out financial fire drills instead of running your business.",
  },
  {
    icon: Eye,
    title: "No clear visibility",
    description: "You don't have a clear view of cash, margin, or which teams and products drive profit.",
  },
  {
    icon: FileQuestion,
    title: "Reports without direction",
    description: "Reports exist, but nobody translates them into what to do next.",
  },
  {
    icon: Calculator,
    title: "Worried about compliance",
    description: "You're worried about payroll tax mistakes and year-end surprises.",
  },
];

export function PainSection() {
  return (
    <section className="py-20 bg-cream-dark">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sound familiar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            As a business owner, you shouldn't have to become a finance expert to understand your numbers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-destructive/20 hover:border-destructive/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
              <p className="text-muted-foreground text-sm">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
