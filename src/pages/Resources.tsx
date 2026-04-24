import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Clock,
  User,
} from "lucide-react";

const articles = [
  {
    title: "What a Virtual CFO Really Does for a 20-500 Employee Company",
    excerpt: "Discover how a virtual CFO goes beyond basic bookkeeping to provide strategic financial leadership, actionable insights, and growth planning.",
    category: "Virtual CFO",
    readTime: "5 min read",
    author: "TauBridge Team",
  },
  {
    title: "Avoiding Payroll Tax Surprises as You Grow",
    excerpt: "Learn the common payroll tax pitfalls that catch growing businesses off guard—and how to stay ahead of compliance requirements.",
    category: "Payroll & Tax",
    readTime: "7 min read",
    author: "TauBridge Team",
  },
  {
    title: "How AI Dashboards Help Founders Make Better Decisions",
    excerpt: "Explore how AI-powered financial dashboards transform raw data into clear, actionable insights that drive better business decisions.",
    category: "AI & Technology",
    readTime: "4 min read",
    author: "TauBridge Team",
  },
  {
    title: "Turning Payroll Data into Profitability Strategy",
    excerpt: "Your payroll data holds valuable insights about labor costs, productivity, and margins. Learn how to unlock this strategic intelligence.",
    category: "Strategy",
    readTime: "6 min read",
    author: "TauBridge Team",
  },
  {
    title: "The Action Plan Approach: From Insights to Results",
    excerpt: "Having data isn't enough—you need a structured approach to turn insights into action. Here's how TauBridge's action plan methodology works.",
    category: "Process",
    readTime: "5 min read",
    author: "TauBridge Team",
  },
  {
    title: "When to Graduate from DIY Bookkeeping to Virtual CFO",
    excerpt: "Signs your business has outgrown basic bookkeeping and how to know when it's time for CFO-level financial guidance.",
    category: "Growth",
    readTime: "4 min read",
    author: "TauBridge Team",
  },
];

export default function Resources() {
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
              <BookOpen className="w-4 h-4 text-secondary" />
              <span className="text-sm text-white/90">Resources & Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Financial Clarity Insights
            </h1>
            <p className="text-xl text-white/70">
              Practical guidance on virtual CFO services, payroll strategy, and AI-powered financial management for growing businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video bg-gradient-to-br from-secondary/10 to-sage/10 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-secondary/50 group-hover:text-secondary transition-colors" />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-4">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              More articles coming soon. Subscribe to stay updated.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-hero rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Get practical insights on financial clarity, payroll strategy, and growing your business delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take the next step?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Book a Financial Clarity Call and see how TauBridge can help your business.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Book Your Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}