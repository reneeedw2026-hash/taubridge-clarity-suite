import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin, ArrowUpRight } from "lucide-react";
import taubridgeLogo from "@/assets/taubridge-logo.png";

const footerLinks = {
  services: [
    { name: "Virtual CFO", href: "/services/virtual-cfo" },
    { name: "PayrollTax Pro", href: "/services/payroll-tax-pro" },
    { name: "Pricing & Plans", href: "/pricing" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to see your finances clearly?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Book a Financial Clarity Call and discover how TauBridge can transform your financial operations.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-gold text-primary font-bold px-8 py-4 rounded-xl shadow-gold hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              Book Your Free Consultation
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src={taubridgeLogo} 
                alt="TauBridge Financial Strategies" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-white/70 mb-6 max-w-sm">
              Your path to financial clarity. AI-powered virtual CFO and payroll strategy for growing businesses.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@taubridge.com"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                hello@taubridge.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                (123) 456-7890
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} TauBridge Financial Strategies, LLC. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Designed with clarity in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
