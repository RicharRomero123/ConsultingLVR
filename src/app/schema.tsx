// src/app/schema.tsx
import { LocalBusiness, WithContext } from 'schema-dts';

export function JsonLd() {
  const jsonLd: WithContext<LocalBusiness> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'ConsultoraLVR.com',
    'description': 'Consultora especializada en el desarrollo de sitios web eficientes, rápidos y a medida para pymes y emprendedores en Perú.',
    'url': 'https://consultoralvr.com',
    'logo': 'https://consultoralvr.com/logo.png', // ❗️ Recuerda cambiar por la URL a tu logo
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Lima',
      'addressCountry': 'PE'
    },
    // La propiedad 'provider' ha sido eliminada.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}