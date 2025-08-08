import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  about: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  services: [
    { name: "Interior Design", href: "/services/interior-design" },
    { name: "Architecture", href: "/services/architecture" },
    { name: "Project Management", href: "/services/project-management" },
    { name: "Consultation", href: "/services/consultation" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-buildora-gold to-buildora-gold-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold text-card-foreground">Buildora</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Transform your space with professional interior design & execution packages. 
              From supplies to architects, we handle everything for your dream space.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-5 w-5 mr-3 text-buildora-gold" />
                hello@buildora.com
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-5 w-5 mr-3 text-buildora-gold" />
                +91 98765 43210
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-3 text-buildora-gold" />
                Mumbai, Maharashtra, India
              </div>
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
                    className="text-muted-foreground hover:text-buildora-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-buildora-gold transition-colors"
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
                    className="text-muted-foreground hover:text-buildora-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2024 Buildora. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-buildora-gold hover:text-white transition-colors"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
