import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Award,
  Shield,
  Clock,
} from "lucide-react";

const footerLinks = {
  about: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press & Media", href: "/press" },
    { name: "Awards", href: "/awards" },
  ],
  services: [
    { name: "Interior Design", href: "/services/interior-design" },
    { name: "Architecture", href: "/services/architecture" },
    { name: "Project Management", href: "/services/project-management" },
    { name: "Home Renovation", href: "/services/renovation" },
    { name: "Commercial Design", href: "/services/commercial" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ],
  resources: [
    { name: "Design Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Design Tips", href: "/tips" },
    { name: "Cost Calculator", href: "/calculator" },
    { name: "Download App", href: "/app" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "#1877F2" },
  { name: "Twitter", icon: Twitter, href: "#", color: "#1DA1F2" },
  { name: "Instagram", icon: Instagram, href: "#", color: "#E4405F" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "#0A66C2" },
];

const trustBadges = [
  { icon: Award, text: "Award Winning", subtext: "Design Excellence" },
  { icon: Shield, text: "Fully Insured", subtext: "Secure & Protected" },
  { icon: Clock, text: "24/7 Support", subtext: "Always Available" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="px-4 lg:px-6 py-8 lg:py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-buildora-gold to-buildora-gold-light rounded-2xl p-6 md:p-8 mb-8 lg:mb-12">
          <div className="text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Get Design Inspiration
            </h3>
            <p className="text-white/90 mb-6 text-base md:text-lg">
              Subscribe to our newsletter for exclusive design tips, trends, and
              special offers
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[44px]"
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="bg-white text-buildora-gold px-6 py-3 rounded-lg font-medium hover:bg-white/95 transition-colors flex items-center justify-center min-h-[44px]"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    "Subscribed!"
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-white/70 text-sm mt-3">
              Join 10,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-buildora-gold to-buildora-gold-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div> */}
              <Logo size="medium" variant="full" />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Transform your space with professional interior design & execution
              packages. From supplies to architects, we handle everything for
              your dream space.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <a
                  href="mailto:hello@buildora.com"
                  className="hover:text-buildora-gold transition-colors"
                >
                  hello@buildora.com
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-buildora-gold transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <badge.icon className="h-4 w-4 text-buildora-gold" />
                  <div>
                    <div className="font-medium text-card-foreground">
                      {badge.text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {badge.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-card-foreground font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-buildora-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-buildora-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-buildora-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-buildora-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © 2024 BUILDORA ENTERPRISE. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-buildora-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/terms"
                className="hover:text-buildora-gold transition-colors"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                to="/cookies"
                className="hover:text-buildora-gold transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground mr-2">
              Follow us:
            </span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <social.icon className="h-6 w-6" style={{ color: social.color }} />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile App Promotion */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Get the BUILDORA ENTERPRISE mobile app for exclusive deals and easy project
            tracking
          </p>
          <button className="inline-flex items-center text-buildora-gold hover:text-buildora-gold-dark font-medium text-sm">
            Download App
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
