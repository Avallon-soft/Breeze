"use client"

import { Wind, User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();

  const { login, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(
      username,
      password
    );

    if (success) {
      router.push("/");
    }
  }
  return (
    <div className="min-h-screen bg-[#f8f8f5] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#efefea] min-h-[90vh] grid lg:grid-cols-2">
        <div className="p-12 flex flex-col">
          <div className="flex items-center gap-3 mb-16">
            <Wind className="text-green-500" size={32} />
            <span className="font-bold text-4xl">Breeze</span>
          </div>

          <form className="max-w" onSubmit={handleSubmit}>

            <h1 className="text-6xl font-bold tracking-tight text-black">
              Connexion
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Retrouvez ce qui souffle autour de vous.
            </p>

            <div className="mt-12 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Nom d'utilisateur
                </label>

                <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
                  <User size={18} className="text-gray-400" />
                  <input
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Votre nom d'utilisateur"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="flex-1 ml-3 outline-none bg-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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

              <button className="w-full h-14 bg-green-500 hover:bg-green-600 transition rounded-2xl text-white font-semibold text-lg">
                Se connecter
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-gray-500">
                Pas encore de compte ?
                <Link href="/signup" className="text-green-500 ml-2 font-medium cursor-pointer">
                  Créer un compte
                </Link>
              </p>


            </div>
          </form>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#f8f8f4] to-[#dbe6d3]">
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-14">
            <h2 className="text-6xl font-bold leading-tight max-w-xl">
              Partagez <span className="text-green-500">l'instant</span>,
              <br />
              pas <span className="text-green-500">l'éternité</span>.
            </h2>

            <p className="text-gray-600 mt-6 text-lg max-w-lg">
              Chaque breeze disparaît après la durée que vous choisissez.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}