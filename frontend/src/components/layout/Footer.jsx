import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-50/50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">
                Find<span className="text-primary-500">Care</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quality healthcare made accessible. Search hospitals, find doctors, and book appointments online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/hospitals" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors">Hospitals</Link></li>
              <li><Link to="/doctors" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors">Doctors</Link></li>
              <li><Link to="/register" className="text-sm text-muted-foreground hover:text-primary-600 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Help Center</span></li>
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">support@findcare.com</span></li>
              <li><span className="text-sm text-muted-foreground">+91 98765 43210</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FindCare. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <Heart className="inline h-3 w-3 text-red-400 fill-red-400" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
