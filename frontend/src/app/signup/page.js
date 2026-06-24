"use client";

import {
  Wind,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/core/services/auth.service";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.username || !form.email || !form.password) {
      setError("Tous les champs sont requis");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      router.push("/signin?registered=true");
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#efefea] min-h-[90vh] grid lg:grid-cols-2">

        <div className="p-12 flex flex-col">
          <div className="flex items-center gap-3 mb-16">
            <Wind className="text-green-500" size={32} />
            <span className="font-bold text-4xl">Breeze</span>
          </div>

          <form onSubmit={handleSubmit}>

            <h1 className="text-6xl font-bold tracking-tight text-black">
              Inscription
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Rejoignez la communauté Breeze.
            </p>

            <div className="mt-12 space-y-6">

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex gap-2 items-center">
                  <AlertCircle
                    size={18}
                    className="text-red-500 flex-shrink-0"
                  />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Nom d'utilisateur
                </label>

                <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
                  <User size={18} className="text-gray-400" />

                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Votre nom d'utilisateur"
                    className="flex-1 ml-3 outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Adresse email
                </label>

                <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Votre adresse email"
                    className="flex-1 ml-3 outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Mot de passe
                </label>

                <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    className="flex-1 ml-3 outline-none bg-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Confirmation du mot de passe
                </label>

                <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                    className="flex-1 ml-3 outline-none bg-transparent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 transition rounded-2xl text-white font-semibold text-lg"
              >
                {loading
                  ? "Inscription en cours..."
                  : "Créer mon compte"}
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-gray-500">
                Déjà inscrit ?
                <Link
                  href="/signin"
                  className="text-green-500 ml-2 font-medium"
                >
                  Se connecter
                </Link>
              </p>

            </div>
          </form>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#f8f8f4] to-[#dbe6d3]">
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-14">
            <h2 className="text-6xl font-bold leading-tight max-w-xl">
              Rejoignez <span className="text-green-500">le souffle</span>,
              <br />
              créez vos <span className="text-green-500">breezes</span>.
            </h2>

            <p className="text-gray-600 mt-6 text-lg max-w-lg">
              Publiez des contenus éphémères et échangez avec votre communauté.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}