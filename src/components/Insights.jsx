export default function Insights() {
  const featured = {
    category: 'Strategy',
    title: 'Why Most Startups Keep Getting Design Wrong',
    description: 'Many teams move fast on product but fall behind on design. This post breaks down why that happens, how it holds you back, and what to do instead if you want to stay clear and competitive.',
    readTime: '5 min read',
    author: 'Whenever',
  }

  const articles = [
    {
      category: 'Growth',
      title: 'The Real Cost of Bad Design (It\'s Not What You Think)',
      description: 'Poor design slows down decisions, clutters your message and stalls growth.',
    },
    {
      category: 'Operations',
      title: 'How to Get More Done Without Hiring a Full Design Team',
      description: 'Lean teams are using design subscriptions to stay fast without hiring.',
    },
    {
      category: 'Workflow',
      title: 'What Working With a Design Subscription Actually Looks Like',
      description: 'A behind the scenes look at how founders use design subscriptions to move faster.',
    },
  ]

  return (
    <section className="w-full py-32 md:py-40 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-base-dark mb-4">
            <span className="text-accent-orange mr-2">▪</span>Insights
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark">Latest Articles</h2>
        </div>

        {/* Featured article */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Featured image placeholder */}
          <div className="bg-gray-200 rounded-[12px] overflow-hidden relative min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50"></div>
          </div>

          {/* Featured content */}
          <div className="flex flex-col justify-center p-6 lg:p-10">
            <span className="inline-block self-start px-3 py-1 bg-base-dark text-white text-xs font-mono uppercase tracking-wider rounded-full mb-6">{featured.category}</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark mb-4 leading-tight">{featured.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">{featured.description}</p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-base-border">
              <span className="font-mono text-xs text-gray-500">● {featured.readTime}</span>
              <span className="font-mono text-xs text-gray-500 italic">by {featured.author}</span>
            </div>
          </div>
        </div>

        {/* Three article cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="bg-base-light rounded-[12px] border border-base-border overflow-hidden flex flex-col group cursor-pointer hover:border-gray-400 transition-colors">
              {/* Card image placeholder */}
              <div className="relative h-[220px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50"></div>
                <span className="absolute top-4 right-4 px-3 py-1 bg-base-dark text-white text-xs font-mono uppercase tracking-wider rounded-full">{article.category}</span>
              </div>

              {/* Card content */}
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-display text-lg font-bold text-base-dark mb-3 leading-snug">{article.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
