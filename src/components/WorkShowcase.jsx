import { Link } from 'react-router-dom'

// Two rows, two cards each. Original proportional widths preserved via
// grid-template-columns ratios (so cards fill the row width while keeping
// their relative size). Heights match the user's intent: card 1 tallest,
// card 4 second-tallest, card 3 third, card 2 shortest.
const projects = [
  {
    name: 'Julian Mercier Architectural Practise',
    slug: 'julian-mercier',
    tags: ['Research', 'Strategy', 'Brand identity', 'Digital'],
    year: '2025',
    // Card aspect matches cover.mp4's native dimensions (2880×2160 = 4:3)
    // so the video fills the frame edge-to-edge with no crop.
    aspect: 'aspect-[4/3]',
    coverVideo: `${import.meta.env.BASE_URL}julian-mercier/cover.mp4`,
  },
  {
    name: 'Australia Medical Association Victoria',
    slug: 'australia-medical-association-victoria',
    tags: ['Design system', 'Web platform', 'Websites', 'Admin system'],
    // Card sized to the cover video's native aspect (3668×2160 ≈ 17:10) so
    // the video fills the frame edge-to-edge with no crop. `aspect` takes
    // priority over `height` in CardBody.
    aspect: 'aspect-[17/10]',
    via: 'via Roadhouse',
    coverVideo: `${import.meta.env.BASE_URL}australia-medical-association-victoria/cover.mp4`,
  },
  // Card 3 (smaller slot, row 2 left) — meCash. Detail page is live.
  // Aspect matches cover.png's exact 2072×1490 so the image fills the
  // card pixel-for-pixel with no crop.
  {
    name: 'meCash',
    slug: 'mecash',
    tags: ['Discovery', 'Strategy', 'Mobile app', 'Web app', 'Websites'],
    aspect: 'aspect-[2072/1490]',
    coverImage: `${import.meta.env.BASE_URL}mecash/cover.png`,
  },
  // Card 4 (bigger slot, row 2 right) — Time BMX. Detail page is live.
  // Aspect matches cover.mp4's native 2880×2160 = 4:3.
  {
    name: 'Time BMX',
    slug: 'time-bmx',
    tags: ['Design system', 'Mobile app', 'Web app'],
    aspect: 'aspect-[4/3]',
    via: 'via Roadhouse',
    coverVideo: `${import.meta.env.BASE_URL}time-bmx/cover.mp4`,
  },
]

function CardBody({ project }) {
  return (
    <article className="flex flex-col gap-5">
      {/* Media surface — autoplays the cover video if set; otherwise shows
          a neutral placeholder. For coming-soon projects, an overlay reveals
          on hover with the "Coming soon, very soon" message. */}
      <div className={`relative w-full ${project.aspect || project.height} bg-card-soft overflow-hidden`}>
        {project.coverVideo ? (
          <video
            src={project.coverVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03]">
            Coming soon
          </span>
        )}

        {/* Hover overlay for coming-soon projects */}
        {project.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-dark/0 opacity-0 transition-all duration-300 ease-out group-hover:bg-base-dark/55 group-focus-within:bg-base-dark/55 group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-white">
              Coming soon, very soon
            </span>
          </div>
        )}
      </div>

      {/* Meta — tags on top; year stays inline on the lead card; the
          "via Roadhouse" / "Coming soon" pill drops to its own row below
          so it doesn't push the tag wrapping around. */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-gray-500 leading-snug">
            {project.tags.join(' · ')}
          </span>
          {project.year && (
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-gray-500 shrink-0">
              {project.year}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {project.comingSoon && (
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-base-dark bg-base-light px-3 py-1 rounded-full">
              Coming soon
            </span>
          )}
          {project.via && (
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-base-dark bg-base-light px-3 py-1 rounded-full">
              {project.via}
            </span>
          )}
        </div>
      </div>

      {/* Project name */}
      <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
        {project.name}
      </h3>
    </article>
  )
}

function ProjectCard({ project }) {
  // Coming-soon projects have no detail page yet, so render the card as a
  // non-interactive div instead of a router Link. The hover overlay still
  // fires via the `group` class.
  if (project.comingSoon) {
    return (
      <div className="ws-project group block cursor-default">
        <CardBody project={project} />
      </div>
    )
  }
  return (
    <Link to={`/work/${project.slug}`} className="ws-project group block">
      <CardBody project={project} />
    </Link>
  )
}

export default function WorkShowcase() {
  return (
    <section id="work" className="w-full py-20 md:py-32 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="ws-header mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">// Case studies</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-base-dark leading-[1.05]">
              Selected work <span className="text-base-dark/50 text-2xl md:text-3xl align-top">(04)</span>
            </h2>
          </div>

          <p className="text-gray-600 text-base md:text-lg max-w-sm leading-relaxed">
            A selection of recent brand and digital projects, shaped through clarity, strategy, and craft.
          </p>
        </div>

        <Link
          to="/showcase"
          className="ws-header inline-flex items-center gap-2 mb-12 md:mb-16 font-mono text-xs uppercase tracking-wider text-base-dark hover:text-accent-red transition-colors"
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent-red" />
          View full Showcase
        </Link>

        {/* 2×2 grid. Row widths preserve the original card proportions:
            row 1 = 60:40 (cards 1, 2), row 2 = 35:50 normalized to 7:10
            (cards 3, 4). Mobile stacks to a single column. */}
        <div className="ws-grid space-y-12 md:space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-6 md:gap-8 items-start">
            <ProjectCard project={projects[0]} />
            <ProjectCard project={projects[1]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[35fr_50fr] gap-6 md:gap-8 items-start">
            <ProjectCard project={projects[2]} />
            <ProjectCard project={projects[3]} />
          </div>
        </div>
      </div>
    </section>
  )
}
