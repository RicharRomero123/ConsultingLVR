/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com',"i.imgur.com","example.com"], // <--- AÑADE ESTA LÍNEA
  },
};

module.exports = nextConfig;