import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalService } from '../services/hospitalService';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { Building2, MapPin, Phone, Mail, Star, ArrowLeft, Stethoscope, ArrowRight, Layers } from 'lucide-react';

function PageSkeleton() {
  return (
    <div className="page-wrapper max-w-6xl animate-pulse">
      <div className="skeleton h-4 w-32 rounded-md mb-6" />
      <div className="skeleton h-64 rounded-2xl mb-6" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-8 w-64 rounded-md" />
          <div className="skeleton h-5 w-48 rounded-md" />
          <div className="skeleton h-20 w-full rounded-md" />
        </div>
        <div className="skeleton h-48 rounded-xl" />
      </div>
    </div>
  );
}

const typeStyles = {
  GOVERNMENT: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PRIVATE: 'bg-blue-50 text-blue-700 border border-blue-200',
  NGO: 'bg-amber-50 text-amber-700 border border-amber-200',
};

export default function HospitalDetailPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, deps, docs] = await Promise.all([
          hospitalService.getById(id),
          departmentService.getByHospital(id),
          doctorService.getByHospital(id),
        ]);
        setHospital(h);
        setDepartments(deps);
        setDoctors(docs);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <PageSkeleton />;

  if (!hospital) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Hospital not found</h3>
        <p className="text-sm text-muted-foreground mb-4">The hospital you're looking for doesn't exist or has been removed.</p>
        <Link to="/hospitals" className="btn btn-secondary btn-md">Back to Hospitals</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper max-w-6xl animate-fade-in">
      {/* Back */}
      <Link to="/hospitals" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to Hospitals
      </Link>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary-50 to-primary-100 h-48 sm:h-64">
        {hospital.imageUrl ? (
          <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-20 w-20 text-primary-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
          <span className={`badge text-xs mb-2 ${typeStyles[hospital.type] || 'badge-secondary'}`}>
            {hospital.type}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{hospital.name}</h1>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info card */}
          <div className="card card-body">
            <h2 className="section-title mb-4">Hospital Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={MapPin} label="Address" value={`${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zipCode}`} />
              {hospital.phone && <InfoRow icon={Phone} label="Phone" value={hospital.phone} />}
              {hospital.email && <InfoRow icon={Mail} label="Email" value={hospital.email} />}
              {hospital.rating && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-sm font-semibold">{hospital.rating} / 5.0</p>
                  </div>
                </div>
              )}
            </div>
            {hospital.description && (
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{hospital.description}</p>
            )}
          </div>

          {/* Departments */}
          {departments.length > 0 && (
            <div>
              <h2 className="section-title mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary-500" /> Departments
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {departments.map((d) => (
                  <div key={d.id} className="card card-body p-4 hover:border-primary/30 transition-colors">
                    <h3 className="font-semibold text-sm">{d.name}</h3>
                    {d.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctors */}
          {doctors.length > 0 && (
            <div>
              <h2 className="section-title mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary-500" /> Doctors
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.id}`}
                    className="card card-hover p-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                        {doc.profileImageUrl ? (
                          <img src={doc.profileImageUrl} alt={doc.doctorName} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <Stethoscope className="h-5 w-5 text-primary-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-primary-600 transition-colors">{doc.doctorName}</h3>
                        <p className="text-xs text-primary-600">{doc.specialization}</p>
                        <p className="text-xs text-muted-foreground">{doc.qualification} · {doc.yearsOfExperience} yrs</p>
                      </div>
                      {doc.consultationFee && (
                        <span className="text-sm font-bold text-foreground">₹{doc.consultationFee}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            {/* Quick stats card */}
            <div className="card card-body">
              <h3 className="font-semibold text-sm mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <StatRow label="Departments" value={departments.length} />
                <StatRow label="Doctors" value={doctors.length} />
                <StatRow label="Type" value={hospital.type} />
                {hospital.rating && <StatRow label="Rating" value={`${hospital.rating} ★`} />}
              </div>
            </div>

            {/* CTA */}
            <div className="card card-body bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-100">
              <h3 className="font-semibold text-sm mb-2">Need an Appointment?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Browse our doctors and book your visit online.
              </p>
              <Link to="/doctors" className="btn btn-primary btn-md w-full group">
                Find a Doctor <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4.5 w-4.5 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
