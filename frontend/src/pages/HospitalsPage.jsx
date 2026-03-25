import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Star,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { hospitalService } from '../services/hospitalService';

const typeLabels = {
  GOVERNMENT: 'Government',
  PRIVATE: 'Private',
  NGO: 'NGO',
};

const badgeStyles = {
  GOVERNMENT: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PRIVATE: 'bg-primary-50 text-primary-700 border border-primary-200',
  NGO: 'bg-amber-50 text-amber-700 border border-amber-200',
};

function HospitalCardSkeleton() {
  return (
    <article className="card overflow-hidden rounded-2xl border border-slate-200">
      <div className="skeleton h-40 rounded-none" />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="skeleton h-5 w-36 rounded-md" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 rounded-md" />
          <div className="skeleton h-4 w-44 rounded-md" />
          <div className="skeleton h-4 w-28 rounded-md" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="skeleton h-4 w-24 rounded-md" />
          <div className="skeleton h-4 w-20 rounded-md" />
        </div>
      </div>
    </article>
  );
}

export default function HospitalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    const initialQuery = searchParams.get('search') || '';
    const initialType = searchParams.get('type') || 'ALL';
    setSearchInput(initialQuery);
    setSearchKeyword(initialQuery);
    setTypeFilter(['ALL', 'GOVERNMENT', 'PRIVATE', 'NGO'].includes(initialType) ? initialType : 'ALL');
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadHospitals = async () => {
      setLoading(true);
      try {
        let data = [];
        const hasSearch = Boolean(searchKeyword.trim());
        if (hasSearch) {
          data = await hospitalService.search(searchKeyword.trim());
        } else if (typeFilter !== 'ALL') {
          data = await hospitalService.getByType(typeFilter);
        } else {
          data = await hospitalService.getAll();
        }

        if (!cancelled) {
          setHospitals(data);
        }
      } catch {
        if (!cancelled) {
          setHospitals([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHospitals();
    return () => {
      cancelled = true;
    };
  }, [searchKeyword, typeFilter]);

  const filteredHospitals = useMemo(() => {
    if (typeFilter === 'ALL' || searchKeyword.trim()) {
      return hospitals;
    }
    return hospitals.filter((hospital) => hospital.type === typeFilter);
  }, [hospitals, typeFilter, searchKeyword]);

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
    if (typeFilter !== 'ALL') {
      nextParams.set('type', typeFilter);
    } else {
      nextParams.delete('type');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value !== 'ALL') {
      nextParams.set('type', value);
    } else {
      nextParams.delete('type');
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
    setTypeFilter('ALL');
    setSearchParams({}, { replace: true });
  };

  const hasResults = filteredHospitals.length > 0;

  return (
    <div className="page-wrapper">
      <section className="mb-8 sm:mb-10">
        <h1 className="text-h2 font-display text-slate-900">Discover Hospitals</h1>
        <p className="mt-2 max-w-2xl text-body text-slate-600">
          Explore trusted care centers, compare hospital types, and choose the right facility for your appointment.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <label htmlFor="hospital-search" className="sr-only">Search hospitals</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="hospital-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by hospital name, city, or address"
              className="input h-11 rounded-xl border-slate-200 pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <label htmlFor="hospital-type" className="sr-only">Filter by type</label>
            <select
              id="hospital-type"
              value={typeFilter}
              onChange={(event) => handleTypeChange(event.target.value)}
              className="input h-11 min-w-[160px] rounded-xl border-slate-200 pl-10"
            >
              <option value="ALL">All Types</option>
              <option value="GOVERNMENT">Government</option>
              <option value="PRIVATE">Private</option>
              <option value="NGO">NGO</option>
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
          <div className="mb-4 h-4 w-40 rounded bg-slate-100" />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <HospitalCardSkeleton key={index} />
            ))}
          </div>
        </section>
      )}

      {!loading && !hasResults && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No hospitals found</h2>
          <p className="mx-auto mt-2 max-w-md text-body text-slate-600">
            Try changing your search term or selecting another hospital type to see more providers.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={handleClear} className="btn btn-primary btn-md rounded-xl px-5">
              Reset Filters
            </button>
            <Link to="/doctors" className="btn btn-secondary btn-md rounded-xl px-5">
              Browse Doctors
            </Link>
          </div>
        </section>
      )}

      {!loading && hasResults && (
        <section>
          <p className="mb-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredHospitals.length}</span> hospitals
          </p>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredHospitals.map((hospital, index) => (
              <Link
                key={hospital.id}
                to={'/hospitals/' + hospital.id}
                className="group card rounded-2xl border border-slate-200 bg-white transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-primary-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                style={{ animationDelay: String(index * 60) + 'ms' }}
              >
                <div className="relative h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-50 via-cyan-50 to-white">
                  {hospital.imageUrl ? (
                    <img
                      src={hospital.imageUrl}
                      alt={hospital.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary-300" />
                    </div>
                  )}
                  <span className={[
                    'absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold',
                    badgeStyles[hospital.type] || 'bg-slate-100 text-slate-700 border border-slate-200',
                  ].join(' ')}>
                    {typeLabels[hospital.type] || 'Hospital'}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-primary-700">
                    {hospital.name}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="line-clamp-1">{hospital.city}, {hospital.state}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="line-clamp-1">{hospital.phone || 'Contact via reception'}</span>
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {hospital.description || 'Comprehensive care services with experienced teams and modern infrastructure.'}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{hospital.rating || '4.6'}</span>
                      <span className="text-slate-400">/ 5.0</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                      View details
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
