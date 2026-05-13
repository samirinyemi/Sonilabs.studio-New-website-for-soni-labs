import { VideoSources } from '../utils/videoSources'

// Launch showreel — sits directly under the hero on the home page. 16:9
// container matches the source video's native 3840×2160. Always autoplays
// muted + inline; preload="auto" so enough of the video buffers to start
// without a noticeable lag.
export default function Showreel() {
  return (
    <section className="w-full px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-20 bg-base-pure">
      <div className="max-w-[1600px] mx-auto">
        <div className="relative w-full aspect-video overflow-hidden bg-base-dark">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <VideoSources src={`${import.meta.env.BASE_URL}showreel.mp4`} />
          </video>
        </div>
      </div>
    </section>
  )
}
