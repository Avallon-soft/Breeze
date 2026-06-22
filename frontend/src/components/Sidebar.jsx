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
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/explorer", label: "Explorer", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell, badge: 4 },
  { href: "/messages", label: "Messages", icon: Send, badge: 2 },
  { href: "/profil", label: "Profil", icon: User },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen flex-shrink-0 flex flex-col border-r border-gray-100 bg-white px-3 py-6">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
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

      <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors mb-5">
        <Wind size={16} />
        Créer une breeze
      </button>

      <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <img
          src={user.profile}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">@{user.tag}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </aside>
  );
}