export default function Work() {
  return (
    <section id="work" className="w-full py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="group cursor-pointer">
          <div className="bg-base-light rounded-[12px] overflow-hidden mb-6 relative border border-base-border p-4 flex flex-col">
            {/* Browser chrome */}
            <div className="h-8 w-full border-b border-base-border flex items-center px-4 gap-2 mb-4 bg-white rounded-t-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
              {/* Video placeholder */}
              <div className="md:col-span-2 bg-gray-200 rounded-xl relative overflow-hidden min-h-[530px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/30 to-gray-300/30"></div>
                <div className="relative z-10 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-base-dark ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                {/* Image placeholder */}
                <div className="bg-gray-200 rounded-xl relative overflow-hidden flex-1 min-h-[140px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50"></div>
                </div>

                {/* Text placeholder */}
                <div className="bg-white rounded-xl border border-base-border p-5 flex flex-col justify-center min-h-[70px]">
                  <div className="w-3/4 h-3 bg-gray-200 rounded-full mb-3"></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                  <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
