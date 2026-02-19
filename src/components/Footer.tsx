import { Mail, Twitter, ShieldCheck, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display text-lg font-bold">Vyride</div>
                <div className="text-xs text-muted-foreground">Cab Verification Platform</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Vyride helps passengers verify drivers, stay safe on the road, and build trust in everyday transport through real-time verification and reporting.
            </p>

            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} KREG Limited. All rights reserved.
            </div>
          </div>

          {/* Platform + Contact wrapped in a flex container */}
          <div className="flex gap-8 md:gap-6 lg:gap-10 justify-start md:ml-16">
            
            {/* Platform */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-foreground transition">Verify Ride</a></li>
                <li><a href="/login" className="text-muted-foreground hover:text-foreground transition">Login</a></li>
                <li><a href="/register" className="text-muted-foreground hover:text-foreground transition">Register</a></li>
                <li><a href="/login" className="text-muted-foreground hover:text-foreground transition">Report Incident</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  hello@vyride.app
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  +234 (0) 000 000 0000
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Nigeria
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>Built for safety • Designed for trust • Scaled for cities</span>
          <span>Vyride Platform Infrastructure</span>
        </div>
      </div>
    </footer>
  );
}
