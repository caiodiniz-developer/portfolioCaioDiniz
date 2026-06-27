// NOTE: These are placeholder testimonials.
// Replace with real client testimonials before launching.
export interface Testimonial {
  id: number
  quote: string
  quotePt: string
  name: string
  role: string
  company: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'Caio delivered a fast and professional website with great attention to detail. The animations and overall experience exceeded our expectations.',
    quotePt:
      'Caio entregou um site rápido e profissional com grande atenção aos detalhes. As animações e a experiência geral superaram nossas expectativas.',
    name: 'Vitor Diego',
    role: 'CEO',
    company: 'Vitor Diego Studio',
    avatar: '/assets/testemunha-1.png',
  },
  {
    id: 2,
    quote:
      'The project looked premium and helped our business look more trustworthy online. We saw a significant increase in customer inquiries after launch.',
    quotePt:
      'O projeto ficou premium e ajudou nosso negócio a parecer mais confiável online. Vimos um aumento significativo nas consultas de clientes após o lançamento.',
    name: 'Allan Santos',
    role: 'Founder',
    company: 'Allan Group',
    avatar: '/assets/testemunha-2.jpeg',
  },
  {
    id: 3,
    quote:
      'Great communication, clean design and smooth user experience. Caio understood exactly what we needed and delivered on time. Highly recommend!',
    quotePt:
      'Ótima comunicação, design limpo e experiência de usuário suave. Caio entendeu exatamente o que precisávamos e entregou no prazo. Recomendo!',
    name: 'Grupo Broup',
    role: 'Marketing Director',
    company: 'Broup Agency',
    avatar: '/assets/broup.png',
  },
]
