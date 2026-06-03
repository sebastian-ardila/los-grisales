import HeroSection from '../components/home/HeroSection'
import TourSection from '../components/home/TourSection'
import CafeBarSection from '../components/home/CafeBarSection'
import SpecialtyCoffeeSection from '../components/home/SpecialtyCoffeeSection'
import ContactSection from '../components/home/ContactSection'
import SEO from '../components/seo/SEO'

export default function HomePage() {
  return (
    <>
      <SEO
        title={{
          es: 'Café Los Grisales — Café de especialidad & Coffee Tour en Pereira',
          en: 'Café Los Grisales — Specialty coffee & Coffee Tour in Pereira',
          fr: 'Café Los Grisales — Café de spécialité & Coffee Tour à Pereira',
        }}
        description={{
          es: 'Café de especialidad cultivado por nosotros en la Finca Vista Hermosa (Risaralda). Visita nuestras tiendas en Pereira o vive el Coffee Tour: del grano a la taza.',
          en: 'Specialty coffee grown by us at Finca Vista Hermosa (Risaralda). Visit our coffee shops in Pereira or live the Coffee Tour: from bean to cup.',
          fr: 'Café de spécialité cultivé par nous à la Finca Vista Hermosa (Risaralda). Visitez nos boutiques à Pereira ou vivez le Coffee Tour : du grain à la tasse.',
        }}
      />
      <HeroSection />
      <TourSection />
      <CafeBarSection />
      <SpecialtyCoffeeSection />
      <ContactSection />
    </>
  )
}
