import type { SedeId } from './types'

export interface Review {
  author: string
  rating: number // 1-5
  relativeDate: string // e.g. "hace 2 meses"
  text: string
  /** Optional sede badge label. Set when combining reviews across sedes. */
  sedeName?: string
}

// IMPORTANTE: reemplazar estas reviews con las reales copiadas de Google.
// Por cada sede, ver `googleReviewsUrl` en `src/config/sedes.ts`.
export const reviewsBySede: Record<SedeId, Review[]> = {
  'coffee-tour': [
    {
      author: 'Adriana Lugo',
      rating: 5,
      relativeDate: 'hace 3 meses',
      text:
        'Tuve una experiencia simplemente increíble en Finca Grisales. Desde el primer momento me enamoré de su proceso, de la forma tan apasionada y auténtica en la que viven y transmiten el café. Conocer la finca fue algo muy especial, se siente la dedicación y el amor en cada detalle.',
    },
    {
      author: 'MacLean Ryan',
      rating: 5,
      relativeDate: 'hace 4 meses',
      text:
        'We had a great time at Grisales Coffee Finca yesterday. Grisales is an organic family-run farm. The tour gave a full experience from fermenting coffee plant beans all the way until the beans are ready to be roasted. We strolled through the fields and learned every step.',
    },
    {
      author: 'Alex Petryk',
      rating: 5,
      relativeDate: 'hace 2 meses',
      text:
        'I went on this tour travelling solo, but they were nice enough to let me join the group that had prebooked and I was able to experience the finca in a small intimate group, led by the owner of the finca. Truly memorable.',
    },
    {
      author: 'Adolfo J. Cardozo S.',
      rating: 5,
      relativeDate: 'hace 2 meses',
      text:
        '¡Excelente! Finca familiar, se conoce todo el proceso desde el cultivo, hasta que el grano de especialidad está listo. Atención familiar y no descuidan detalle. ¡Muy recomendados! Gracias por su atención.',
    },
    {
      author: 'ana maria gonzalez diaz',
      rating: 5,
      relativeDate: 'hace 8 meses',
      text:
        'Una experiencia muy agradable, nos sentimos como en casa. Desde el perrito hasta la abuelita nos hicieron sentir parte de la familia. Nos explicaron todo el proceso del café e hicimos un recorrido muy bonito por la finca. El desayuno y el almuerzo deliciosos, y el café increíble.',
    },
    {
      author: 'Karen Andrea Rueda',
      rating: 5,
      relativeDate: 'hace 7 meses',
      text:
        'Gran experiencia real para conocer una verdadera y familiar finca cafetera. Es un tour personalizado y completo, la familia de Francy fue muy amable y la comida estuvo deliciosa. Aprendimos de la cultura cafetera del Risaralda. Muy recomendable.',
    },
  ],
  'pereira-plaza': [
    {
      author: 'Tenny Kristiana',
      rating: 5,
      relativeDate: 'hace 3 meses',
      text:
        'I did the tour with them and I was blown away with how amazing the tour is. It is an incredible experience, learning a lot of things about their family coffee business. If you are visiting the area, give it a try — their tour is at a reasonable price.',
    },
    {
      author: 'Tomás Ortiz',
      rating: 5,
      relativeDate: 'hace 5 meses',
      text:
        'El mejor café de la zona, utilizan café propio cosechado en su finca. Atiende la hija del caficultor, con un exquisito cuidado en los detalles y un cariño especial por el producto. Café tostado a la perfección, con dulzura y ligero amargor.',
    },
    {
      author: 'Wilson Knight',
      rating: 5,
      relativeDate: 'hace 7 meses',
      text:
        "Just amazing, I'm at a loss of words to express myself. Awesome coffee, one of the best in the region. But there's more — the Grisales coffee tour is just amazing, you'll learn from A to Z all about real gourmet coffee.",
    },
    {
      author: 'IRMA JANAMEJOY MADROÑERO',
      rating: 5,
      relativeDate: 'hace 7 meses',
      text:
        '¡Un café delicioso, una excelente atención, una ubicación ideal! ¡Súper recomendado! Además ofrecen un tour de café que vale mucho la pena visitar.',
    },
  ],
  'unicentro': [
    {
      author: 'Abogadas Aracelly Ocampo y Francesca Medina',
      rating: 5,
      relativeDate: 'hace 2 meses',
      text:
        'Un deliciosísimo café y excelente atención, súper recomendado para los amantes del buen café.',
    },
    {
      author: 'Siddharta Wayne',
      rating: 5,
      relativeDate: 'hace 3 semanas',
      text:
        'Si te gusta el buen café, este es el lugar que buscas.',
    },
    {
      author: 'Eva 00',
      rating: 5,
      relativeDate: 'hace 1 mes',
      text:
        'Me encanta visitar Café Los Grisales: la pizza, el café, los postres… todo es delicioso y la atención es maravillosa.',
    },
  ],
}
