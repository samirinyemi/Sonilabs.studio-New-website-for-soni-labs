import Contact from '../components/Contact'
import SEO from '../components/SEO'

export default function EnquirePage() {
  return (
    <>
      <SEO
        title="Book a strategy call"
        path="/enquire"
        description="Book a 30-minute strategy call with Soni Labs. We'll diagnose what you need and propose a path — no pitch, no pressure."
      />
      <h1 className="sr-only">Enquire — Soni Labs Studio</h1>
      <Contact />
    </>
  )
}
