'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, ArrowRight, X,
    Building, FileText, ShoppingCart, Scale, Dumbbell, Users, Target, GitBranch, Star, Rocket, LucideIcon
} from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import PricingTableSection from '@/components/ui/PricingSection';
import HeroSectionWithLottie from '@/components/ui/HeroSectionWithLottie';
import Navbar from '@/components/Navbar';

// ✅ CORRECCIÓN: Se define un tipo para las especialidades para evitar 'any'.
type SpecialtyType = {
    icon: LucideIcon;
    title: string;
    description: string;
    fullDescription: string;
    features: string[];
};

// --- Componente de Modal Interactivo ---
// ✅ CORRECCIÓN: Se usa el tipo 'SpecialtyType' en lugar de 'any'.
const SpecialtyModal = ({ specialty, onClose }: { specialty: SpecialtyType; onClose: () => void; }) => {
    if (!specialty) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: -50 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <specialty.icon className="w-10 h-10 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-white">{specialty.title}</h2>
                    </div>
                    <p className="text-gray-300 mb-6">{specialty.fullDescription}</p>
                    <h3 className="font-semibold text-white mb-3">Funcionalidades Clave:</h3>
                    <ul className="space-y-2">
                        {specialty.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                     <Link href="#contacto" onClick={onClose} className="mt-8 inline-block w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-md">
                         Solicitar Cotización para este Servicio
                     </Link>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Componente de Formulario de Contacto ---
const CustomSoftwareForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', type: 'web', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = '51972562437';
        const message = `
*¡Solicitud de Cotización de Software a Medida!* 💼

*Nombre:* ${formData.name}
*Email:* ${formData.email}
*Empresa:* ${formData.company || 'No especificada'}
*Tipo de Software:* ${formData.type}
*Descripción del Proyecto:*
${formData.description}
        `.trim().replace(/\n\s*\n/g, '\n');

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-gray-800 border border-white/10 p-8 rounded-2xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
            <div className="sm:col-span-2">
                <h3 className="text-3xl font-bold text-white">Cuéntanos sobre tu Proyecto</h3>
                <p className="text-gray-400 mt-2">Describe tus requerimientos y te contactaremos por WhatsApp para darte una cotización a medida.</p>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"/>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email de Contacto</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"/>
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Empresa (Opcional)</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"/>
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Tipo de Plataforma</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
                    <option value="web">Aplicación Web</option>
                    <option value="movil">Aplicación Móvil (Android/iOS)</option>
                    <option value="landing">Landing Page</option>
                    <option value="ambos">Web + Móvil</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Descripción del Proyecto</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required placeholder="Ej: Necesito un sistema para gestionar inventario y ventas de mi tienda..." className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"></textarea>
            </div>
            <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-md shadow-emerald-500/20">
                    Enviar y Contactar por WhatsApp
                </button>
            </div>
        </motion.form>
    );
};

// --- Página Principal (Landing Page) ---
const HomePage: React.FC = () => {
    // ✅ CORRECCIÓN: Se usa el tipo 'SpecialtyType' en el estado del modal.
    const [modalData, setModalData] = useState<SpecialtyType | null>(null);
    
    // ✅ CORRECCIÓN: Se asigna el tipo 'SpecialtyType[]' al array.
    const specialties: SpecialtyType[] = [
        { 
            icon: FileText, 
            title: 'Gestión de Recibos y Facturación',
            description: 'Automatiza la emisión y control de tus comprobantes de pago.',
            fullDescription: 'Desarrollamos sistemas robustos para la generación, envío y almacenamiento de facturas, boletas y recibos electrónicos, cumpliendo con las normativas vigentes. Simplifica tu contabilidad y mejora el flujo de caja.',
            features: ['Facturación Electrónica SUNAT', 'Control de Cuentas por Cobrar', 'Reportes de Ventas', 'Portal de Clientes']
        },
        { 
            icon: ShoppingCart, 
            title: 'Sistemas para Tiendas y Discotecas',
            description: 'Control total de tu inventario, ventas y personal.',
            fullDescription: 'Implementamos soluciones POS (Punto de Venta) para retail, bares y discotecas. Gestiona tu inventario en tiempo real, procesa ventas rápidamente y controla el acceso y consumo de tus clientes.',
            features: ['Gestión de Inventario', 'Punto de Venta (POS)', 'Control de Mesas y Comandas', 'Programas de Lealtad']
        },
        { 
            icon: Scale, 
            title: 'Consultorios y Despachos Legales',
            description: 'Gestiona pacientes, citas y expedientes de forma segura.',
            fullDescription: 'Software especializado para profesionales. Administra el historial clínico de tus pacientes o clientes, agenda citas de manera eficiente, y gestiona casos y documentos legales con la máxima seguridad y confidencialidad.',
            features: ['Agenda de Citas Online', 'Historial Clínico/Casos Digital', 'Gestión de Expedientes', 'Facturación de Servicios']
        },
        { 
            icon: Building, 
            title: 'Apps de Contabilidad e Inmobiliarias',
            description: 'Optimiza finanzas y gestiona propiedades con facilidad.',
            fullDescription: 'Creamos aplicaciones para llevar un control financiero detallado o para administrar carteras de propiedades. Automatiza procesos contables y facilita la gestión de alquileres, ventas y visitas a inmuebles.',
            features: ['Libros Contables Automatizados', 'Gestión de Cartera de Propiedades', 'Control de Alquileres y Pagos', 'Reportes Financieros']
        },
        { 
            icon: Dumbbell, 
            title: 'Software para Gimnasios y Restaurantes',
            description: 'Administra membresías, reservas y pedidos eficientemente.',
            fullDescription: 'Soluciones a medida para el sector fitness y gastronómico. Controla las membresías y acceso de socios en tu gimnasio, o gestiona los pedidos, el delivery y las reservas de mesas en tu restaurante.',
            features: ['Gestión de Membresías', 'Reservas de Clases y Equipos', 'Sistema de Comandas (KDS)', 'Integración con Apps de Delivery']
        },
        { 
            icon: Rocket,
            title: 'Landing Pages de Alto Impacto',
            description: 'Captura leads y convierte visitantes en clientes.',
            fullDescription: 'Diseñamos y desarrollamos Landing Pages optimizadas para la conversión. Desde el diseño visual hasta la integración con herramientas de marketing, creamos páginas que no solo se ven bien, sino que generan resultados tangibles para tus campañas.',
            features: ['Diseño A/B Testeable', 'Formularios de Captura de Leads', 'Integración con CRM y Email Marketing', 'Análisis de Conversión']
        }
    ];

    const portfolioItems = [
        { img: 'https://res.cloudinary.com/dod56svuf/image/upload/v1752473059/WhatsApp_Image_2025-07-14_at_1.04.00_AM_ygzohs.jpg', title: 'E-commerce Sofisticado', desc: 'Plataforma de ventas online con diseño elegante.', rating: '4.9', reviews: '5k' },
        { img: 'https://res.cloudinary.com/dod56svuf/image/upload/v1752473444/WhatsApp_Image_2025-07-14_at_1.10.29_AM_is0ul2.jpg', title: 'Sistema de Reservas Exclusivo', desc: 'Gestión de reservas con interfaz pulcra y profesional.', rating: '4.7', reviews: '3k' },
        { img: 'https://res.cloudinary.com/dod56svuf/image/upload/v1752473579/WhatsApp_Image_2025-07-14_at_1.12.46_AM_coojoy.jpg', title: 'Dashboard de Inteligencia Empresarial', desc: 'Visualización de datos críticos con un enfoque ejecutivo.', rating: '4.8', reviews: '4.5k' },
    ];

    // ✅ CORRECCIÓN: Se usa el tipo 'SpecialtyType' en el parámetro de la función.
    const handleOpenModal = (specialty: SpecialtyType) => {
        setModalData(specialty);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <div className="bg-black text-white">
            <Navbar />
            {modalData && <SpecialtyModal specialty={modalData} onClose={handleCloseModal} />}
    
            <main>
                <HeroSectionWithLottie/>
                
                {/* Quienes Somos Section */}
                <section id="quienes-somos" className="py-20 md:py-28 px-4 bg-gray-900">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Sobre <span className="text-emerald-500">SistemasVIP</span></h2>
                            <p className="mt-4 text-lg text-gray-300">Somos más que una empresa de desarrollo; somos tus socios estratégicos en tecnología. Nuestra misión es potenciar negocios como el tuyo a través de software innovador, robusto y, sobre todo, hecho a la medida de tus necesidades.</p>
                            <p className="mt-4 text-gray-400">Creemos que la tecnología debe ser una herramienta que simplifique operaciones, no que las complique. Por eso, nos enfocamos en entender a fondo tus procesos para construir la solución perfecta.</p>
                        </motion.div>
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="grid grid-cols-2 gap-6 text-center"
                        >
                            <div className="bg-gray-800 border border-white/10 p-6 rounded-xl"><Users className="mx-auto w-10 h-10 text-emerald-500 mb-2" /><h3 className="font-bold text-white">Equipo Experto</h3></div>
                            <div className="bg-gray-800 border border-white/10 p-6 rounded-xl"><Target className="mx-auto w-10 h-10 text-emerald-500 mb-2" /><h3 className="font-bold text-white">Enfoque al Cliente</h3></div>
                            <div className="bg-gray-800 border border-white/10 p-6 rounded-xl"><GitBranch className="mx-auto w-10 h-10 text-emerald-500 mb-2" /><h3 className="font-bold text-white">Innovación Constante</h3></div>
                            <div className="bg-gray-800 border border-white/10 p-6 rounded-xl"><CheckCircle className="mx-auto w-10 h-10 text-emerald-500 mb-2" /><h3 className="font-bold text-white">Calidad Garantizada</h3></div>
                        </motion.div>
                    </div>
                </section>

                {/* ContainerScroll Section */}
                <div className="flex flex-col overflow-hidden bg-black">
                    <ContainerScroll
                        titleComponent={
                            <>
                            <h1 className="text-4xl font-semibold text-white">
                                Administra tu negocio en tiempo real <br />
                                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                    Desde tu Tablet
                                </span>
                            </h1>
                            </>
                        }
                    >
                        <Image
                            src={`https://res.cloudinary.com/dod56svuf/image/upload/v1752469337/415264326-320061e7-0440-4f0a-ade6-5140aa1e86ad_qyec9k.png`}
                            alt="hero"
                            height={720}
                            width={1400}
                            className="mx-auto rounded-2xl object-cover h-full object-left-top"
                            draggable={false}
                        />
                    </ContainerScroll>
                </div>

                {/* Especialidades Section */}
                <section id="especialidades" className="py-20 md:py-28 px-4 bg-gray-900">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Nuestras Especialidades</h2>
                        <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                            Tenemos experiencia comprobada en una amplia gama de sectores, ofreciendo soluciones que realmente marcan la diferencia.
                        </p>
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {specialties.map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="bg-gray-800 p-6 rounded-2xl text-left flex flex-col items-start border border-white/10 hover:border-emerald-500/50 hover:-translate-y-2 transition-all"
                                >
                                    <spec.icon className="w-10 h-10 text-emerald-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">{spec.title}</h3>
                                    <p className="text-gray-400 flex-grow mb-4">{spec.description}</p>
                                    <button onClick={() => handleOpenModal(spec)} className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors mt-auto group">
                                        Ver más detalles <ArrowRight className="inline-block w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio Section */}
                <section id="portafolio" className="py-20 md:py-28 px-4 bg-black">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Proyectos Destacados</h2>
                        <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                            Un vistazo a algunas de nuestras soluciones de software más recientes y exitosas.
                        </p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="group relative overflow-hidden rounded-2xl border border-white/10"
                                >
                                    <Image src={item.img} alt={item.title} width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <h3 className="text-xl font-semibold text-emerald-500">{item.title}</h3>
                                        <p className="text-gray-300 text-sm mt-1">{item.desc}</p>
                                        <div className="flex items-center justify-between mt-4 text-xs">
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-bold text-white">{item.rating}</span>
                                                <span className="text-gray-400">/ 5</span>
                                            </div>
                                            <div className="text-gray-300">
                                                Más de <span className="font-bold text-white">{item.reviews}</span> clientes
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-12">
                            <Link href="/dashboard/servicios" className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-md hover:bg-emerald-700 transition-transform hover:scale-105 shadow-md">
                                Ir a la Tienda de Servicios
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <PricingTableSection/>

                {/* Custom Software Form Section */}
                <section id="contacto" className="py-20 md:py-28 px-4 bg-black">
                    <CustomSoftwareForm />
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-400 text-sm text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="mb-4 md:mb-0">
                             <Link href="/" className="flex items-center justify-center md:justify-start gap-2">
                                 <Image src="https://res.cloudinary.com/dod56svuf/image/upload/v1751876631/softwareVip.png" alt="SistemasVIP Logo" width={30} height={30} className="rounded-md"/>
                                 <span className="font-semibold">Sistemas<span className="text-emerald-500">VIP</span> &copy; {new Date().getFullYear()}</span>
                             </Link>
                         </div>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <Link href="#quienes-somos" className="hover:text-emerald-500 transition-colors">Quiénes Somos</Link>
                            <Link href="#especialidades" className="hover:text-emerald-500 transition-colors">Especialidades</Link>
                            <Link href="#portafolio" className="hover:text-emerald-500 transition-colors">Portafolio</Link>
                            <Link href="#contacto" className="hover:text-emerald-500 transition-colors">Contacto</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
