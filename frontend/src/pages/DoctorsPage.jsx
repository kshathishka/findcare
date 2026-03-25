import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Stethoscope,
  Building2,
  ArrowRight,
  Briefcase,
  Star,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { doctorService } from '../services/doctorService';

function DoctorCardSkeleton() {
  return (
    <article className="card rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-32 rounded-md" />
          <div className="skeleton h-4 w-28 rounded-md" />
          <div className="skeleton h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3">
        <div className="skeleton h-4 w-20 rounded-md" />
        <div className="skeleton h-4 w-20 rounded-md" />
      </div>
    </article>
  );
}

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  useEffect(() => {
    const initialQuery = searchParams.get('search') || '';
    const initialAvailability = searchParams.get('availability') || 'ALL';
    setSearchInput(initialQuery);
    setSearchKeyword(initialQuery);
    setAvailabilityFilter(['ALL', 'AVAILABLE', 'UNAVAILABLE'].includes(initialAvailability) ? initialAvailability : 'ALL');
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadDoctors = async () => {
      setLoading(true);
      try {
        const hasKeyword = Boolean(searchKeyword.trim());
        const data = hasKeyword
          ? await doctorService.search(searchKeyword.trim())
          : await doctorService.getAll();
        if (!cancelled) {
          setDoctors(data);
        }
      } catch {
        if (!cancelled) {
          setDoctors([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, [searchKeyword]);

  const filteredDoctors = useMemo(() => {
    if (availabilityFilter === 'ALL') {
      return doctors;
    }
    if (availabilityFilter === 'AVAILABLE') {
      return doctors.filter((doctor) => Boolean(doctor.isAvailable));
    }
    return doctors.filter((doctor) => !doctor.isAvailable);
  }, [doctors, availabilityFilter]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextKeyword = searchInput.trim();
    setSearchKeyword(nextKeyword);

    const nextParams = new URLSearchParams(searchParams);
    if (nextKeyword) {
      nextParams.set('search', nextKeyword);
    } else {
      nextParams.delete('search');
    }
    if (availabilityFilter !== 'ALL') {
      nextParams.set('availability', availabilityFilter);
    } else {
      nextParams.delete('availability');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleAvailabilityChange = (value) => {
    setAvailabilityFilter(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value !== 'ALL') {
      nextParams.set('availability', value);
    } else {
      nextParams.delete('availability');
    }
    if (searchKeyword.trim()) {
      nextParams.set('search', searchKeyword.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchKeyword('');
    setAvailabilityFilter('ALL');
    setSearchParams({}, { replace: true });
  };

  const hasResults = filteredDoctors.length > 0;

  return (
    <div className="page-wrapper">
      <section className="mb-8 sm:mb-10">
        <h1 className="text-h2 font-display text-slate-900">Find Doctors</h1>
        <p className="mt-2 max-w-2xl text-body text-slate-600">
          Discover specialists by expertise, compare profiles, and book with confidence.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <label htmlFor="doctor-search" className="sr-only">Search doctors</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="doctor-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by doctor name or specialization"
              className="input h-11 rounded-xl border-slate-200 pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <label htmlFor="doctor-availability" className="sr-only">Filter by availability</label>
            <select
              id="doctor-availability"
              value={availabilityFilter}
              onChange={(event) => handleAvailabilityChange(event.target.value)}
              className="input h-11 min-w-[170px] rounded-xl border-slate-200 pl-10"
            >
              <option value="ALL">All Availability</option>
              <option value="AVAILABLE">Available Now</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-md h-11 rounded-xl px-5">
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost btn-md h-11 rounded-xl px-4 text-slate-600 hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <section>
          <div className="mb-4 h-4 w-36 rounded bg-slate-100" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <DoctorCardSkeleton key={index} />
            ))}
          </div>
        </section>
      )}

      {!loading && !hasResults && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No doctors found</h2>
          <p className="mx-auto mt-2 max-w-md text-body text-slate-600">
            No providers match your current filters. Adjust search terms or reset filters to explore all doctors.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={handleClear} className="btn btn-primary btn-md rounded-xl px-5">
              Reset Filters
            </button>
            <Link to="/hospitals" className="btn btn-secondary btn-md rounded-xl px-5">
              Explore Hospitals
            </Link>
          </div>
        </section>
      )}

      {!loading && hasResults && (
        <section>
          <p className="mb-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredDoctors.length}</span> doctors
          </p>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor, index) => (
              <Link
                key={doctor.id}
                to={'/doctors/' + doctor.id}
                className="group card rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                style={{ animationDelay: String(index * 60) + 'ms' }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-primary-100 to-cyan-100">
                    {doctor.profileImageUrl ? (
                      <img
                        src={doctor.profileImageUrl}
                        alt={doctor.doctorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-primary-700">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-primary-700">
                      {doctor.doctorName}
                    </h3>
                    <p className="line-clamp-1 text-sm font-medium text-primary-700">{doctor.specialization}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">{doctor.qualification || 'MBBS, Specialist'}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                    <Building2 className="h-3 w-3" />
                    {doctor.hospitalName || 'General Hospital'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                    <Briefcase className="h-3 w-3" />
                    {doctor.yearsOfExperience || 0} yrs
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating || '4.8'}</span>
                    </div>
                    <span className={[
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      doctor.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200',
                    ].join(' ')}>
                      {doctor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                    Profile
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
