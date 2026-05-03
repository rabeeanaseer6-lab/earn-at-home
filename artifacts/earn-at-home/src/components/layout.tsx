import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Coins, Menu, X, LogOut, ShieldCheck, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923092821856";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/training", label: "Training" },
  { href: "/calculator", label: "Calculator" },
  { href: "/blog", label: "Blog" },
  { href: "/about-us", label: "About Us" },
  { href: "/help", label: "Help" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = !!localStorage.getItem("admin_token");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 w-full shadow-md" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#c9a227" }}>
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-base tracking-tight">Earn at Home</span>
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#c9a227" }}>
                Pakistan's #1 Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={
                  location === link.href
                    ? { color: "#c9a227" }
                    : { color: "rgba(255,255,255,0.75)" }
                }
              >
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  <ShieldCheck className="h-4 w-4" style={{ color: "#c9a227" }} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-2 rounded-md hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                style={{ color: "rgba(255,255,255,0.45)" }}
                data-testid="nav-link-admin"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10" style={{ backgroundColor: "#162038" }}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin ? (
                <>
                  <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.8)" }}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#1a2744" }} className="text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: "#c9a227" }}>
                  <Coins className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">Earn at Home</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Pakistan's #1 remote screenshot verification platform. We connect home workers with data verification tasks, ensuring fair and transparent pay at Rs. 5 per valid screenshot.
              </p>
            </div>

            {/* Col 2: Resources */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: "#c9a227" }}>
                Resources
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/leaderboard", label: "Public Leaderboard" },
                  { href: "/training", label: "Training Guides" },
                  { href: "/calculator", label: "Earnings Calculator" },
                  { href: "/blog", label: "Blog" },
                  { href: "/help", label: "Help Center / FAQ" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/about", label: "About the Author" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Legal */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: "#c9a227" }}>
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/disclaimer", label: "Earning Disclaimer" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                No fake or blurred screenshots. Automated bot usage results in permanent ban.
              </p>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: "#c9a227" }}>
                Join Us
              </h4>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Contact our Admin on WhatsApp to get your free Worker ID and start training today.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#25D366", color: "white" }}
                data-testid="link-whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: 03092821856
              </a>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                EasyPaisa &amp; JazzCash payouts daily
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} Earn at Home Platform. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              Rs. 5 per valid, unique screenshot · EasyPaisa · JazzCash · Bank Transfer
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
        title="Chat on WhatsApp"
        data-testid="fab-whatsapp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
