import { Wind, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-[#f8f8f5] p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#efefea] min-h-[90vh] grid lg:grid-cols-2">

        <div className="p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-12">
            <Wind className="text-green-500" size={32} />
            <span className="font-bold text-4xl">Breeze</span>
          </div>
          <div className="max-w">
            <h1 className="text-6xl font-bold">
              Inscription
            </h1>

            <p className="text-gray-500 mt-3">
              Rejoignez la communauté Breeze.
            </p>

            <div className="space-y-5 mt-10">

              <Input
                icon={<User size={18} />}
                placeholder="Nom d'utilisateur"
              />

              <Input
                icon={<Mail size={18} />}
                placeholder="Adresse email"
              />

              <Input
                icon={<Lock size={18} />}
                placeholder="Mot de passe"
              />

              <Input
                icon={<Lock size={18} />}
                placeholder="Confirmation du mot de passe"
              />

              <button className="w-full h-14 bg-green-500 rounded-2xl text-white font-semibold">
                Créer mon compte
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm">
                  ou
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Déjà inscrit ?
                <Link href="/signin" className="text-green-500 ml-2 font-medium cursor-pointer">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#f8f8f4] to-[#dbe6d3]" />
      </div>
    </div>
  );
}

function Input({ icon, placeholder }) {
  return (
    <div className="h-14 rounded-2xl border border-gray-200 flex items-center px-4">
      {icon}
      <input
        placeholder={placeholder}
        className="flex-1 ml-3 outline-none"
      />
    </div>
  );
}