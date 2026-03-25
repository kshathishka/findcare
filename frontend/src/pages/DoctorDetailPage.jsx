import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { timeSlotService } from '../services/timeSlotService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft, Stethoscope, Building2, Clock, Calendar, CheckCircle,
  AlertCircle, Briefcase, DollarSign, FileText,
} from 'lucide-react';

function PageSkeleton() {
  return (
    <div className="page-wrapper max-w-6xl animate-pulse">
      <div className="skeleton h-4 w-32 rounded-md mb-6" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex gap-5">
              <div className="skeleton w-20 h-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-6 w-48 rounded-md" />
                <div className="skeleton h-4 w-36 rounded-md" />
                <div className="skeleton h-4 w-56 rounded-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="skeleton h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const doc = await doctorService.getById(id);
        setDoctor(doc);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (selectedDate && id) loadSlots();
  }, [selectedDate, id]);

  const loadSlots = async () => {
    try {
      const data = await timeSlotService.getAvailable(id, selectedDate);
      setSlots(data);
    } catch {
      setSlots([]);
    }
  };

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!selectedSlot) return;

    setBooking(true);
    try {
      await appointmentService.create({
        doctorId: Number(id),
        timeSlotId: selectedSlot,
        symptoms,
        patientNotes: notes,
      });
      toast.success('Appointment booked successfully!');
      setSelectedSlot(null);
      setSymptoms('');
      setNotes('');
      loadSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageSkeleton />;

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Stethoscope className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Doctor not found</h3>
        <p className="text-sm text-muted-foreground mb-4">This doctor profile doesn't exist.</p>
        <Link to="/doctors" className="btn btn-secondary btn-md">Back to Doctors</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper max-w-6xl animate-fade-in">
      <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to Doctors
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="card card-body">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                {doctor.profileImageUrl ? (
                  <img src={doctor.profileImageUrl} alt={doctor.doctorName} className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <Stethoscope className="h-9 w-9 text-primary-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{doctor.doctorName}</h1>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                  </div>
                  <span className={`badge text-xs ${doctor.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {doctor.isAvailable ? '● Available' : '● Unavailable'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
              <StatItem icon={Building2} label="Hospital" value={doctor.hospitalName} />
              <StatItem icon={Briefcase} label="Experience" value={`${doctor.yearsOfExperience} years`} />
              <StatItem icon={DollarSign} label="Consultation" value={doctor.consultationFee ? `₹${doctor.consultationFee}` : 'Free'} />
            </div>

            {doctor.bio && (
              <div className="mt-5 pt-5 border-t border-border">
                <h3 className="text-sm font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {doctor.isAvailable ? (
              <div className="card card-body">
                <h2 className="font-semibold flex items-center gap-2 mb-5">
                  <Calendar className="h-5 w-5 text-primary-500" /> Book Appointment
                </h2>

                {/* Date */}
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1.5">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input"
                  />
                </div>

                {/* Time slots */}
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">Available Slots</label>
                  {slots.length === 0 ? (
                    <div className="text-center py-6 rounded-xl bg-slate-50 border border-dashed border-border">
                      <Clock className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No available slots for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                            selectedSlot === slot.id
                              ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                              : 'border-border hover:border-primary/30 hover:bg-slate-50'
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {slot.startTime?.substring(0, 5)} – {slot.endTime?.substring(0, 5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Symptoms & notes (visible after slot selection) */}
                {selectedSlot && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        <FileText className="inline h-3.5 w-3.5 mr-1" /> Symptoms
                      </label>
                      <input
                        type="text"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe your symptoms..."
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Any additional info..."
                        className="input resize-none"
                      />
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={booking}
                      className="btn btn-primary btn-lg w-full"
                    >
                      {booking ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Booking...
                        </span>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" /> Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card card-body text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Currently Unavailable</h3>
                <p className="text-xs text-muted-foreground">This doctor is not accepting appointments right now. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-1.5">
        <Icon className="h-4 w-4 text-primary-600" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  );
}
