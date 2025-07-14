import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Lottie from 'lottie-react';
import Dashboard from '../ui/Dashboard.json'; // Asegúrate de que la ruta a tu archivo Lottie sea correcta
import { Vortex } from './vortex'; // Asegúrate de que la ruta a tu componente Vortex sea correcta
import { PointerHighlight } from './pointer-highlight'; // Asegúrate de que la ruta a tu componente PointerHighlight sea correcta

const HeroSectionWithLottie = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* CAMBIO: Se ajusta el 'baseHue' del Vortex a 140. Esto hará que las partículas tengan una tonalidad verde esmeralda,
          creando una atmósfera de crecimiento y tecnología. */}
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={140}
        className="flex items-center justify-center px-4 md:px-10 min-h-screen w-full"
      >
        {/* Se añade padding superior (pt-24) para evitar que el Navbar fijo oculte el contenido al cargar. */}
        <section className="relative w-full max-w-7xl mx-auto pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-y-16 gap-x-12">
            
            {/* --- Columna Izquierda: Contenido de Texto --- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-xl mx-auto lg:mx-0">
                Soluciones de Software a Medida con Elegancia y{" "}
                {/* CAMBIO: Se actualiza el PointerHighlight para usar el nuevo acento verde esmeralda. */}
                <span className="relative inline-block">
                  <PointerHighlight
                    pointerClassName="text-emerald-500"
                    rectangleClassName="border-emerald-500/50"
                  >
                    <span className="inline">Precisión</span>
                  </PointerHighlight>
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto lg:mx-0">
                Transformamos tu visión en realidad con sistemas diseñados para la excelencia y el rendimiento.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* CAMBIO: El botón de CTA primario ahora usa el nuevo color de acento verde. */}
                <Link
                  href="#contacto"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-8 py-3 rounded-md hover:bg-emerald-700 transition-transform hover:scale-105 shadow-lg shadow-emerald-500/20 text-base"
                >
                  Solicitar Propuesta <ArrowRight size={18} />
                </Link>
                
                {/* CAMBIO: El botón secundario ahora usa el verde en su estado 'hover' para mantener la consistencia. */}
                <Link
                  href="#portafolio"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border-2 border-gray-700 text-gray-300 font-bold px-8 py-3 rounded-md hover:bg-gray-800 hover:text-emerald-500 hover:border-gray-600 transition-colors text-base"
                >
                  Ver Nuestro Trabajo
                </Link>
              </div>
            </motion.div>

            {/* --- Columna Derecha: Animación Lottie --- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full max-w-lg mx-auto lg:max-w-none"
            >
              <Lottie
                animationData={Dashboard}
                loop={true}
                autoplay={true}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </section>
      </Vortex>
    </div>
  );
};

export default HeroSectionWithLottie;
