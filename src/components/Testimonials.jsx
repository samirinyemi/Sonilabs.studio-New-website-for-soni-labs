import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSanityData } from '../hooks/useSanityData'

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const Stars = ({ color }) => (
  <div className="flex gap-1 mb-6">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 ${color} fill-current`} />
    ))}
  </div>
)

const fallbackTestimonials = [
  {
    name: 'Marcus Chen',
    role: 'CEO',
    company: 'Nexus AI',
    quote: '"Working with Soni Labs was the best decision for our launch. Samuel didn\'t just build what we asked for, he designed a system that actually generates leads. The speed was incredible."',
    featured: false,
  },
  {
    name: 'Sarah Jenkins',
    role: 'Founder',
    company: 'Flowstate',
    quote: '"The Embedded Design Partner retainer changed how we operate. Instead of hiring a full-time designer, we get top-tier UI/UX and immediate implementation. Huge ROI for our lean team."',
    featured: true,
  },
  {
    name: 'David Miller',
    role: 'CTO',
    company: 'Vanguard Health',
    quote: '"Zero handoffs means zero miscommunication. What we approved in Figma was exactly what launched, plus smart automations we didn\'t even know we needed."',
    featured: false,
  },
]

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(order asc) { name, role, company, quote, featured, "avatarUrl": avatar.asset->url }`

export default function Testimonials() {
  const container = useRef(null)
  const { data: testimonials } = useSanityData(TESTIMONIALS_QUERY, fallbackTestimonials)

  useGSAP(() => {
    gsap.from('.test-heading', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.test-heading', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.test-card', {
      y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.test-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} className="w-full py-20 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">// Social proof</p>
          <h2 className="test-heading font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-base-dark max-w-3xl mx-auto leading-tight">Trusted by teams building the next wave.</h2>
        </div>

        <div className="test-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const isFeatured = t.featured
            return (
              <div
                key={i}
                className={`test-card p-8 rounded-[12px] flex flex-col ${
                  isFeatured
                    ? 'bg-base-dark text-white border border-gray-800 transform md:-translate-y-4'
                    : 'bg-white border border-base-border'
                }`}
              >
                <Stars color={isFeatured ? 'text-accent-yellow' : 'text-accent-red'} />
                <p className={`mb-8 flex-grow leading-relaxed ${isFeatured ? 'text-gray-300' : 'text-gray-700'}`}>{t.quote}</p>
                <div className={`flex items-center gap-3 pt-6 border-t ${isFeatured ? 'border-gray-800' : 'border-base-border'}`}>
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isFeatured ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {t.name?.[0] || '?'}
                    </div>
                  )}
                  <div>
                    <p className={`font-bold text-sm ${isFeatured ? 'text-white' : 'text-base-dark'}`}>{t.name}</p>
                    <p className={`text-xs ${isFeatured ? 'text-gray-400' : 'text-gray-500'}`}>{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
