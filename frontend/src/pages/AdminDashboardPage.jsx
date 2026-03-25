import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { appointmentService } from '../services/appointmentService';
import { Building2, Stethoscope, Users, Calendar, Clock, AlertCircle, TrendingUp, Activity } from 'lucide-react';

function SkeletonCard() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="skeleton w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-20 rounded-md" />
          <div className="skeleton h-7 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tablePage, setTablePage] = useState(1);

  const PAGE_SIZE = 5;

  useEffect(() => {
    const load = async () => {
      try {
        const [data, today] = await Promise.all([
          dashboardService.getAdminStats(),
          appointmentService.getToday().catch(() => []),
        ]);
        setStats(data);
        setRecentAppointments(today || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="mb-8">
          <div className="skeleton h-8 w-48 rounded-md mb-2" />
          <div className="skeleton h-4 w-64 rounded-md" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Failed to load dashboard</h3>
        <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(recentAppointments.length / PAGE_SIZE));
  const paginatedAppointments = recentAppointments.slice(
    (tablePage - 1) * PAGE_SIZE,
    tablePage * PAGE_SIZE
  );

  const cards = [
    {
      icon: Building2,
      label: 'Total Hospitals',
      value: stats.totalHospitals,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+3 this month',
      trendColor: 'text-blue-600',
    },
    {
      icon: Stethoscope,
      label: 'Total Doctors',
      value: stats.totalDoctors,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: '+12 this month',
      trendColor: 'text-emerald-600',
    },
    {
      icon: Users,
      label: 'Total Patients',
      value: stats.totalPatients,
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      trend: '+48 this month',
      trendColor: 'text-violet-600',
    },
    {
      icon: Calendar,
      label: 'Total Appointments',
      value: stats.totalAppointments,
      bg: 'bg-primary-50',
      iconColor: 'text-primary-600',
      trend: 'All time',
      trendColor: 'text-primary-600',
    },
    {
      icon: Clock,
      label: "Today's Appointments",
      value: stats.todayAppointments,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: 'Live count',
      trendColor: 'text-amber-600',
    },
    {
      icon: AlertCircle,
      label: 'Pending Appointments',
      value: stats.pendingAppointments,
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      trend: 'Needs attention',
      trendColor: 'text-red-500',
    },
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-primary-500" />
            <h1 className="page-title">Admin Dashboard</h1>
          </div>
          <p className="page-subtitle">Overview of FindCare operations and metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 rounded-lg px-3 py-1.5 border border-border">
          <Clock className="h-3.5 w-3.5" />
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, label, value, bg, iconColor, trend, trendColor }, i) => (
          <div
            key={label}
            className="card card-hover p-6 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                <TrendingUp className="h-3 w-3" />
                {trend}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
            <p className="text-3xl font-bold tracking-tight animate-count-up">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Hospitals', desc: 'Add, edit, or remove hospitals', icon: Building2, color: 'from-blue-500 to-primary-500' },
            { label: 'Manage Doctors', desc: 'Add or update doctor profiles', icon: Stethoscope, color: 'from-emerald-500 to-teal-500' },
            { label: 'View All Appointments', desc: 'Review appointment records', icon: Calendar, color: 'from-violet-500 to-purple-500' },
          ].map(({ label, desc, icon: Icon, color }) => (
            <button
              key={label}
              className="card p-5 text-left group hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-0.5 group-hover:text-primary-600 transition-colors">{label}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Operations table */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="section-title">Today's Appointment Stream</h2>
          <span className="text-xs text-muted-foreground">
            {recentAppointments.length} records
          </span>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="card card-body text-center py-10">
            <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-slate-50/80 border-b border-border">
              <div className="col-span-3">Patient</div>
              <div className="col-span-3">Doctor</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Status</div>
            </div>

            <div className="divide-y divide-border">
              {paginatedAppointments.map((apt) => (
                <div key={apt.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="md:col-span-3 min-w-0">
                    <p className="text-sm font-semibold truncate">{apt.patientName || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground truncate">{apt.patientEmail || apt.patientPhone || 'No contact'}</p>
                  </div>
                  <div className="md:col-span-3 min-w-0">
                    <p className="text-sm font-medium truncate">{apt.doctorName || 'N/A'}</p>
                    <p className="text-xs text-primary-600 truncate">{apt.doctorSpecialization || 'General'}</p>
                  </div>
                  <div className="md:col-span-2 text-sm text-muted-foreground">{apt.appointmentDate || 'N/A'}</div>
                  <div className="md:col-span-2 text-sm text-muted-foreground">
                    {apt.startTime?.substring(0, 5)} - {apt.endTime?.substring(0, 5)}
                  </div>
                  <div className="md:col-span-2">
                    <span className={`badge text-xs ${apt.status === 'COMPLETED' ? 'status-completed' : apt.status === 'CONFIRMED' ? 'status-confirmed' : apt.status === 'CANCELLED' ? 'status-cancelled' : 'status-pending'}`}>
                      {apt.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-slate-50/70">
              <p className="text-xs text-muted-foreground">
                Page {tablePage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                  disabled={tablePage === 1}
                  className="btn btn-secondary btn-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                  disabled={tablePage === totalPages}
                  className="btn btn-secondary btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
