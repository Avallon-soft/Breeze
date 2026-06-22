import Sidebar from "@/components/Sidebar";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import RightPanel from "@/components/RightPanel";
import { currentUser, posts } from "@/lib/data";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar user={currentUser} />

        <main className="flex-1 h-screen overflow-y-auto border-x border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold text-gray-900">Accueil</h1>
            <CreatePost user={currentUser} />
            {/* <DansLAir /> */}
            <p className="text-xs text-gray-400 mt-0.5">
              Des breezes qui circulent en ce moment
            </p>
            <section className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </section>
          </div>
        </main>

        <RightPanel user={currentUser} />
      </div>
      </ProtectedRoute>
  );
}