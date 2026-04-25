import type { SedeConfig } from '../data/types'

export const sedes: Record<string, SedeConfig> = {
  'pereira-plaza': {
    id: 'pereira-plaza',
    name: 'Los Grisales - CC Pereira Plaza',
    nameShort: 'Pereira Plaza',
    address: 'CC Pereira Plaza Local 209, Pereira',
    heroImage: 'cta-coffee-farm.webp',
    whatsappNumber: '573044200309',
    whatsappOrderingEnabled: false,
    googleMapsUrl: 'https://google.com/maps/dir//Los+Grisales+caf%C3%A9+%26+bar+%7C+Coffee+tour,+Centro+Comercial+Pereira+Plaza+Terraza,+Pereira,+Risaralda/@4.8088163,-75.6922365,19.23z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8e38878b684ed5ed:0x7c9f1f312026eea8!2m2!1d-75.691384!2d4.8090127?entry=ttu',
    googleReviewsUrl: 'https://www.google.com/search?q=los+grisales+cafe+pereir&rlz=1C5CHFA_enCO1060CO1060&oq=los+grisales+cafe+pereir&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yBwgCEAAY7wUyCggDEAAYgAQYogQyBwgEEAAY7wUyBwgFEAAY7wUyBwgGEAAY7wXSAQg2MTU5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lqi=Chlsb3MgZ3Jpc2FsZXMgY2FmZSBwZXJlaXJh&rlimm=8979930477853339304&lrd=0x8e38878b684ed5ed:0x7c9f1f312026eea8,3,,,,',
    schedule: [
      { days: { es: 'Domingo a Jueves', en: 'Sunday to Thursday' }, open: '9:00 AM', close: '9:00 PM' },
      { days: { es: 'Viernes y Sábado', en: 'Friday & Saturday' }, open: '9:00 AM', close: '11:00 PM' },
    ],
    tableCount: 10,
  },
  'unicentro': {
    id: 'unicentro',
    name: 'Los Grisales - CC Unicentro',
    nameShort: 'Unicentro',
    address: 'CC Unicentro nivel B, Plazoleta de comidas, Pereira',
    heroImage: 'historia-3.webp',
    whatsappNumber: '573044200309',
    whatsappOrderingEnabled: false,
    googleMapsUrl: 'https://google.com/maps?daddr=centro+comercial+Unicentro,+Pereira,+Risaralda',
    googleReviewsUrl: 'https://www.google.com/search?q=los+grisales+cafe+pereir&rlz=1C5CHFA_enCO1060CO1060&oq=los+grisales+cafe+pereir&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yBwgCEAAY7wUyCggDEAAYgAQYogQyBwgEEAAY7wUyBwgFEAAY7wUyBwgGEAAY7wXSAQg2MTU5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lqi=Chlsb3MgZ3Jpc2FsZXMgY2FmZSBwZXJlaXJh&rlimm=7411841569742810900&lrd=0x8e387d731aea59bd:0x66dc26a357fe6f14,3,,,,',
    schedule: [
      { days: { es: 'Lunes a Domingo', en: 'Monday to Sunday' }, open: '10:00 AM', close: '8:00 PM' },
    ],
    tableCount: 10,
  },
  'coffee-tour': {
    id: 'coffee-tour',
    name: 'Grisales Coffee Tour - Finca Vista Hermosa',
    nameShort: 'Coffee Tour',
    address: 'Alto del Toro, Dosquebradas, Risaralda',
    heroImage: 'historia-2.webp',
    whatsappNumber: '573044200309',
    whatsappOrderingEnabled: false,
    googleMapsUrl: 'https://share.google/PIxKgK300Anx3OgSu',
    googleReviewsUrl: 'https://www.tripadvisor.co/AttractionProductReview-g21367268-d33990237-Coffee_Tour_Near_Pereira_Grisales_Coffee_Tour-Alto_El_Toro_Santa_Rosa_de_Cabal_R.html',
    schedule: [
      { days: { es: 'Previa reserva', en: 'By appointment' }, open: '7:00 AM', close: '4:00 PM' },
    ],
    tableCount: 0,
    isCoffeeTour: true,
    bookingApps: [
      {
        name: 'Airbnb',
        url: 'https://www.airbnb.mx/experiences/6228503?s=67&unique_share_id=b6340faa-5ea9-4850-884a-a366ddca8c4c',
        brandColor: '#FF385C',
        iconKey: 'airbnb',
      },
      {
        name: 'GetYourGuide',
        url: 'https://www.getyourguide.com/pereira-l32650/pereira-grisales-coffee-tour-immersive-sensory-experience-t1005916/?utm_medium=sharing&utm_campaign=activity_details_desktop&sharing_exp=hem-adp-share-modal-shortlinks-blackout-desktop_B',
        brandColor: '#FF6F00',
        iconKey: 'getyourguide',
      },
      {
        name: 'Tripadvisor',
        url: 'https://www.tripadvisor.co/AttractionProductReview-g21367268-d33990237-Coffee_Tour_Near_Pereira_Grisales_Coffee_Tour-Alto_El_Toro_Santa_Rosa_de_Cabal_R.html',
        brandColor: '#34E0A1',
        iconKey: 'tripadvisor',
      },
      {
        name: 'Viator',
        url: 'https://www.viator.com/es-ES/tours/Pereira/Coffee-Tour-Near-Pereira-Grisales-Coffee-Tour/d28161-5601182P5?medium=social-share-copy',
        brandColor: '#328E3E',
        iconKey: 'viator',
      },
    ],
  },
}

export function getSedeScheduleForDay(sedeId: string, dayOfWeek: number): { open: number; close: number } | null {
  if (sedeId === 'pereira-plaza') {
    // Sunday(0) to Thursday(4): 9-21, Friday(5) & Saturday(6): 9-23
    if (dayOfWeek >= 0 && dayOfWeek <= 4) return { open: 9, close: 21 }
    return { open: 9, close: 23 }
  }
  if (sedeId === 'unicentro') {
    // Every day: 10-20
    return { open: 10, close: 20 }
  }
  if (sedeId === 'coffee-tour') {
    // By appointment; tour booking handled via external apps (not table hours)
    return { open: 7, close: 16 }
  }
  return null
}
