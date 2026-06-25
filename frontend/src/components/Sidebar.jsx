"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wind,
  Home,
  Search,
  Bell,
  Send,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";


export default function Sidebar({ user, onLogout }) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/explore", label: "Explorer", icon: Search },
    { href: `/profile/${user.userId}`, label: "Profil", icon: User },
  ];

  return (
    <aside className="w-60 h-screen flex-shrink-0 flex flex-col border-r border-gray-100 bg-white px-3 py-6 hidden min-[501px]:flex">
        <div className="flex items-center gap-2 px-3 mb-8">
            <Wind size={20} className="text-green-500" />
            <span className="text-xl font-bold tracking-tight">Breeze</span>
        </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-green-50 text-green-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="bg-green-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Link href="/" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors mb-5">
        <Wind size={16} />
        Créer une breeze
      </Link>


      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <img
              src={user.profile}
              alt={user.name?.[0]?.toUpperCase()}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            {/* <p className="text-xs text-gray-400 truncate">@{user.tag}</p> */}
          </div>
        </button>

        {showMenu && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                setShowMenu(false);
                onLogout?.();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}