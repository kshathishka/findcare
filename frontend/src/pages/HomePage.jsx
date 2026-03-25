import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Building2,
  Stethoscope,
  CalendarClock,
  ShieldCheck,
  Users,
  Clock3,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';

const featureHighlights = [
  {
    icon: Building2,
    title: 'Compare Hospitals',
    description: 'Discover hospitals by location, specialty coverage, and care quality profiles.',
  },
  {
    icon: Stethoscope,
    title: 'Find Right Specialists',
    description: 'Browse doctor availability and specialties to match patient needs quickly.',
  },
  {
    icon: CalendarClock,
    title: 'Book in Minutes',
    description: 'Schedule confirmed appointments instantly with real-time slot visibility.',
  },
];

const trustIndicators = [
  { icon: Building2, metric: '80+', label: 'Partner Hospitals' },
  { icon: Stethoscope, metric: '1,200+', label: 'Verified Doctors' },
  { icon: Users, metric: '95K+', label: 'Registered Patients' },
  { icon: CalendarClock, metric: '430K+', label: 'Appointments Booked' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = searchQuery.trim();
    if (!keyword) {
      return;
    }
    navigate('/hospitals?search=' + encodeURIComponent(keyword));
  };

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative border-b border-slate-200/70 bg-hero-glow pb-14 pt-12 sm:pb-20 sm:pt-16 lg:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-primary-200/35 blur-3xl" />
          <div className="absolute right-0 top-12 h-60 w-60 rounded-full bg-cyan-200/30 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-caption text-primary-700 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Built for modern hospitals and care teams
            </div>

            <h1 className="mt-6 text-h1 font-display text-slate-900 animate-fade-in [animation-delay:120ms]">
              Healthcare Booking That Feels
              <span className="block text-gradient">Fast, Trusted, and Human</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-subtitle text-slate-600 animate-fade-in [animation-delay:200ms]">
              FindCare helps patients discover care, compare providers, and book appointments with confidence from any device.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl animate-fade-in [animation-delay:300ms]">
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-elevated sm:flex-row sm:items-center">
                <label htmlFor="home-search" className="sr-only">Search hospitals or doctors</label>
                <div className="flex flex-1 items-center rounded-xl border border-transparent bg-slate-50 px-3 py-2.5 transition-all duration-300 focus-within:border-primary-200 focus-within:bg-white focus-within:shadow-soft">
                  <Search className="h-4.5 w-4.5 text-slate-500" />
                  <input
                    id="home-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by hospital, doctor, city, or specialty"
                    className="ml-2.5 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="btn btn-primary btn-md w-full rounded-xl px-5 sm:w-auto"
                >
                  Search Care
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-caption text-slate-500 animate-fade-in [animation-delay:380ms]">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified providers
              <span className="text-slate-300">|</span>
              <ShieldCheck className="h-3.5 w-3.5 text-primary-600" />
              Secure booking
              <span className="text-slate-300">|</span>
              <Clock3 className="h-3.5 w-3.5 text-amber-600" />
              Real-time slot availability
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row animate-fade-in [animation-delay:440ms]">
              <Link to="/hospitals" className="btn btn-primary btn-lg rounded-xl px-7">
                Explore Hospitals
              </Link>
              <Link to="/doctors" className="btn btn-secondary btn-lg rounded-xl px-7">
                Meet Specialists
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustIndicators.map(({ icon: Icon, metric, label }) => (
              <article
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{metric}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/80 py-14 sm:py-18">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-display text-slate-900">Why Patients Choose FindCare</h2>
            <p className="mt-3 text-body text-slate-600">
              A connected booking journey designed for trust, transparency, and speed.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featureHighlights.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary-200 hover:shadow-card-hover"
                style={{ animationDelay: String(index * 100) + 'ms' }}
              >
                <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft">
                  <span className="absolute -inset-1 rounded-xl border border-primary-300/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Icon className="relative h-5 w-5" />
                </div>
                <h3 className="mt-4 text-h3 text-slate-900">{title}</h3>
                <p className="mt-2 text-body text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="container">
          <div className="rounded-3xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-cyan-50 p-7 sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-h2 font-display text-slate-900">Ready for Your Next Appointment?</h2>
              <p className="mt-3 text-body text-slate-600">
                Create an account and book your first consultation in less than two minutes.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/register" className="btn btn-primary btn-lg rounded-xl px-7">
                  Create Free Account
                </Link>
                <Link to="/hospitals" className="btn btn-ghost btn-lg rounded-xl px-7 text-slate-700 hover:bg-slate-100">
                  Browse Hospitals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
