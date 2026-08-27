const products = [
  { id: "001", name: "CK CORE TEE", price: "₹1,499", live: true },
  { id: "002", name: "STREET FORM", price: "₹1,699", live: false },
  { id: "003", name: "NIGHT SHIFT", price: "₹1,599", live: false },
  { id: "004", name: "RAW SIGNAL", price: "₹1,799", live: false },
  { id: "005", name: "CITY STATIC", price: "₹1,499", live: false },
  { id: "006", name: "AFTER DARK", price: "₹1,899", live: false },
];

function ProductArt({
  number,
  soldOut = false,
}: {
  number: string;
  soldOut?: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
      <svg
        viewBox="0 0 800 1000"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="800" height="1000" fill="#deded8" />

        <circle
          cx="400"
          cy="410"
          r="250"
          fill={soldOut ? "#999" : "#111"}
        />

        <text
          x="400"
          y="435"
          textAnchor="middle"
          fill="#f5f5f0"
          fontSize="110"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
        >
          CK
        </text>

        <text
          x="400"
          y="760"
          textAnchor="middle"
          fill="#111"
          fontSize="38"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          CLOVEKICK
        </text>

        <text
          x="400"
          y="810"
          textAnchor="middle"
          fill="#111"
          fontSize="28"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          DROP // {number}
        </text>
      </svg>

      {soldOut && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="rotate-[-8deg] border-2 border-black bg-[#f5f5f0] px-5 py-3 text-xs font-black uppercase tracking-widest">
            Sold Out
          </span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] text-black">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-2xl font-black tracking-[-0.08em]">
          CLOVEKICK®
        </div>

        <div className="hidden gap-8 text-xs font-bold uppercase tracking-widest md:flex">
          <a href="#drop">Latest Drop</a>
          <a href="#archive">Archive</a>
          <a href="#about">About</a>
        </div>

        <button className="text-xs font-bold uppercase tracking-widest">
          Cart (0)
        </button>
      </nav>

      {/* HERO */}
      <section className="px-6 pb-20 pt-24 md:px-12 md:pt-36">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em]">
          Independent streetwear / India
        </p>

        <h1 className="text-[17vw] font-black leading-[0.78] tracking-[-0.1em] md:text-[11vw]">
          KICK
          <br />
          DIFFERENT.
        </h1>

        <div className="mt-14 flex flex-col justify-between gap-8 border-t border-black pt-6 md:flex-row">
          <p className="max-w-md text-sm leading-6">
            Original pieces for people who don't dress for the algorithm.
            Limited drops. No unnecessary restocks.
          </p>

          <a
            href="#drop"
            className="w-fit border border-black px-7 py-4 text-xs font-bold uppercase tracking-widest transition hover:bg-black hover:text-white"
          >
            Explore Drop ↓
          </a>
        </div>
      </section>

      {/* LIVE DROP */}
      <section id="drop" className="px-6 py-16 md:px-12">
        <div className="mb-8 flex items-end justify-between border-b border-black pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">
              Drop 001
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              THE LIVE PIECE
            </h2>
          </div>

          <span className="hidden text-xs font-bold uppercase tracking-widest md:block">
            01 / 06
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ProductArt number="001" />

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
                Available
              </span>

              <h3 className="mt-6 text-5xl font-black tracking-[-0.06em] md:text-7xl">
                CK CORE
                <br />
                TEE
              </h3>

              <p className="mt-5 text-lg">₹1,499</p>

              <p className="mt-8 max-w-md text-sm leading-6 text-neutral-600">
                The first CloveKick release. Clean silhouette, original
                identity and a limited production run.
              </p>
            </div>

            <button className="mt-12 w-full bg-black px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* ARCHIVE */}
      <section id="archive" className="px-6 py-16 md:px-12">
        <div className="mb-10 border-b border-black pb-5">
          <p className="text-xs font-bold uppercase tracking-widest">
            Previous Releases
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            THE ARCHIVE
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8">
          {products.slice(1).map((product) => (
            <article key={product.id}>
              <ProductArt number={product.id} soldOut />

              <div className="mt-4 flex justify-between gap-3 text-xs font-bold uppercase">
                <span>{product.name}</span>
                <span>{product.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="border-t border-black px-6 py-24 md:px-12"
      >
        <p className="max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
          WE MAKE FEWER THINGS.
          <br />
          WE MAKE THEM MATTER.
        </p>

        <p className="mt-10 max-w-xl text-sm leading-6 text-neutral-600">
          CloveKick is an independent streetwear project focused on original
          design, limited releases and pieces worth keeping.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col justify-between gap-6 border-t border-black px-6 py-8 text-xs font-bold uppercase tracking-widest md:flex-row md:px-12">
        <span>© 2026 CLOVEKICK</span>
        <span>Made for the streets.</span>
      </footer>

    </main>
  );
}
