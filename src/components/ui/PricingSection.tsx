import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiHelpCircle, FiStar, FiZap } from 'react-icons/fi';

// --- Reusable Tooltip Component ---
type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip = ({ text, children }: TooltipProps) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 z-20 w-48 p-2 mb-2 text-sm text-white transition-opacity duration-300 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100">
        {text}
      </div>
    </div>
  );
};

// --- Data for Plans and Features ---
type PlanId = 'esencial' | 'profesional' | 'premium';

const plansData = [
  {
    id: 'esencial' as PlanId,
    name: 'Esencial',
    price: 450,
    description: 'Para proyectos que necesitan una base sólida y segura.',
    recommended: false,
  },
  {
    id: 'profesional' as PlanId,
    name: 'Profesional',
    price: 900,
    description: 'El equilibrio perfecto entre soporte proactivo y rendimiento.',
    recommended: true,
  },
  {
    id: 'premium' as PlanId,
    name: 'Premium',
    price: 1500,
    description: 'Soporte completo y mejoras continuas para aplicaciones críticas.',
    recommended: false,
  },
];

const featuresData = [
  {
    name: 'Soporte Técnico',
    description: 'Canal de comunicación para resolver dudas y problemas técnicos.',
    plans: { esencial: 'Email', profesional: 'Chat Prioritario', premium: 'Videollamada' },
  },
  {
    name: 'Backups',
    description: 'Copias de seguridad automáticas de tu base de datos y archivos.',
    plans: { esencial: 'Mensual', profesional: 'Semanal', premium: 'Diario' },
  },
  {
    name: 'Monitoreo de Uptime',
    description: 'Vigilancia 24/7 para asegurar que tu aplicación esté siempre en línea.',
    plans: { esencial: true, profesional: true, premium: true },
  },
  {
    name: 'Actualizaciones de Seguridad',
    description: 'Aplicación de parches críticos para proteger tu software de vulnerabilidades.',
    plans: { esencial: true, profesional: true, premium: true },
  },
  {
    name: 'Corrección de Bugs',
    description: 'Horas dedicadas a solucionar errores inesperados en el software.',
    plans: { esencial: false, profesional: '5h/mes', premium: '10h/mes' },
  },
  {
    name: 'Reportes de Rendimiento',
    description: 'Informes sobre la velocidad y el estado general de la aplicación.',
    plans: { esencial: false, profesional: 'Básico', premium: 'Detallado' },
  },
  {
    name: 'Optimización de Base de Datos',
    description: 'Auditoría y mejora de consultas para un rendimiento óptimo de la base de datos.',
    plans: { esencial: false, profesional: false, premium: true },
  },
  {
    name: 'Bolsa de Horas para Mejoras',
    description: 'Horas incluidas para desarrollar nuevas funcionalidades o realizar cambios.',
    plans: { esencial: false, profesional: false, premium: '5h/mes' },
  },
];


// --- Main Pricing Table Component ---
const PricingTableSection = () => {
  return (
    <section id="precios" className="py-20 md:py-28 px-4 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <FiZap className="inline-block mr-2 text-emerald-400 mb-1" />
            Planes Flexibles para Cada Necesidad
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
            Elige el plan de mantenimiento que asegura la longevidad y el rendimiento de tu inversión. Compara nuestras opciones.
          </p>
        </motion.div>

        {/* --- Desktop Table View (hidden on mobile) --- */}
        <div className="hidden lg:block mt-16">
          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-x-4">
            <div className="p-4"></div> {/* Empty corner */}
            {plansData.map((plan) => (
              // CAMBIO: Se oscurece ligeramente el fondo del plan recomendado para mejorar el contraste del texto.
              <div key={plan.id} className={`p-6 rounded-t-xl ${plan.recommended ? 'bg-emerald-700' : 'bg-gray-800'}`}>
                {plan.recommended && (
                  <div className="flex justify-center mb-2">
                    <span className="inline-flex items-center text-xs font-semibold py-1 px-3 bg-emerald-500 text-white rounded-full">
                      <FiStar className="mr-1.5" />
                      Recomendado
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-4xl font-extrabold my-3 text-white">
                  S/ {plan.price}
                  {/* CAMBIO: Se usa un tono de verde claro para el texto secundario, mejorando la armonía y legibilidad. */}
                  <span className="text-base font-medium text-emerald-200">/mes</span>
                </p>
                {/* CAMBIO: El texto de la descripción ahora es mucho más claro para garantizar la legibilidad. */}
                <p className={`text-sm h-10 ${plan.recommended ? 'text-emerald-100' : 'text-gray-400'}`}>{plan.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          <div className="bg-gray-800/60">
            {featuresData.map((feature) => (
              <div key={feature.name} className="grid grid-cols-4 gap-x-4 items-center border-t border-gray-700/70">
                <div className="p-4 text-left flex items-center">
                  <span className="font-semibold text-gray-300">{feature.name}</span>
                  <Tooltip text={feature.description}>
                    <FiHelpCircle className="ml-2 text-gray-500 hover:text-white transition-colors"/>
                  </Tooltip>
                </div>
                {plansData.map((plan) => (
                  <div key={plan.id} className="p-4 flex justify-center items-center h-full">
                    {typeof feature.plans[plan.id] === 'boolean' ? (
                      feature.plans[plan.id] ? (
                        <FiCheck className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <FiX className="w-6 h-6 text-gray-500" />
                      )
                    ) : (
                      <span className="text-sm font-medium text-gray-200">{feature.plans[plan.id]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Button Footer Row */}
          <div className="grid grid-cols-4 gap-x-4">
             <div className="p-4"></div> {/* Empty corner */}
             {plansData.map((plan) => (
               <div key={plan.id} className={`p-6 rounded-b-xl ${plan.recommended ? 'bg-emerald-700/80' : 'bg-gray-800/60'}`}>
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className={`w-full py-2.5 px-4 font-semibold rounded-lg transition-colors duration-300 ${
                         plan.recommended ? 'bg-white text-emerald-700 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                     }`}
                    >
                    Seleccionar Plan
                   </motion.button>
               </div>
             ))}
          </div>
        </div>

        {/* --- Mobile Card View (hidden on desktop) --- */}
        <div className="block lg:hidden mt-12 space-y-8">
          {plansData.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              // CAMBIO: Se oscurece el fondo del plan recomendado en móvil.
              className={`p-6 rounded-xl relative flex flex-col ${plan.recommended ? 'bg-emerald-700' : 'bg-gray-800'}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 -mt-3 mr-3">
                  <span className="inline-flex items-center text-xs font-semibold py-1.5 px-3 bg-emerald-500 text-white rounded-full shadow-lg">
                    <FiStar className="mr-1.5" />
                    Recomendado
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-5xl font-extrabold my-3 text-white">
                  S/ {plan.price}
                  {/* CAMBIO: Se ajusta el color del texto secundario para móvil. */}
                  <span className="text-lg font-medium text-emerald-200">/mes</span>
                </p>
                {/* CAMBIO: Se ajusta el color de la descripción para móvil. */}
                <p className={`text-sm mb-6 ${plan.recommended ? 'text-emerald-100' : 'text-gray-400'}`}>{plan.description}</p>
              </div>
              
              <ul className="text-left space-y-4 mb-8">
                {featuresData.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    {typeof feature.plans[plan.id] === 'boolean' ? (
                      feature.plans[plan.id] ? (
                        <FiCheck className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <FiX className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-500" />
                      )
                    ) : (
                      <FiCheck className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-emerald-400" />
                    )}
                    <div>
                      <span className="font-semibold text-white">{feature.name}</span>
                      {typeof feature.plans[plan.id] !== 'boolean' && (
                        <span className="block text-sm text-gray-300">{feature.plans[plan.id]}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-auto py-3 px-6 font-semibold rounded-lg transition-colors duration-300 ${
                  plan.recommended ? 'bg-white text-emerald-700 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Seleccionar Plan
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTableSection;
