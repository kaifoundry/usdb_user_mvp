import { Link } from "react-router-dom";


export default function HeroSection() {
  return (
      <section className="text-center py-24 md:py-40 relative">
              <div className="hero-aurora"></div>
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 scroll-animate">
                  The Unshakeable Stablecoin, <br /> Natively on{" "}
                  <span className="gradient-text">Bitcoin</span>.
                </h2>
                <p
                  className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10 scroll-animate"
                  style={{ transitionDelay: "150ms" }}
                >
                  USDB is a decentralized stablecoin overcollateralized by Bitcoin.
                  Mint USDB Runes and experience true financial stability on the
                  world's most secure blockchain.
                </p>
                <div
                  className="flex justify-center space-x-4 scroll-animate"
                  style={{ transitionDelay: "300ms" }}
                >
                  <Link
                    to="/usdb"
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg transform hover:scale-105 shadow-lg shadow-amber-500/20"
                  >
                    Launch App
                  </Link>
                  {/* <a
                    href="#"
                    className="secondary-button font-bold py-3 px-8 rounded-lg transition-colors text-lg"
                  >
                    Join Community
                  </a> */}
                </div>
              </div>
            </section>
  )
}
