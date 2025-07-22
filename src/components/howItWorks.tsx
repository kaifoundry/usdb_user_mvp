

export default function Howitworks() {
  return (
   <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate">
                How USDB Works
              </h3>
              <p
                className="text-muted max-w-2xl mx-auto scroll-animate"
                style={{ transitionDelay: "150ms" }}
              >
                A simple, transparent, and secure process to mint the world's
                most robust stablecoin.
              </p>
            </div>

            <div className="timeline-container">
              <div className="timeline-line"></div>
              {/* <!-- Step 1 --> */}
              <div className="timeline-item mb-16 scroll-animate">
                <div className="timeline-dot"></div>
                <div className="themed-card p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="icon-circle flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full">
                      <svg
                        className="w-10 h-10 text-amber-400"
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
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold mb-1">
                        1. Deposit BTC
                      </h4>
                      <p className="text-muted">
                        Securely deposit Bitcoin into an audited smart contract
                        to open a Collateralized Debt Position (CDP).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Step 2 --> */}
              <div className="timeline-item mb-16 scroll-animate">
                <div className="timeline-dot"></div>
                <div className="themed-card p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="icon-circle flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full">
                      <svg
                        className="w-10 h-10 text-amber-400"
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
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold mb-1">
                        2. Mint USDB
                      </h4>
                      <p className="text-muted">
                        Generate USDB Runes against your collateral. Your
                        position remains overcollateralized for maximum safety.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Step 3 --> */}
              <div className="timeline-item scroll-animate">
                <div className="timeline-dot"></div>
                <div className="themed-card p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="icon-circle flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full">
                      <svg
                        className="w-10 h-10 text-amber-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75A.75.75 0 014.5 8.25h-.75m0 0h.75a.75.75 0 00.75-.75V7.5m0 0v-.75A.75.75 0 003.75 6h-.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v.75a.75.75 0 01-.75.75h-.75m2.25-4.5h3.375c.621 0 1.125.504 1.125 1.125V18.75m-4.5 0V6.75A2.25 2.25 0 019.75 4.5h9.75a2.25 2.25 0 012.25 2.25v12m-13.5 0v-3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V18.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold mb-1">
                        3. Utilize USDB
                      </h4>
                      <p className="text-muted">
                        Engage with the DeFi ecosystem. Repay your debt anytime
                        to reclaim your Bitcoin collateral.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}
