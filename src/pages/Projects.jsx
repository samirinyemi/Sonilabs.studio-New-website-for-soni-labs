import WorkShowcase from '../components/WorkShowcase'

// Dedicated Projects page. Mirrors the WorkShowcase section from the
// home page so visitors who land here directly (or via the nav) get the
// same case-study grid without the surrounding home-page sections.
export default function ProjectsPage() {
  return (
    <>
      <h1 className="sr-only">Projects — Soni Labs Studio</h1>
      <WorkShowcase />
    </>
  )
}
