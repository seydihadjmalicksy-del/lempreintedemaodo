import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = {
    fr: {
      title: "Administration",
      subtitle: "Connectez-vous pour accéder au panneau d'administration",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      login: "Se connecter",
      loggingIn: "Connexion...",
      error: "Identifiants incorrects"
    },
    en: {
      title: "Administration",
      subtitle: "Login to access the administration panel",
      username: "Username",
      password: "Password",
      login: "Login",
      loggingIn: "Logging in...",
      error: "Invalid credentials"
    },
    ar: {
      title: "الإدارة",
      subtitle: "سجّل الدخول للوصول إلى لوحة الإدارة",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      loggingIn: "جاري الدخول...",
      error: "بيانات غير صحيحة"
    },
    wo: {
      title: "Administration",
      subtitle: "Duggal ngir am accès ci panneau administration bi",
      username: "Tur",
      password: "Baatu jàll",
      login: "Dugg",
      loggingIn: "Yiy dugg...",
      error: "Identifiants yi baaxul"
    }
  };

  const t = labels[language] || labels.fr;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminExpires", response.data.expires_at);
        localStorage.setItem("adminUsername", response.data.username);
        
        toast.success(language === 'en' ? "Login successful!" : "Connexion réussie !");
        navigate("/admin");
      }
    } catch (err) {
      setError(t.error);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004D33] via-[#003d29] to-[#002a1c] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-[#004D33]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-white/70">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                {t.username}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004D33] focus:border-transparent transition-all"
                  placeholder="admin"
                  required
                  data-testid="admin-username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004D33] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  data-testid="admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#004D33] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004D33] hover:bg-[#003d29] text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="admin-login-button"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t.loggingIn}
                </>
              ) : (
                t.login
              )}
            </button>
          </div>

          {/* Hint */}
          <p className="mt-6 text-center text-sm text-[#888888]">
            {t.hint}
          </p>
        </form>

        {/* Decorative Element */}
        <div className="text-center mt-8">
          <div className="text-[#D4AF37] text-4xl bismillah-text">☪</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
