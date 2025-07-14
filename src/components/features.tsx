

export default function Features() {
  return (
   <section id="features" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate">
                The USDB Advantage
              </h3>
              <p
                className="text-muted max-w-2xl mx-auto scroll-animate"
                style={{ transitionDelay: "150ms" }}
              >
                A stablecoin engineered for decentralization, security, and
                capital efficiency.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="themed-card p-8 rounded-2xl scroll-animate">
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Natively on Bitcoin
                </h4>
                <p className="text-muted">
                  Unmatched security and robustness by leveraging the world's
                  most proven blockchain.
                </p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "100ms" }}
              >
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Overcollateralized & Stable
                </h4>
                <p className="text-muted">
                  Every USDB is backed by excess BTC collateral, ensuring a
                  resilient peg against volatility.
                </p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Fully Decentralized
                </h4>
                <p className="text-muted">
                  No central points of failure. Governed by the community
                  through immutable contracts.
                </p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "300ms" }}
              >
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Capital Efficient
                </h4>
                <p className="text-muted">
                  Unlock the value of your Bitcoin holdings without selling. Put
                  your assets to work.
                </p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "400ms" }}
              >
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Censorship-Resistant
                </h4>
                <p className="text-muted">
                  A truly permissionless stablecoin, open to anyone and
                  resistant to external control.
                </p>
              </div>
              <div
                className="themed-card p-8 rounded-2xl scroll-animate"
                style={{ transitionDelay: "500ms" }}
              >
                <h4 className="text-xl font-bold mb-3 gradient-text">
                  Ecosystem Ready
                </h4>
                <p className="text-muted">
                  Designed for seamless integration with DeFi, DEXs, and wallets
                  across all of crypto.
                </p>
              </div>
            </div>
          </div>
        </section>
  )
}
