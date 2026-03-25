import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Clock, X, Stethoscope, ArrowRight, FileText, AlertCircle } from 'lucide-react';

const statusConfig = {
  PENDING: { class: 'status-pending', label: 'Scheduled', dot: 'bg-amber-500' },
  CONFIRMED: { class: 'status-confirmed', label: 'Confirmed', dot: 'bg-blue-500' },
  COMPLETED: { class: 'status-completed', label: 'Completed', dot: 'bg-emerald-500' },
  CANCELLED: { class: 'status-cancelled', label: 'Cancelled', dot: 'bg-slate-400' },
};

const statusBar = {
  PENDING: 'bg-amber-500',
  CONFIRMED: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-slate-400',
};

function SkeletonRow() {
  return (
    <div className="card p-5 flex gap-4">
      <div className="skeleton w-1 h-full rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-40 rounded-md" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-4 w-56 rounded-md" />
        <div className="skeleton h-4 w-32 rounded-md" />
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;
    try {
      const data = await appointmentService.getByPatient(user.id);
      setAppointments(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await appointmentService.cancel(id);
      toast.success('Appointment cancelled successfully.');
      loadAppointments();
    } catch {
      toast.error('Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="page-wrapper max-w-3xl">
      <div className="mb-8">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">View and manage your upcoming and past visits</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No appointments yet</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm">
            You haven't booked any appointments. Browse our doctors to find the right one for you.
          </p>
          <Link to="/doctors" className="btn btn-primary btn-md group">
            Find a Doctor <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt, i) => {
            const status = statusConfig[apt.status] || statusConfig.PENDING;
            return (
              <div
                key={apt.id}
                className="card group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex">
                  {/* Timeline bar */}
                  <div className={`w-1 flex-shrink-0 rounded-l-xl ${statusBar[apt.status] || 'bg-amber-500'}`} />

                  <div className="flex-1 p-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{apt.doctorName}</h3>
                          <p className="text-sm text-primary-600">{apt.doctorSpecialization}</p>
                        </div>
                      </div>
                      <span className={`badge text-xs ${status.class}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {apt.startTime?.substring(0, 5)} – {apt.endTime?.substring(0, 5)}
                      </span>
                    </div>

                    {/* Symptoms / Notes */}
                    {apt.symptoms && (
                      <div className="flex items-start gap-2 text-sm mb-2 p-2.5 rounded-lg bg-slate-50">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span><span className="font-medium text-foreground">Symptoms:</span> {apt.symptoms}</span>
                      </div>
                    )}
                    {apt.doctorNotes && (
                      <div className="flex items-start gap-2 text-sm p-2.5 rounded-lg bg-emerald-50">
                        <FileText className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span><span className="font-medium text-emerald-700">Doctor Notes:</span> {apt.doctorNotes}</span>
                      </div>
                    )}

                    {/* Cancel */}
                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        disabled={cancellingId === apt.id}
                        className="mt-3 btn btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {cancellingId === apt.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
