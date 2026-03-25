import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Clock, CheckCircle, User, Mail, Phone, FileText, Stethoscope } from 'lucide-react';

const statusConfig = {
  PENDING: { class: 'status-pending', label: 'Scheduled', dot: 'bg-amber-500' },
  CONFIRMED: { class: 'status-confirmed', label: 'Confirmed', dot: 'bg-blue-500' },
  COMPLETED: { class: 'status-completed', label: 'Completed', dot: 'bg-emerald-500' },
  CANCELLED: { class: 'status-cancelled', label: 'Cancelled', dot: 'bg-slate-400' },
};

function SkeletonRow() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-40 rounded-md" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-4 w-56 rounded-md" />
      <div className="skeleton h-4 w-36 rounded-md" />
    </div>
  );
}

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;
    try {
      const data = await appointmentService.getByDoctor(user.id);
      setAppointments(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    setSubmitting(true);
    try {
      await appointmentService.complete(id, doctorNotes);
      toast.success('Appointment marked as completed.');
      setCompletingId(null);
      setDoctorNotes('');
      loadAppointments();
    } catch {
      toast.error('Failed to complete appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Stethoscope className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h1 className="page-title">My Patients</h1>
          <p className="page-subtitle">Manage and complete your appointments</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No appointments</h3>
          <p className="text-sm text-muted-foreground max-w-sm">You don't have any patient appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt, i) => {
            const status = statusConfig[apt.status] || statusConfig.PENDING;
            const isActive = apt.status === 'PENDING' || apt.status === 'CONFIRMED';

            return (
              <div
                key={apt.id}
                className="card animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex">
                  <div className={`w-1 flex-shrink-0 rounded-l-xl ${status.dot}`} />
                  <div className="flex-1 p-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{apt.patientName}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                            {apt.patientEmail && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {apt.patientEmail}
                              </span>
                            )}
                            {apt.patientPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {apt.patientPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`badge text-xs ${status.class}`}>{status.label}</span>
                    </div>

                    {/* Date/time */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {apt.appointmentDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {apt.startTime?.substring(0, 5)} – {apt.endTime?.substring(0, 5)}
                      </span>
                    </div>

                    {/* Symptoms */}
                    {apt.symptoms && (
                      <div className="flex items-start gap-2 text-sm p-2.5 rounded-lg bg-slate-50 mb-3">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span><span className="font-medium">Symptoms:</span> {apt.symptoms}</span>
                      </div>
                    )}

                    {/* Complete action */}
                    {isActive && (
                      <>
                        {completingId === apt.id ? (
                          <div className="mt-3 space-y-3 animate-fade-in">
                            <textarea
                              value={doctorNotes}
                              onChange={(e) => setDoctorNotes(e.target.value)}
                              rows={2}
                              placeholder="Add notes for this patient..."
                              className="input resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleComplete(apt.id)}
                                disabled={submitting}
                                className="btn btn-success btn-sm"
                              >
                                {submitting ? (
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3.5 w-3.5" />
                                )}
                                Confirm Complete
                              </button>
                              <button
                                onClick={() => { setCompletingId(null); setDoctorNotes(''); }}
                                className="btn btn-ghost btn-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCompletingId(apt.id)}
                            className="mt-3 btn btn-ghost btn-sm text-emerald-600 hover:bg-emerald-50"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                          </button>
                        )}
                      </>
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
