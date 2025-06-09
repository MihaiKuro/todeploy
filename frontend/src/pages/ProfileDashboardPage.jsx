import { motion } from "framer-motion";
import { ShoppingBag, Car, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const DashboardCard = ({ icon: Icon, title, value, link, color }) => (
    <Link to={link}>
        <motion.div
            className={`bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </motion.div>
    </Link>
);

const ProfileDashboardPage = () => {
    const { user } = useUserStore();

    const stats = [
        {
            icon: ShoppingBag,
            title: "Comenzi în Așteptare",
            value: "2",
            link: "/profile/orders",
            color: "bg-blue-600",
        },
        {
            icon: Car,
            title: "Vehicule Înregistrate",
            value: "3",
            link: "/profile/vehicles",
            color: "bg-green-600",
        },
        {
            icon: Calendar,
            title: "Următoarea Programare",
            value: "15 Mai",
            link: "/profile/appointments",
            color: "bg-purple-600",
        },
        {
            icon: MapPin,
            title: "Adrese Salvate",
            value: "2",
            link: "/profile/addresses",
            color: "bg-orange-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Panou Principal</h2>
                <p className="text-gray-400 mt-1">Bine ai revenit, {user?.name}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <DashboardCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Activitate Recentă</h3>
                <div className="bg-gray-700 rounded-lg divide-y divide-gray-600">
                    <div className="p-4">
                        <p className="text-white">Comandă nouă plasată</p>
                        <p className="text-sm text-gray-400">Acum 2 zile</p>
                    </div>
                    <div className="p-4">
                        <p className="text-white">Programare service confirmată</p>
                        <p className="text-sm text-gray-400">Acum 5 zile</p>
                    </div>
                    <div className="p-4">
                        <p className="text-white">Vehicul nou adăugat</p>
                        <p className="text-sm text-gray-400">Acum o săptămână</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Acțiuni Rapide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/profile/appointments/new">
                        <motion.button
                            className="w-full p-4 bg-[#2B4EE6] text-white rounded-lg hover:bg-blue-600 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Programează Service
                        </motion.button>
                    </Link>
                    <Link to="/profile/vehicles/new">
                        <motion.button
                            className="w-full p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Adaugă Vehicul
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboardPage; 