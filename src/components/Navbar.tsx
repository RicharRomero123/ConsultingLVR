import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/userService";
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, BarChart2, UserCircle, LucideIcon, Coins } from 'lucide-react';

// --- Función de ayuda para ofuscar el email ---
const obfuscateEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    if (localPart.length <= 3) {
        return `${localPart.slice(0, 1)}***@${domain}`;
    }
    return `${localPart.slice(0, 3)}***@${domain}`;
};

// --- Definición de tipos ---
type NavLink = { href: string; text: string; };
type DropdownLink = { href: string; text: string; icon: LucideIcon; };

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    // --- Estados del componente ---
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userCoins, setUserCoins] = useState<number | null>(null);
    const [loadingCoins, setLoadingCoins] = useState<boolean>(true);
    const [activeSection, setActiveSection] = useState('');
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Enlaces de navegación principal ---
    const navLinks: NavLink[] = [
        { href: "#quienes-somos", text: "Quiénes Somos" },
        { href: "#especialidades", text: "Especialidades" },
        { href: "#portafolio", text: "Portafolio" },
        { href: "#precios", text: "Mantenimiento" },
    ];

    // --- Enlaces del menú desplegable del usuario ---
    const dropdownLinks: DropdownLink[] = [
        { href: "/dashboard/mi-perfil", text: "Mi Perfil", icon: UserCircle },
        { href: "/dashboard/servicios", text: "Servicios", icon: LayoutDashboard },
        { href: "/dashboard/mis-ordenes", text: "Mis Órdenes", icon: ShoppingBag },
        { href: "/dashboard/mis-transacciones", text: "Transacciones", icon: BarChart2 },
    ];

    // --- Efecto para detectar scroll y la sección activa ---
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);

            const sections = navLinks.map(link => document.getElementById(link.href.substring(1)));
            let currentSectionId = '';

            for (const section of sections) {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // Offset para que la sección se active un poco antes
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSectionId = `#${section.id}`;
                        break;
                    }
                }
            }
            setActiveSection(currentSectionId);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecutar al cargar
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navLinks]); // Dependencia por si los links cambiaran

    // --- Efecto para asegurar que el código se ejecute en el cliente ---
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Función para obtener las monedas del usuario ---
    const fetchUserCoins = useCallback(async () => {
        if (user?.id) {
            setLoadingCoins(true);
            try {
                const userData = await userService.getUserById(user.id);
                setUserCoins(userData.monedas);
            } catch (err) { 
                console.error('Error fetching user coins:', err);
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

    // --- Efecto para cerrar el dropdown al hacer clic fuera ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // --- Función para cerrar sesión ---
    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push('/');
    };

    // --- Clase dinámica para el fondo del navbar ---
    const navbarBgClass = isScrolled || isMobileMenuOpen 
        ? 'bg-black shadow-lg' 
        : 'bg-gray-900/50 backdrop-blur-sm';

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navbarBgClass}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
                
                {/* --- Logo y Nombre del Sitio --- */}
                <Link href="/" className="flex items-center gap-2" aria-label="Página de inicio de Consultora LVR" onClick={() => setMobileMenuOpen(false)}>
                    {/* ✅ CORRECCIÓN: Se usa la ruta "/logo.png" que apunta a `public/logo.png` */}
                    <Image 
                        src="/logo.png" 
                        alt="Consultora LVR Logo" 
                        width={40} 
                        height={40} 
                        className="rounded-md" 
                        priority // Ayuda a que el logo cargue más rápido
                    />
                    <span className="text-xl font-semibold text-white hidden sm:block">Consultora<span className="text-emerald-500">LVR</span></span>
                </Link>

                {/* --- Navegación para Escritorio --- */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="relative px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-emerald-500">
                            {link.text}
                            {/* Línea animada para el enlace activo */}
                            {activeSection === link.href && (
                                <motion.div
                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500"
                                    layoutId="underline"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* --- Sección de Usuario (Autenticado o Invitado) --- */}
                <div className="hidden md:flex items-center gap-4">
                    {isClient && user ? (
                        <div className="flex items-center gap-4">
                            {/* Info del usuario y monedas */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm text-white font-semibold truncate max-w-[120px]">{user.nombre}</p>
                                    <p className="text-xs text-slate-400 truncate max-w-[120px]">{obfuscateEmail(user.email)}</p>
                                </div>
                                <div className="flex items-center bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
                                    <Coins className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                                    {loadingCoins ? (
                                        <div className="h-4 w-8 bg-slate-700 rounded animate-pulse"></div>
                                    ) : (
                                        <span className="font-bold text-white text-sm">{userCoins ?? 0}</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Dropdown del perfil */}
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-lg text-white border-2 border-transparent hover:border-emerald-500 transition-colors flex-shrink-0">
                                    {user.nombre.charAt(0).toUpperCase()}
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg origin-top-right"
                                        >
                                            <div className="p-2">
                                                <div className="px-2 pt-1 pb-2">
                                                    <p className="text-sm text-white font-semibold">Menú del Panel</p>
                                                </div>
                                                <div className="border-t border-gray-700 my-1"></div>
                                                {dropdownLinks.map(link => (
                                                    <Link key={link.href} href={link.href} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-emerald-500 transition-colors">
                                                        <link.icon size={16} />
                                                        {link.text}
                                                    </Link>
                                                ))}
                                                <div className="border-t border-gray-700 my-1"></div>
                                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-red-400 rounded-md hover:bg-red-500/20 hover:text-red-300 transition-colors">
                                                    <LogOut size={16} />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-emerald-500 transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register" className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm shadow-md">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>

                {/* --- Botón del Menú Móvil --- */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2" aria-label="Abrir menú">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* --- Panel del Menú Móvil --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
                        className="md:hidden fixed top-0 right-0 w-full h-full bg-black flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                             <Link href="/" className="flex items-center gap-2" aria-label="Página de inicio de Consultora LVR" onClick={() => setMobileMenuOpen(false)}>
                                {/* ✅ CORRECCIÓN: Logo local en el menú móvil */}
                                <Image src="/logo.png" alt="Consultora LVR Logo" width={32} height={32} className="rounded-md" />
                                <span className="text-lg font-semibold text-white">Consultora<span className="text-emerald-500">LVR</span></span>
                             </Link>
                             <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2" aria-label="Cerrar menú">
                                 <X size={24} />
                             </button>
                        </div>

                        <div className="flex-grow flex flex-col justify-between p-4 overflow-y-auto">
                            {/* Contenido del menú móvil */}
                            <div className="space-y-2">
                                {isClient && user && (
                                    <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                                                {user.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-semibold text-white truncate">{user.nombre}</p>
                                                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                                            <span className="text-sm text-gray-300 font-medium">Mis Monedas</span>
                                            {loadingCoins ? (
                                                <div className="h-5 w-10 bg-slate-700 rounded animate-pulse"></div>
                                            ) : (
                                                <span className="font-bold text-white text-lg">{userCoins ?? 0}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 pt-4">Navegación</p>
                                <nav className="flex flex-col gap-1 text-gray-300">
                                    {navLinks.map(link => (
                                        <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-emerald-500 transition-colors py-3 rounded-md px-4 hover:bg-gray-800/50">{link.text}</Link>
                                    ))}
                                </nav>
                                
                                {isClient && user && (
                                    <>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 pt-6">Mi Panel</p>
                                        <nav className="flex flex-col gap-1 text-gray-300">
                                            {dropdownLinks.map(link => (
                                                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-lg hover:text-emerald-500 transition-colors py-3 px-4 rounded-md hover:bg-gray-800/50">
                                                    <link.icon size={20} />
                                                    {link.text}
                                                </Link>
                                            ))}
                                        </nav>
                                    </>
                                )}
                            </div>
                            
                            {/* Botones inferiores del menú móvil */}
                            <div className="mt-6">
                                {isClient && user ? (
                                    <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full text-red-400 hover:text-red-300 transition-colors py-3 px-4 rounded-md bg-red-500/10 hover:bg-red-500/20">
                                        <LogOut size={20} />
                                        <span className="text-lg font-medium">Cerrar Sesión</span>
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center w-full bg-gray-700 text-white font-semibold px-4 py-3 rounded-md hover:bg-gray-600 transition-colors text-base">
                                            Iniciar Sesión
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center w-full bg-emerald-600 text-white font-semibold px-4 py-3 rounded-md hover:bg-emerald-700 transition-colors text-base shadow-md">
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
