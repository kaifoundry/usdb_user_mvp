import type { AccordionToggleHandler } from "../types/faq";


export default function Faq({ handleAccordionToggle }: { handleAccordionToggle: AccordionToggleHandler }) {
  return (
     <section id="faq" className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-4">
              <div className="scroll-animate">
                <details
                  className="themed-card p-6 rounded-lg cursor-pointer group"
                  onClick={handleAccordionToggle}
                >
                  <summary className="font-semibold text-lg flex justify-between items-center">
                    What are Runes?
                    <span className="text-amber-400 transform transition-transform duration-300 plus-icon text-2xl">
                      +
                    </span>
                  </summary>
                  <p
                    className="text-muted mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--card-border-color)" }}
                  >
                    Runes are a new, efficient fungible token protocol on
                    Bitcoin. USDB utilizes Runes to issue its stablecoin
                    directly on the Bitcoin network, inheriting its unparalleled
                    security and decentralization.
                  </p>
                </details>
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "100ms" }}
              >
                <details
                  className="themed-card p-6 rounded-lg cursor-pointer group"
                  onClick={handleAccordionToggle}
                >
                  <summary className="font-semibold text-lg flex justify-between items-center">
                    What is the minimum collateralization ratio?
                    <span className="text-amber-400 transform transition-transform duration-300 plus-icon text-2xl">
                      +
                    </span>
                  </summary>
                  <p
                    className="text-muted mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--card-border-color)" }}
                  >
                    The protocol maintains a high level of
                    overcollateralization. The minimum ratio is determined by
                    governance but is designed with a significant safety buffer
                    (e.g., 110% or higher) to absorb BTC price volatility and
                    ensure solvency.
                  </p>
                </details>
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "200ms" }}
              >
                <details
                  className="themed-card p-6 rounded-lg cursor-pointer group"
                  onClick={handleAccordionToggle}
                >
                  <summary className="font-semibold text-lg flex justify-between items-center">
                    How is the USDB price kept stable?
                    <span className="text-amber-400 transform transition-transform duration-300 plus-icon text-2xl">
                      +
                    </span>
                  </summary>
                  <p
                    className="text-muted mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--card-border-color)" }}
                  >
                    Stability is maintained through overcollateralization and
                    market arbitrage. If USDB $1, users can mint and sell for a
                    profit. If USDB $1, users can buy it cheaply from the market
                    and redeem it for $1 worth of BTC from the protocol, driving
                    the price back to its peg.
                  </p>
                </details>
              </div>
              <div
                className="scroll-animate"
                style={{ transitionDelay: "300ms" }}
              >
                <details
                  className="themed-card p-6 rounded-lg cursor-pointer group"
                  onClick={handleAccordionToggle}
                >
                  <summary className="font-semibold text-lg flex justify-between items-center">
                    Is the protocol audited?
                    <span className="text-amber-400 transform transition-transform duration-300 plus-icon text-2xl">
                      +
                    </span>
                  </summary>
                  <p
                    className="text-muted mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--card-border-color)" }}
                  >
                    Security is paramount. The USDB smart contracts undergo
                    multiple rigorous audits by top-tier security firms before
                    launch. All audit reports will be made public for full
                    transparency and community review.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
  )
}
