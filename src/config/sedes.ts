import type { SedeConfig } from '../data/types'

export const sedes: Record<string, SedeConfig> = {
  'pereira-plaza': {
    id: 'pereira-plaza',
    name: 'Los Grisales - CC Pereira Plaza',
    nameShort: 'Pereira Plaza',
    address: 'CC Pereira Plaza Local 209, Pereira',
    whatsappNumber: '573044200309',
    whatsappOrderingEnabled: true,
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
    whatsappNumber: '573044200309',
    whatsappOrderingEnabled: false,
    googleMapsUrl: 'https://google.com/maps?daddr=centro+comercial+Unicentro,+Pereira,+Risaralda',
    googleReviewsUrl: 'https://www.google.com/search?q=los+grisales+cafe+pereir&rlz=1C5CHFA_enCO1060CO1060&oq=los+grisales+cafe+pereir&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yBwgCEAAY7wUyCggDEAAYgAQYogQyBwgEEAAY7wUyBwgFEAAY7wUyBwgGEAAY7wXSAQg2MTU5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lqi=Chlsb3MgZ3Jpc2FsZXMgY2FmZSBwZXJlaXJh&rlimm=7411841569742810900&lrd=0x8e387d731aea59bd:0x66dc26a357fe6f14,3,,,,',
    schedule: [
      { days: { es: 'Lunes a Domingo', en: 'Monday to Sunday' }, open: '10:00 AM', close: '8:00 PM' },
    ],
    tableCount: 10,
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
  return null
}
