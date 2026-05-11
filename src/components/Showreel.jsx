import { isSlowOrMeteredConnection } from '../utils/network'

// Launch showreel — sits directly under the hero on the home page. 16:9
// container matches the source video's native 3840×2160. Autoplays muted
// on capable connections; falls back to <video controls> for users on
// slow or metered networks so they can opt in.
export default function Showreel() {
  const autoplay = !isSlowOrMeteredConnection()

  return (
    <section className="w-full px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-20 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative w-full aspect-video overflow-hidden bg-base-dark">
          <video
            src={`${import.meta.env.BASE_URL}showreel.mp4`}
            autoPlay={autoplay}
            muted
            loop
            playsInline
            controls={!autoplay}
            preload="metadata"
            aria-hidden={autoplay ? 'true' : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
