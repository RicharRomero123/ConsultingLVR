// my-client-app/src/components/ClientNav.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/userService";
import {
    Home, ShoppingCart, Package, CreditCard, User as UserIcon,
    LogOut, Menu, X, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const ClientNav: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [userCoins, setUserCoins] = useState<number | null>(null);
    const [loadingCoins, setLoadingCoins] = useState<boolean>(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchUserCoins = useCallback(async () => {
        if (user?.id) {
            setLoadingCoins(true);
            try {
                const userData = await userService.getUserById(user.id);
                setUserCoins(userData.monedas);
            } catch (err: unknown) { 
                console.error('Error al obtener monedas del usuario:', err);
                setUserCoins(null);
            } finally {
                setLoadingCoins(false);
            }
        }
    }, [user?.id]);

    useEffect(() => {
        if (isClient && user) {
            fetchUserCoins();
        }
    }, [fetchUserCoins, isClient, user]);

    const navItems = [
        { name: 'Inicio', href: '/dashboard', icon: Home },
        { name: 'Tienda', href: '/dashboard/servicios', icon: ShoppingCart },
        { name: 'Mis Órdenes', href: '/dashboard/mis-ordenes', icon: Package },
        { name: 'Mis Transacciones', href: '/dashboard/mis-transacciones', icon: CreditCard },
        { name: 'Mi Perfil', href: '/dashboard/mi-perfil', icon: UserIcon },
    ];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                           <Image src="https://res.cloudinary.com/dod56svuf/image/upload/v1751876631/softwareVip.png" alt="SistemasVIP Logo" width={40} height={40} className="rounded-md"/>
                           {/* CAMBIO: Se aplica el color de acento verde al logo para consistencia de marca. */}
                           <span className="text-xl font-bold text-white hidden sm:block">Sistemas<span className="text-emerald-500">VIP</span></span>
                        </Link>
                    </div>

                    {/* Menú desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link key={item.href} href={item.href} className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 hover:text-emerald-400'}`}>
                                    {item.name}
                                    {isActive && (
                                        // CAMBIO: Se usa el color verde para el indicador de la página activa.
                                        <motion.span layoutId="underline-client" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sección usuario y botones */}
                    <div className="flex items-center gap-4">
                        {isClient && user && (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex items-center bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
                                    <Coins className="h-5 w-5 text-amber-400 mr-2" />
                                    {loadingCoins ? (
                                        <div className="h-4 w-8 bg-slate-700 rounded animate-pulse"></div>
                                    ) : (
                                        <span className="font-bold text-white">{userCoins ?? 0}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">{user.nombre}</p>
                                        <p className="text-xs text-slate-400 capitalize">{user.rol.toLowerCase()}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg text-white border-2 border-slate-600">
                                        {user.nombre.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CAMBIO: Menú móvil rediseñado como un panel lateral para una mejor experiencia. */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
                        className="md:hidden fixed top-0 right-0 w-full h-full bg-black flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-slate-700 h-20">
                           <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                               <Image src="https://res.cloudinary.com/dod56svuf/image/upload/v1751876631/softwareVip.png" alt="SistemasVIP Logo" width={32} height={32} className="rounded-md"/>
                               <span className="text-lg font-semibold text-white">Sistemas<span className="text-emerald-500">VIP</span></span>
                           </Link>
                           <button onClick={() => setIsMenuOpen(false)} className="text-slate-300 p-2">
                               <X size={24} />
                           </button>
                        </div>
                        
                        <div className="flex-grow p-4 flex flex-col">
                            <nav className="flex-grow">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} 
                                            className={`flex items-center gap-4 px-4 py-4 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400'}`}>
                                            <item.icon size={20} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="border-t border-slate-700 pt-4">
                                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300">
                                    <LogOut size={20}/>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default ClientNav;
