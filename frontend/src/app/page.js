import Image from "next/image";
import { Bell, Heart, House, Info, MessageCircle, Repeat, Send, Settings, Share, User } from 'lucide-react'
import algeria from "../../asset/algeria.png"



export default function Home() {
  return (
    <div className="flex gap-4 p-4 pb-0 pt-0 h-screen">
      <div className="basis-96 flex flex-col items-start p-5 border-r">
        <div className="flex">
          <span className="text-4xl mb-5">Breezer</span>
        </div>

        <ul className="list-none flex flex-col gap-4">
          <li className="flex gap-2 items-center ">
            <House /> Accueil
          </li>
          <li className="flex gap-2 items-center ">
            <Bell /> Notifications
          </li>
          <li className="flex gap-2 items-center ">
            <MessageCircle /> Messages
          </li>
          <li className="flex gap-2 items-center ">
            <User /> Profil
          </li>
          <li className="flex gap-2 items-center ">
            <Settings /> Paramètres
          </li>
        </ul>
      </div>
      <div className="basis-full">
        <div className="p-5 flex flex-col gap-4 overflow-y-scroll max-h-full">
          <span className="text-4xl">Accueil</span>
          <div className="border p-4 rounded-sm flex gap-4">
            <div>
              <img src={user.profile} width={50} />
            </div>
            <div className="flex flex-col gap-10 w-full">
              <div className="flex">
                <span className="text-gray-400">Qu'est-ce qui souffle aujourd'hui ...</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  Durée de la breeze <Info color="gray" />
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-400 inset-ring inset-ring-gray-400/20">1 h</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-400 inset-ring inset-ring-gray-400/20">3 h</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-400 inset-ring inset-ring-gray-400/20">12 h</span>
                  </div>
                </div>
                <div>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 text-sm rounded-sm">Publier</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
           <span className="text-xl"> Dans l'air</span>
          </div>
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-sm flex gap-4">
              <div>
                <img src={user.profile} width={50} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span>{post.username}</span>
                  <span className="text-gray-400">@{post.tag}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="mt-2 flex gap-10">
                  <div className="flex gap-1"><Heart /> {post.likes}</div>
                  <div className="flex gap-1"><MessageCircle /> {post.comments}</div>
                  <div className="flex gap-1"><Repeat /> {post.reposts}</div>
                  <div className="flex gap-1"><Send /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="basis-140 flex flex-col gap-4 pt-4">
        <div className="p-5 border rounded-sm flex flex-col gap-4">
          <span>Mon espace</span>
          <div className="flex gap-4">
            <img src={user.profile} width={70} />
            <div className="flex flex-col justify-center">
              <span>{user.name}</span>
              <span>@{user.tag}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <span className="font-bold">{formatNumber(user.subscriptions)}</span>
              <span>Abonnements</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{formatNumber(user.subscribers)}</span>
              <span>Abonnés</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">{formatNumber(user.posts)}</span>
              <span>Breezes</span>
            </div>
          </div>
        </div>
        <div className="p-5 border rounded-sm">
          <span>S'éteint bientôt</span>
        </div>
        <div className="p-5 border rounded-sm">
          <span>Suggestion pour vous</span>
        </div>
      </div>
    </div>
  );
}

const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(number);
};

const user = {
  "name": "EnzoDu77",
  "tag": "enzo_du_78",
  "subscriptions": 584,
  "subscribers": 975_430,
  "posts": 1_420_023,
  "profile": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
}

const posts = [
  {
    "id": 42,
    "username": "Camille Delcourt",
    "tag": "camilleds",
    "timestampStart": 1781599530,
    "timestampEnd": 1781563530,
    "content": "Balade improvisée ce matin. Parfois les meilleurs plans n'étaient pas prévus. 🍃",
    "likes": 42,
    "comments": 8,
    "reposts": 5
  },
  {
    "id": 43,
    "username": "Camille Delcourt",
    "tag": "camilleds",
    "timestampStart": 1781599530,
    "timestampEnd": 1781563530,
    "content": "Balade improvisée ce matin. Parfois les meilleurs plans n'étaient pas prévus. 🍃 <image src='https://upload.wikimedia.org/wikipedia/fr/thumb/8/8b/Nouveau_logo_%C3%89quipe_d%27Alg%C3%A9rie.png/960px-Nouveau_logo_%C3%89quipe_d%27Alg%C3%A9rie.png' width='50%'/>",
    "likes": 42,
    "comments": 8,
    "reposts": 5
  },
  {
    "id": 44,
    "username": "Camille Delcourt",
    "tag": "camilleds",
    "timestampStart": 1781599530,
    "timestampEnd": 1781563530,
    "content": "Balade improvisée ce matin. Parfois les meilleurs plans n'étaient pas prévus. 🍃 <image src='https://upload.wikimedia.org/wikipedia/fr/thumb/8/8b/Nouveau_logo_%C3%89quipe_d%27Alg%C3%A9rie.png/960px-Nouveau_logo_%C3%89quipe_d%27Alg%C3%A9rie.png' width='50%'/>",
    "likes": 42,
    "comments": 8,
    "reposts": 5
  }
]


// Post : 
// Début = 12H
// Fin = 14h

// Temps actuel = 13h
// Temps restant = Fin - Temps actuel = 14h - 13h = 1h

// Post 
// Début = 12h
// Durée = 2h

// Temps actuel = 13h
// Temps restant = Temps actuel - Début =