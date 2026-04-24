import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "TauBridge transformed how we see our finances. For the first time, I actually understand where our money goes and what to do about it.",
    author: "Sarah Mitchell",
    role: "CEO, TechStart Solutions",
    rating: 5,
  },
  {
    quote: "The payroll tax expertise alone saved us from significant compliance issues. The AI dashboards are just a bonus at this point.",
    author: "Marcus Johnson",
    role: "Founder, HomeHealth Connect",
    rating: 5,
  },
  {
    quote: "Finally, a CFO service that speaks my language. Clear action plans, no jargon, and real results we can measure.",
    author: "Jennifer Park",
    role: "Owner, Park Logistics Group",
    rating: 5,
  },
];

const stats = [
  { value: "22+", label: "Years Experience" },
  { value: "500+", label: "Payrolls Managed" },
  { value: "$50M+", label: "Payroll Processed" },
  { value: "CPP", label: "Certified Professional" },
];

export function SocialProofSection() {
  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by growing businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what founders and business owners say about working with TauBridge.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-secondary/30 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
