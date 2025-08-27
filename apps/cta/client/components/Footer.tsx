import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Award,
  Shield,
  Clock,
} from "lucide-react";

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", followers: "25K" },
  { name: "Twitter", icon: Twitter, href: "#", followers: "18K" },
  { name: "Instagram", icon: Instagram, href: "#", followers: "45K" },
  { name: "LinkedIn", icon: Linkedin, href: "#", followers: "12K" },
];

const trustBadges = [
  { icon: Award, text: "Award Winning", subtext: "Design Excellence" },
  { icon: Shield, text: "Fully Insured", subtext: "Secure & Protected" },
  { icon: Clock, text: "24/7 Support", subtext: "Always Available" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="px-4 lg:px-6 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-buildora-gold to-buildora-gold-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold text-card-foreground">Buildora</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Transform your space with professional interior design & execution packages. From supplies to architects, we handle everything for your dream space.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <a href="mailto:hello@buildora.com" className="hover:text-buildora-gold transition-colors">
                  hello@buildora.com
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-buildora-gold transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-3 text-buildora-gold flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <badge.icon className="h-4 w-4 text-buildora-gold" />
                  <div>
                    <div className="font-medium text-card-foreground">{badge.text}</div>
                    <div className="text-xs text-muted-foreground">{badge.subtext}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm text-center md:text-left mb-4 md:mb-0">
              © 2024 Buildora. All rights reserved.
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <div key={social.name} className="group relative">
                  <a
                    href={social.href}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-buildora-gold hover:text-white transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card-foreground text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {social.followers}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
