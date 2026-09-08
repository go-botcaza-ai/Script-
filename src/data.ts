import { ContentItem } from './types';

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'ppv-001',
    title: 'Masterclass: Arquitectura Cloud de Alto Rendimiento',
    description: 'Aprende a diseñar sistemas escalables con microservicios, CDN distribuida y balanceo de carga para millones de usuarios concurrentes.',
    category: 'masterclass',
    categoryLabel: 'Masterclass Exclusiva',
    price: 19.99,
    duration: '2h 45m',
    rating: 4.9,
    reviewsCount: 342,
    instructor: {
      name: 'Carlos Mendoza',
      role: 'Principal Solutions Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fullVideoType: 'mp4',
    features: [
      'Acceso en 4K Ultra HD sin anuncios',
      'Código fuente descargable y diagramas de arquitectura',
      'Certificado de finalización digital',
      'Acceso de por vida o 365 días'
    ],
    accessDuration: 'Acceso ilimitado',
    releaseYear: '2026',
    resolution: '4K Ultra HD',
    tags: ['Arquitectura', 'Cloud', 'DevOps', 'Escalabilidad'],
    isFeatured: true
  },
  {
    id: 'ppv-002',
    title: 'Concierto Acústico Exclusivo: Sesiones en Vivo',
    description: 'Transmisión exclusiva grabada en vivo con sonido Dolby Atmos envolvente. Una velada íntima de canciones inéditas y versiones acústicas.',
    category: 'event',
    categoryLabel: 'Evento en Vivo',
    price: 9.50,
    duration: '1h 35m',
    rating: 5.0,
    reviewsCount: 620,
    instructor: {
      name: 'Elena Ramos & Banda',
      role: 'Cantautora y Productora',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fullVideoType: 'mp4',
    features: [
      'Audio HQ Estéreo y Dolby Digital 5.1',
      'Entrevista exclusiva tras bambalinas',
      'Pase digital conmemorativo'
    ],
    accessDuration: 'Pase Pay Per View por 72 horas',
    releaseYear: '2026',
    resolution: '1080p FHD',
    tags: ['Música', 'Concierto', 'En Vivo', 'Acústico'],
    isFeatured: true
  },
  {
    id: 'ppv-003',
    title: 'Curso Intensivo: Inteligencia Artificial Aplicada a Negocios',
    description: 'Domina la implementación de modelos generativos, automatización de flujos de trabajo y agentes autónomos para triplicar la productividad corporativa.',
    category: 'course',
    categoryLabel: 'Curso Profesional',
    price: 34.00,
    duration: '4h 10m',
    rating: 4.8,
    reviewsCount: 215,
    instructor: {
      name: 'Dr. Sofia Valenzuela',
      role: 'Head of AI Strategy',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    fullVideoType: 'mp4',
    features: [
      '8 módulos prácticos con prompts y notebooks',
      'Templates de integración API',
      'Soporte directo para dudas'
    ],
    accessDuration: 'Acceso ilimitado',
    releaseYear: '2026',
    resolution: '1440p QHD',
    tags: ['IA', 'Automatización', 'Negocios', 'Machine Learning']
  },
  {
    id: 'ppv-004',
    title: 'Documental: Secretos del Emprendimiento Tecnológico',
    description: 'Historias reales de fundadores que construyeron empresas de 0 a 100 millones. Errores críticos, momentos bisagra y lecciones no filtradas.',
    category: 'video',
    categoryLabel: 'Documental Especial',
    price: 6.99,
    duration: '1h 18m',
    rating: 4.7,
    reviewsCount: 180,
    instructor: {
      name: 'Marcos Benítez',
      role: 'Documentalista & Periodista Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    fullVideoType: 'mp4',
    features: [
      'Subtítulos en español e inglés',
      'Guía resumen en PDF con las 25 lecciones clave',
      'Capítulos divididos por casos de estudio'
    ],
    accessDuration: 'Acceso por 30 días',
    releaseYear: '2025',
    resolution: '1080p FHD',
    tags: ['Startups', 'Emprendimiento', 'Documental', 'Negocios']
  },
  {
    id: 'ppv-005',
    title: 'Taller Privado: Producción y Edición de Video Cinematográfico',
    description: 'Gradación de color en DaVinci Resolve, diseño de sonido cinematográfico y técnicas de iluminación para creadores independientes.',
    category: 'course',
    categoryLabel: 'Taller Práctico',
    price: 24.50,
    duration: '3h 05m',
    rating: 4.9,
    reviewsCount: 290,
    instructor: {
      name: 'Lucía Navarro',
      role: 'Directora de Fotografía',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    fullVideoType: 'mp4',
    features: [
      'LUTs cinematográficos profesionales incluidos',
      'Archivos RAW de práctica para descargar',
      'Acceso a comunidad privada de creadores'
    ],
    accessDuration: 'Acceso ilimitado',
    releaseYear: '2026',
    resolution: '4K Ultra HD',
    tags: ['Video', 'Color', 'Cine', 'Edición']
  }
];

export const PHP_SCRIPT_CONFIG = {
  version: '4.2.0 - Enterprise PPV Core',
  phpEngine: 'PHP 8.2+ / 8.3 Ready',
  databaseDriver: 'PDO MySQL / SQLite3 / PostgreSQL',
  encryption: 'AES-256-GCM Tokenized Secure Access URLs',
  paymentGatewaysSupported: ['Stripe Checkout', 'PayPal Smart Buttons', 'MercadoPago', 'Coinbase Commerce', 'Bank Card Direct'],
  featuresList: [
    'Generación automática de URLs temporales con firma criptográfica HMAC-SHA256',
    'Integración nativa con Webhooks de PayPal IPN y Stripe Events para confirmación en tiempo real',
    'Sistema Pay Per View por expiración de tiempo (horas/días) o por número de reproducciones',
    'Envío de comprobantes, tokens de acceso y recibos por Gmail API / SMTP con plantillas HTML',
    'Prevención de descargas directas y hotlinking con validación de IP y User-Agent',
    'Panel de administración PHP con métricas de conversión, ventas y gestión de catálogo'
  ]
};
