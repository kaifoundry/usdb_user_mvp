

export default function ProtocolStats() {
  return (
     <section id="protocol-stats" className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="themed-card p-8 rounded-2xl scroll-animate">
                <div className="flex items-center gap-4 mb-2">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0l.879-.659M7.5 14.25l6 6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-muted">
                    Total Market Cap
                  </h4>
                </div>
                <p className="text-4xl font-bold">$123,456,789</p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "150ms" }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m12 3V9"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-muted">
                    Total Collateral
                  </h4>
                </div>
                <p className="text-4xl font-bold">4,567.89 BTC</p>
              </div>
            </div>
          </div>
        </section>
  )
}
