import {Bell, House, MessageCircle, Settings, User} from 'lucide-react'

export default function Home() {
    return (
        <div className="flex gap-4 h-screen m-4">
            <div className="basis-96 flex flex-col items-center p-5 border-r">
                <span className="text-4xl mb-5">Breezer</span>
                    <ul className="list-none flex flex-col gap-4">
                        <li className="flex gap-2 items-center ">
                            <House/> Accueil
                        </li>
                        <li className="flex gap-2 items-center ">
                            <Bell/> Notifications
                        </li>
                        <li className="flex gap-2 items-center ">
                            <MessageCircle/> Messages
                        </li>
                        <li className="flex gap-2 items-center ">
                            <User/> Profil
                        </li>
                        <li className="flex gap-2 items-center ">
                            <Settings/> Paramètres
                        </li>
                    </ul>
            </div>
            <div className="basis-full">
                <div className="p-5">
                    <span className="text-4xl">Accueil</span>
                </div>

            </div>
            <div className="basis-128 flex flex-col gap-4">
                <div className="p-5 border rounded-sm">
                    <span>Mon espace</span>
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
