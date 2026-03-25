import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  Building2,
  Stethoscope,
  CalendarDays,
  LayoutDashboard,
  ClipboardCheck,
  UserRound,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const coreLinks = [
  { to: '/hospitals', label: 'Hospitals', icon: Building2 },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
];

const roleRouteByKey = {
  PATIENT: { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  ADMIN: { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  DOCTOR: { to: '/doctor/appointments', label: 'My Patients', icon: ClipboardCheck },
  RECEPTIONIST: { to: '/receptionist', label: 'Front Desk', icon: ClipboardCheck },
};

const roleLabelByKey = {
  PATIENT: 'Patient',
  ADMIN: 'Administrator',
  DOCTOR: 'Doctor',
  RECEPTIONIST: 'Receptionist',
};

const desktopLinkClasses = ({ isActive }) =>
  [
    'group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
    'transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
    isActive
      ? 'bg-primary-50 text-primary-700 shadow-soft'
      : 'text-slate-600 hover:bg-white hover:text-slate-900 active:scale-[0.99]',
  ].join(' ');

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const roleLink = useMemo(() => {
    if (!user?.role) {
      return null;
    }
    return roleRouteByKey[user.role] ?? null;
  }, [user]);

  const navItems = roleLink ? [...coreLinks, roleLink] : coreLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const avatarInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const roleLabel = roleLabelByKey[user?.role] || 'Member';

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ease-smooth',
          scrolled
            ? 'border-slate-200 bg-white/95 shadow-nav'
            : 'border-transparent bg-white/75',
        ].join(' ')}
      >
        <div className="container">
          <div className="flex h-18 items-center justify-between gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 rounded-xl px-1 py-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-[0.98]">
                <HeartPulse className="h-5 w-5" />
                <span className="absolute inset-0 rounded-xl border border-white/30" />
              </div>
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold tracking-tight text-slate-900">FindCare</p>
                <p className="text-2xs font-medium uppercase tracking-[0.16em] text-primary-700">Healthcare Cloud</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={desktopLinkClasses}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-md rounded-xl px-4 text-slate-700 hover:bg-slate-100 focus-visible:ring-primary-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-md rounded-xl px-4"
                  >
                    Create Account
                  </Link>
                </>
              )}

              {user && (
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left',
                      'transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
                      dropdownOpen
                        ? 'border-primary-200 bg-primary-50/70'
                        : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50',
                    ].join(' ')}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white shadow-soft">
                      {avatarInitial}
                    </div>
                    <div className="pr-1">
                      <p className="max-w-[110px] truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-2xs font-medium uppercase tracking-wide text-slate-500">{roleLabel}</p>
                    </div>
                    <ChevronDown
                      className={[
                        'h-4 w-4 text-slate-500 transition-transform duration-300',
                        dropdownOpen ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-elevated animate-scale-in">
                      <div className="mb-1 rounded-xl bg-slate-50 p-3">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-all duration-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-[0.99]"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 active:scale-[0.97] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMobile}>
          <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" />
          <aside
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-slate-200 bg-white shadow-elevated animate-slide-in-right"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div className="inline-flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <span className="font-display text-base font-semibold text-slate-900">FindCare</span>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 active:scale-[0.97]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <MobileNavLink key={to} to={to} icon={Icon} onClick={closeMobile}>
                  {label}
                </MobileNavLink>
              ))}
            </nav>

            <div className="border-t border-slate-200 p-4">
              {!user && (
                <div className="space-y-2">
                  <Link to="/login" onClick={closeMobile} className="btn btn-secondary btn-md w-full rounded-xl">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={closeMobile} className="btn btn-primary btn-md w-full rounded-xl">
                    Create Account
                  </Link>
                </div>
              )}

              {user && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-semibold text-white">
                      {avatarInitial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{roleLabel}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-ghost btn-md w-full justify-start rounded-xl text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function MobileNavLink({ to, icon: Icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium',
          'transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300',
          isActive
            ? 'bg-primary-50 text-primary-700 shadow-soft'
            : 'text-slate-700 hover:bg-slate-100 active:scale-[0.99]',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}
