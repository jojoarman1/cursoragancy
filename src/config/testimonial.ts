export interface TestimonialAuthor {
  name: string
  role: string
  photo: string
}

export interface Testimonial {
  text: string
  author: TestimonialAuthor
}

export const TESTIMONIAL: Testimonial = {
  text: '"Ваш сайт - это место, где клиенты решают, стоите ли вы их времени. Мы берем то, что делает вас незаменимым, формируем на основе этого весь опыт и убеждаем их в этом, прежде чем они прочтут еще хоть слово."',
  author: { name: 'Мухаметдинов Артем', role: 'CEO Dialog', photo: '/ceo.jpg' }
}
