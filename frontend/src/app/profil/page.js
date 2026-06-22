"use client";

import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import CountdownRing from "@/components/CountdownRing";
import { currentUser, posts } from "@/lib/data";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";


export default function ProfilePage() {
  const { logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={currentUser} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto pb-20">

            {/* COVER */}

            <div className="h-72 rounded-b-[32px] overflow-hidden relative">
              <img
                src="https://picsum.photos/1400/500"
                alt=""
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* PROFILE */}

            <div className="px-8">
              <div className="flex justify-between items-end -mt-16">
                <img
                  src={currentUser.profile}
                  alt=""
                  className="w-36 h-36 rounded-full border-8 border-white object-cover"
                />

                <button className="h-12 px-6 rounded-xl border border-gray-200 bg-white font-medium">
                  Modifier le profil
                </button>
              </div>

              <div className="mt-5">
                <h1 className="text-3xl font-bold">
                  {currentUser.name}
                </h1>

                <p className="text-gray-500 mt-1">
                  @{currentUser.tag}
                </p>

                <p className="mt-4 text-gray-700 max-w-2xl">
                  Photographe amateur • Montagne • Moments éphémères •
                  Chaque instant mérite d'être vécu avant de disparaître.
                </p>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-3 gap-4 mt-8">
                <Stat
                  value="584"
                  label="Abonnements"
                />
                <Stat
                  value="975K"
                  label="Abonnés"
                />
                <Stat
                  value="1420"
                  label="Breezes"
                />
              </div>

              {/* POSTS */}

              <div className="mt-10">
                <h2 className="font-semibold text-xl mb-6">
                  Breezes actives
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100"
                    >
                      {post.image && (
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-52 object-cover"
                        />
                      )}

                      <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">
                            Expire dans
                          </span>

                          <CountdownRing
                            progress={
                              post.minutesLeft /
                              post.totalMinutes
                            }
                            size={60}
                          >
                            <span className="text-xs font-bold">
                              {post.timeLeft}
                            </span>
                          </CountdownRing>
                        </div>

                        <p className="text-sm text-gray-700">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>

        <RightPanel user={currentUser} />
      </div>
    </ProtectedRoute>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm mt-1">
        {label}
      </p>
    </div>
  );
}