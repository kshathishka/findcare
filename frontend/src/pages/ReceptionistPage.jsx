import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Clock, Search, UserCheck, RefreshCw, User, Stethoscope, ClipboardList } from 'lucide-react';

const statusConfig = {
  PENDING: { class: 'status-pending', label: 'Waiting' },
  CONFIRMED: { class: 'status-confirmed', label: 'Confirmed' },
  COMPLETED: { class: 'status-completed', label: 'Completed' },
  CANCELLED: { class: 'status-cancelled', label: 'Cancelled' },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border animate-pulse">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-32 rounded-md" />
        <div className="skeleton h-3 w-48 rounded-md" />
      </div>
      <div className="skeleton h-9 w-24 rounded-lg" />
    </div>
  );
}

export default function ReceptionistPage() {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [checkingInId, setCheckingInId] = useState(null);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getToday();
      setAppointments(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return loadToday();
    setLoading(true);
    try {
      const data = await appointmentService.search(search);
      setAppointments(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    setCheckingInId(id);
    try {
      await appointmentService.checkIn(id);
      toast.success('Patient checked in successfully!');
      loadToday();
    } catch {
      toast.error('Check-in failed. Please try again.');
    } finally {
      setCheckingInId(null);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h1 className="page-title">Front Desk</h1>
            <p className="page-subtitle">Today's appointments and patient check-in</p>
          </div>
        </div>
        {/* Pending count */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {pendingCount} waiting for check-in
          </div>
        )}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by patient name or email..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSearch} className="btn btn-primary btn-md">
            <Search className="h-4 w-4" /> Search
          </button>
          <button onClick={loadToday} className="btn btn-secondary btn-md">
            <RefreshCw className="h-4 w-4" /> Today
          </button>
        </div>
      </div>

      {/* Appointments Table / List */}
      {loading ? (
        <div className="card">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No appointments today</h3>
          <p className="text-sm text-muted-foreground max-w-sm">There are no scheduled appointments for today.</p>
        </div>
      ) : (
        <div className="card divide-y divide-border">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-slate-50/80">
            <div className="col-span-3">Patient</div>
            <div className="col-span-3">Doctor</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {appointments.map((apt, i) => {
            const status = statusConfig[apt.status] || statusConfig.PENDING;
            const isPending = apt.status === 'PENDING';

            return (
              <div
                key={apt.id}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 items-center transition-colors animate-fade-in ${
                  isPending ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50/50'
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Patient */}
                <div className="sm:col-span-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{apt.patientPhone || apt.patientEmail}</p>
                  </div>
                </div>

                {/* Doctor */}
                <div className="sm:col-span-3 min-w-0">
                  <p className="text-sm font-medium truncate flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
                    {apt.doctorName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{apt.doctorSpecialization}</p>
                </div>

                {/* Time */}
                <div className="sm:col-span-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  {apt.startTime?.substring(0, 5)} – {apt.endTime?.substring(0, 5)}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <span className={`badge text-xs ${status.class}`}>{status.label}</span>
                  {apt.checkedInAt && (
                    <p className="text-2xs text-muted-foreground mt-1">
                      ✓ {new Date(apt.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="sm:col-span-2 flex justify-end">
                  {isPending && (
                    <button
                      onClick={() => handleCheckIn(apt.id)}
                      disabled={checkingInId === apt.id}
                      className="btn btn-primary btn-sm min-w-[110px]"
                    >
                      {checkingInId === apt.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                      Check In
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
