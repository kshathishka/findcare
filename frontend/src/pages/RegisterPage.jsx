import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { Heart, User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

const roles = [
  { value: 'PATIENT', label: 'Patient', desc: 'Book appointments & manage health' },
  { value: 'DOCTOR', label: 'Doctor', desc: 'Manage patients & schedule' },
  { value: 'RECEPTIONIST', label: 'Receptionist', desc: 'Front desk & check-ins' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'PATIENT' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, phone: form.phone || null };
      const data = await authService.register(payload);
      login(data);
      toast.success('Account created! Welcome to FindCare.');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const d = err.response?.data;
      const msg =
        d?.message ||
        (d?.errors ? d.errors.map((e) => e.defaultMessage).join(', ') : null) ||
        (err.message === 'Network Error' ? 'Cannot connect to server. Is the backend running on port 8080?' : 'Registration failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel — illustration (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative text-white max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join FindCare Today</h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Create your free account and start booking appointments with top healthcare professionals.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { n: '50+', l: 'Hospitals' },
              { n: '200+', l: 'Doctors' },
              { n: '10K+', l: 'Appointments' },
              { n: '25K+', l: 'Patients' },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-xl font-bold">{n}</div>
                <div className="text-xs text-primary-100">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Find<span className="text-primary-500">Care</span>
            </span>
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-fade-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input id="reg-name" type="text" required minLength={2} value={form.name} onChange={update('name')} className="input pl-10" placeholder="John Doe" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="reg-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input id="reg-email" type="email" required value={form.email} onChange={update('email')} className="input pl-10" placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="reg-password" type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={form.password} onChange={update('password')} className="input pl-10 pr-10" placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="reg-phone">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input id="reg-phone" type="tel" value={form.phone} onChange={update('phone')} className="input pl-10" placeholder="1234567890" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      form.role === r.value
                        ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-border hover:border-primary/30 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className="block text-2xs text-muted-foreground mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
