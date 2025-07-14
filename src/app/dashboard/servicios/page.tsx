// my-client-app/src/app/dashboard/servicios/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/types'; // Assuming types are in this file
import serviceService from '@/services/serviceService';
import orderService from '@/services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clock, AlertTriangle, X, Coins, Search, Menu, Briefcase, ExternalLink, Cpu } from 'lucide-react';
import Image from 'next/image';

// --- INTERFAZ PARA ERRORES DE API ---
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// --- NUEVAS CATEGORÍAS DE FILTRO ---
const categories = [
    { type: 'heading', name: 'Tipo de Proyecto' },
    { name: 'Todos los Proyectos', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/layout-grid_axkrdh.png', keyword: 'Todos', filterType: 'all' },
    { name: 'Aplicación Web', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/globe_yq9j6k.png', keyword: 'Aplicación Web', filterType: 'tipoDeSoftware' },
    { name: 'Aplicación Móvil', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/smartphone_v6ctyl.png', keyword: 'Aplicación Móvil', filterType: 'tipoDeSoftware' },
    { name: 'Landing Page', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/file-text_jtvk2b.png', keyword: 'Landing Page', filterType: 'tipoDeSoftware' },
    { name: 'E-commerce', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/shopping-cart_oedaob.png', keyword: 'E-commerce', filterType: 'tipoDeSoftware' },
    { name: 'Sistema de Escritorio', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/monitor_xbtqkz.png', keyword: 'Sistema de Escritorio', filterType: 'tipoDeSoftware' },
    { type: 'heading', name: 'Rubro de Negocio' },
    { name: 'Restaurante', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/utensils_g9wzde.png', keyword: 'Restaurante', filterType: 'rubro' },
    { name: 'Gimnasio', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/dumbbell_wz5vke.png', keyword: 'Gimnasio', filterType: 'rubro' },
    { name: 'Inmobiliaria', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/building_s2kvyh.png', keyword: 'Inmobiliaria', filterType: 'rubro' },
    { name: 'Tienda de Ropa', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/shirt_g7x9v1.png', keyword: 'Tienda', filterType: 'rubro' },
    { name: 'Consultorio Médico', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/stethoscope_a2v1mh.png', keyword: 'Médico', filterType: 'rubro' },
    { name: 'Hotel', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/building-2_p9qjfe.png', keyword: 'Hotel', filterType: 'rubro' },
    { name: 'Educación', icon: 'https://res.cloudinary.com/dod56svuf/image/upload/v1720999841/icons-white/graduation-cap_h4vjvy.png', keyword: 'Educación', filterType: 'rubro' },
];

// --- COMPONENTE DEL MODAL DE CONFIRMACIÓN (Sin cambios, ya que usa campos comunes) ---
const ConfirmationModal = ({ service, onConfirm, onCancel }: { service: Service | null, onConfirm: () => void, onCancel: () => void }) => {
  if (!service) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-white relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-500/10 p-3 rounded-full border border-blue-500/30 mb-4"><ShoppingCart className="text-blue-400" size={28} /></div>
          <h2 className="text-2xl font-bold mb-2">Confirmar Compra</h2>
          <p className="text-slate-300 mb-4">¿Estás seguro de que deseas comprar <strong className="text-blue-400">{service.nombre}</strong> por <strong className="text-amber-400">{service.precioMonedas} Monedas</strong>?</p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs p-3 rounded-lg flex items-start gap-2 w-full mb-6">
            <AlertTriangle size={24} className="flex-shrink-0 mt-0.5" />
            <p>Una vez confirmada la compra, se iniciará el proceso de entrega. Este servicio tiene un tiempo de espera estimado de <strong className="font-bold">{service.tiempoEsperaMinutos} minutos</strong>.</p>
          </div>
          <div className="flex justify-center gap-4 w-full">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onCancel} className="w-full bg-slate-700 hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg transition-colors">Aceptar y Comprar</motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- COMPONENTE DE LA BARRA LATERAL DE CATEGORÍAS (Actualizado para manejar encabezados) ---
const CategorySidebar = ({ activeCategory, setActiveCategory, closeMenu }: { activeCategory: string, setActiveCategory: (category: { keyword: string, filterType: string }) => void, closeMenu?: () => void }) => (
    <div className="space-y-1">
        {categories.map((category, index) => (
            category.type === 'heading' ? (
                <h3 key={index} className="text-sm font-semibold text-slate-400 px-3 pt-4 pb-2">{category.name}</h3>
            ) : (
                <button
                    key={category.name}
                    onClick={() => {
                        setActiveCategory({ keyword: category.keyword!, filterType: category.filterType! });
                        closeMenu?.();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200
                        ${activeCategory === category.keyword ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`
                    }
                >
                    <Image src={category.icon!} alt={category.name!} width={20} height={20} className="opacity-80"/>
                    <span>{category.name}</span>
                </button>
            )
        ))}
    </div>
);


const ServiciosPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchasingServiceId, setPurchasingServiceId] = useState<string | null>(null);
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [activeCategory, setActiveCategory] = useState({ keyword: 'Todos', filterType: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lógica de filtrado actualizada
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filtrar por categoría
    if (activeCategory.keyword !== 'Todos') {
      filtered = filtered.filter(service => {
        if (activeCategory.filterType === 'tipoDeSoftware') {
          return service.detalles.tipoDeSoftware.toLowerCase() === activeCategory.keyword.toLowerCase();
        }
        if (activeCategory.filterType === 'rubro') {
          // Usamos 'includes' para que 'Tienda' coincida con 'Tienda de Ropa'
          return service.detalles.rubro.toLowerCase().includes(activeCategory.keyword.toLowerCase());
        }
        return true;
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(service =>
            service.nombre.toLowerCase().includes(lowercasedTerm) ||
            service.descripcion.toLowerCase().includes(lowercasedTerm) ||
            service.detalles.rubro.toLowerCase().includes(lowercasedTerm) ||
            service.detalles.lenguaje.toLowerCase().includes(lowercasedTerm) ||
            service.detalles.framework.toLowerCase().includes(lowercasedTerm)
        );
    }
    return filtered;
  }, [services, activeCategory, searchTerm]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await serviceService.getAllServices();
        // Asegurarse de que los datos tienen la estructura esperada
        const validData = data.filter(s => s.detalles); 
        setServices(validData);
      } catch (err: unknown) {
        console.error('Error al obtener servicios:', err);
        const error = err as ApiError;
        setError(error.response?.data?.message || 'Error al cargar los servicios disponibles.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handlePurchaseClick = (service: Service) => {
    setSelectedService(service);
    setShowConfirmation(true);
  };

  const confirmPurchase = async () => {
    if (!selectedService) return;
    if (authLoading || !user?.id) {
      setPurchaseError('No se pudo procesar la compra: Usuario no autenticado.');
      setShowConfirmation(false);
      return;
    }
    setPurchasingServiceId(selectedService.id);
    setShowConfirmation(false);
    setPurchaseMessage(null);
    setPurchaseError(null);
    try {
      const newOrder = await orderService.createOrder(user.id, selectedService.id);
      setPurchaseMessage(`¡Compra realizada! Tu orden #${newOrder.id.substring(0, 8)}... está ${newOrder.estado}.`);
    } catch (err: unknown) {
      const error = err as ApiError;
      setPurchaseError(error.response?.data?.message || 'Error al procesar la compra. Verifica tus monedas.');
    } finally {
      setPurchasingServiceId(null);
      setSelectedService(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationModal service={selectedService} onConfirm={confirmPurchase} onCancel={() => setShowConfirmation(false)} />
        )}
      </AnimatePresence>
      
      {/* Mobile Menu Button */}
      <button onClick={() => setIsMenuOpen(true)} className="lg:hidden fixed bottom-4 right-4 bg-blue-600 p-4 rounded-full shadow-lg z-40">
        <Menu className="text-white h-6 w-6"/>
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
            <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
                <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 left-0 h-full w-72 bg-slate-800 p-6 z-50 lg:hidden overflow-y-auto">
                    <CategorySidebar activeCategory={activeCategory.keyword} setActiveCategory={setActiveCategory} closeMenu={() => setIsMenuOpen(false)} />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-8">
            <CategorySidebar activeCategory={activeCategory.keyword} setActiveCategory={setActiveCategory} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-bold text-white mb-2">Marketplace de Proyectos</h1>
              <p className="text-slate-400 mb-6">Encuentra y adquiere proyectos de software listos para usar.</p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input type="text" placeholder={`Buscar en "${activeCategory.keyword}"...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"/>
              </div>
            </motion.div>

            {purchaseMessage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg relative my-6" role="alert">
                <strong className="font-bold">Éxito: </strong><span className="block sm:inline">{purchaseMessage}</span>
              </motion.div>
            )}
            {purchaseError && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative my-6" role="alert">
                <strong className="font-bold">Error: </strong><span className="block sm:inline">{purchaseError}</span>
              </motion.div>
            )}

            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center" role="alert"><strong className="font-bold">Error: </strong> {error}</div>
                ) : (
                  <AnimatePresence>
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredServices.map((service, index) => (
                        <motion.div layout key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:border-blue-500 hover:bg-slate-800 hover:-translate-y-1">
                          {/* Card Body */}
                          <div className="p-5 flex flex-col flex-grow">
                            {service.imgUrl && <Image src={service.imgUrl} alt={service.nombre} width={500} height={280} className="w-full h-40 object-cover rounded-lg mb-4" />}
                            <h3 className="text-xl font-bold text-white mb-2">{service.nombre}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                <Briefcase size={14}/> <span>{service.detalles.rubro}</span> • <Cpu size={14}/> <span>{service.detalles.tipoDeSoftware}</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-4 flex-grow">{service.descripcion}</p>
                            
                            {/* Tech Stack Badges */}
                            <div className="flex flex-wrap gap-2 text-xs mb-5">
                                <span className="bg-sky-500/20 text-sky-300 px-2 py-1 rounded-full font-mono">{service.detalles.lenguaje}</span>
                                <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full font-mono">{service.detalles.framework}</span>
                            </div>

                            {/* Price and Wait time */}
                            <div className="flex justify-between items-center text-sm mb-5">
                                <div className="flex items-center gap-2 text-amber-400"><Coins size={16} /><span className="font-semibold text-lg">{service.precioMonedas}</span><span className="text-slate-400">Monedas</span></div>
                                <div className="flex items-center gap-2 text-cyan-400"><Clock size={16} /><span>{service.tiempoEsperaMinutos} min</span></div>
                            </div>
                          </div>
                          
                          {/* Card Footer */}
                          <div className="bg-slate-800/60 p-4 rounded-b-xl mt-auto flex gap-3">
                            <motion.button onClick={() => handlePurchaseClick(service)} className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed" disabled={purchasingServiceId === service.id || !service.activo} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              {purchasingServiceId === service.id ? 'Procesando...' : service.activo ? 'Comprar' : 'No disponible'}
                            </motion.button>
                            <a href={service.enlace} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors">
                                <ExternalLink size={18}/>
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
                { !loading && filteredServices.length === 0 && <div className="text-center py-20 text-slate-500 text-lg col-span-full">No se encontraron proyectos que coincidan con tus filtros.</div> }
            </div>
        </main>
      </div>
    </div>
  );
};

export default ServiciosPage;
