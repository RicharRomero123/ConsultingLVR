// src/app/layout.tsx
import type { Metadata } from 'next/types';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { StickyBanner } from '@/components/ui/sticky-banner';

const inter = Inter({ subsets: ['latin'] });

// ✅ METADATOS OPTIMIZADOS PARA CONSULTORALVR.COM
export const metadata: Metadata = {
  // Título principal: Atractivo y con la palabra clave principal
  title: {
    template: '%s | ConsultoraLVR.com',
    default: 'Desarrollo Web Profesional y Rápido | ConsultoraLVR.com',
  },
  // Descripción: Persuasiva, con un llamado a la acción y palabras clave
  description: 'En ConsultoraLVR.com creamos sitios web eficientes, rápidos y a medida para tu negocio. Desarrollo profesional y económico ajustado a tus necesidades. ¡Cotiza tu proyecto hoy!',
  // Palabras clave relevantes para tu negocio
  keywords: [
    'desarrollo web',
    'desarrollo web barato',
    'desarrollo profesional rápido',
    'creación de sitios web',
    'páginas web a medida',
    'sitios web para pymes',
    'desarrollo web perú',
    'consultora web',
    'sitios web económicos',
    'consultoralvr',
    'diseño web profesional',
  ],
  // Metadatos para compartir en redes sociales (Facebook, WhatsApp, LinkedIn, etc.)
  openGraph: {
    title: 'ConsultoraLVR.com | Desarrollo Web Profesional y Rápido',
    description: 'Transformamos tu idea en un sitio web eficiente y a medida. Soluciones económicas y rápidas para pymes y emprendedores.',
    url: 'https://consultoralvr.com',
    siteName: 'ConsultoraLVR.com',
    images: [
      {
        // ❗️ IMPORTANTE: Reemplaza esta URL por una imagen tuya de 1200x630px.
        // Sube a Cloudinary o a tu hosting una imagen con tu logo y un eslogan.
        url: 'https://consultoralvr.com/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'Desarrollo de sitios web profesionales por ConsultoraLVR.com',
      },
    ],
    locale: 'es_PE', // Correcto para Perú
    type: 'website',
  },
  // Metadatos para compartir en Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ConsultoraLVR.com | Desarrollo Web Profesional y Rápido',
    description: 'Transformamos tu idea en un sitio web eficiente y a medida. Soluciones económicas y rápidas para pymes y emprendedores.',
    // ❗️ IMPORTANTE: Usa la misma URL de la imagen de Open Graph.
    images: ['https://consultoralvr.com/og-image.png'], 
  },
  // Instrucciones para los robots de búsqueda (Google, Bing, etc.)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // URL canónica para evitar contenido duplicado
  alternates: {
    canonical: 'https://consultoralvr.com',
  },
  // Información del autor/marca
  authors: [{ name: 'ConsultoraLVR.com', url: 'https://consultoralvr.com' }],
  creator: 'ConsultoraLVR.com',
  // Para que Google sepa que eres el publicador
  publisher: 'ConsultoraLVR.com',
};


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
    <body className={inter.className}>
    {/* ❗️ IMPORTANTE: Cambia el texto de este banner por una oferta o mensaje para tus clientes */}
    <StickyBanner className="fixed top-0 left-0 w-full z-[9999] bg-gradient-to-b from-blue-500 to-blue-600">
      <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
        ¡Oferta de Lanzamiento! 15% de descuento en tu primer proyecto web.{" "}
        <a href="/contacto" className="transition duration-200 hover:underline">
          Contáctanos
        </a>
      </p>
    </StickyBanner>
    <AuthProvider>
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}