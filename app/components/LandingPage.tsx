import Link from "next/link";
import type { ReactNode } from "react";

// ── SVG paw print for use inside <svg> elements ───────────────────────────────

function PawGroup({
  x,
  y,
  scale,
  rotate,
  opacity,
}: {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      fill="#b45309"
      fillOpacity={opacity}
    >
      <ellipse cx="14" cy="10" rx="5.5" ry="7" transform="rotate(-10 14 10)" />
      <ellipse cx="28" cy="8" rx="5" ry="6.5" transform="rotate(8 28 8)" />
      <ellipse cx="8" cy="22" rx="4.5" ry="6" transform="rotate(-20 8 22)" />
      <ellipse cx="38" cy="20" rx="4.5" ry="6" transform="rotate(20 38 20)" />
      <ellipse cx="23" cy="34" rx="13" ry="12" />
    </g>
  );
}

// ── Paw icon for use inside HTML elements ─────────────────────────────────────

function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <ellipse cx="14" cy="10" rx="5.5" ry="7" transform="rotate(-10 14 10)" />
      <ellipse cx="28" cy="8" rx="5" ry="6.5" transform="rotate(8 28 8)" />
      <ellipse cx="8" cy="22" rx="4.5" ry="6" transform="rotate(-20 8 22)" />
      <ellipse cx="38" cy="20" rx="4.5" ry="6" transform="rotate(20 38 20)" />
      <ellipse cx="23" cy="34" rx="13" ry="12" />
    </svg>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────

function FeatureCard({
  iconBg,
  icon,
  headline,
  body,
}: {
  iconBg: string;
  icon: ReactNode;
  headline: string;
  body: string;
}) {
  return (
    <div className="bg-[#fdf6ee] rounded-3xl p-8 border border-amber-100">
      <div
        className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-amber-900 mb-3">{headline}</h3>
      <p className="text-amber-800 leading-relaxed text-sm">{body}</p>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-100">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/sharedleash-logo.png" alt="SharedLeash" style={{height: "48px", width: "auto"}} className="object-contain" />
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#features"
            className="hidden md:block text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            How it works
          </a>
          <Link
            href="/login"
            className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Join the Community
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="1050"
            cy="160"
            rx="260"
            ry="210"
            fill="#f0c48a"
            fillOpacity="0.2"
            transform="rotate(20 1050 160)"
          />
          <ellipse
            cx="130"
            cy="660"
            rx="220"
            ry="180"
            fill="#e8c4b8"
            fillOpacity="0.25"
            transform="rotate(-15 130 660)"
          />
          <ellipse
            cx="600"
            cy="780"
            rx="380"
            ry="130"
            fill="#fce8d5"
            fillOpacity="0.5"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="120"
            ry="100"
            fill="#a8c5a0"
            fillOpacity="0.12"
            transform="rotate(10 200 200)"
          />
          <PawGroup x={960} y={60} scale={1.1} rotate={18} opacity={0.1} />
          <PawGroup x={60} y={100} scale={0.7} rotate={-12} opacity={0.09} />
          <PawGroup x={1100} y={500} scale={0.6} rotate={35} opacity={0.08} />
          <PawGroup x={230} y={560} scale={0.8} rotate={-20} opacity={0.09} />
          <PawGroup x={700} y={40} scale={0.5} rotate={10} opacity={0.07} />
          <PawGroup x={440} y={680} scale={0.45} rotate={-8} opacity={0.07} />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-amber-600 text-sm font-medium tracking-widest uppercase mb-8">
          Pet grief support
        </span>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-amber-950 leading-[1.1] mb-7">
          You don&apos;t have to
          <br />
          carry this alone.
        </h1>
        <p className="text-lg sm:text-xl text-amber-800 leading-relaxed max-w-xl mb-10">
          Shared Leash is a compassionate AI companion for people grieving the
          loss of a beloved pet — available any time, ready to listen without
          judgment.
        </p>
        <Link
          href="/register"
          className="bg-amber-600 hover:bg-amber-700 text-white text-base font-medium px-8 py-4 rounded-2xl transition-colors shadow-sm"
        >
          Join the Community
        </Link>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-4">
            What Shared Leash offers
          </h2>
          <p className="text-amber-700 text-lg max-w-lg mx-auto">
            A gentle companion, built for this specific kind of grief.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            iconBg="bg-rose-100"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-rose-400"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            }
            headline="Always here."
            body="Grief doesn't keep office hours. Whether it's 3am and you can't sleep, or a quiet moment when the weight of it hits you — Shared Leash is here. No waiting room. No appointments. Just a gentle presence, whenever you need it."
          />
          <FeatureCard
            iconBg="bg-green-100"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-green-500"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
            headline="Truly understood."
            body="This isn't a general chatbot. Shared Leash was built specifically for pet loss — because losing a companion animal is real grief, and you deserve a space that already knows that."
          />
          <FeatureCard
            iconBg="bg-amber-100"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-amber-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
            headline="A place to remember."
            body="Your pet's name, their quirks, the memories you treasure — you can share all of it here. Shared Leash holds your story with care, and keeps it close across every conversation."
          />
        </div>
      </div>
    </section>
  );
}

// ── Who this is for ───────────────────────────────────────────────────────────

function WhoSection() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-10 text-center">
          Whatever your loss looks like,
          <br className="hidden sm:block" /> you belong here.
        </h2>
        <div className="text-amber-800 text-lg leading-loose space-y-6">
          <p>
            Maybe your loss was sudden — there one moment, gone the next, with
            no time to say goodbye. Maybe you made a decision that still haunts
            you, and the guilt feels heavier than the grief itself. Maybe
            you&apos;re grieving a pet you haven&apos;t yet lost, watching them
            slow down day by day.
          </p>
          <p>
            And maybe the hardest part is that the people around you don&apos;t
            quite understand. They care — but they say{" "}
            <em className="italic text-amber-900">it was just a pet</em>, and
            something in you flinches.
          </p>
          <p>
            Shared Leash is for all of it. For every kind of loss, every kind
            of love. You belong here.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Sample moment ─────────────────────────────────────────────────────────────

function SampleSection() {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-4">
            A moment of care
          </h2>
          <p className="text-amber-700 text-lg">
            This is what it feels like to be heard.
          </p>
        </div>
        <div className="bg-[#fdf6ee] rounded-3xl border border-amber-100 p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex justify-end">
            <div className="bg-amber-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-sm text-sm leading-relaxed shadow-sm">
              I feel so guilty. I keep wondering if I made the right decision to
              put her to sleep.
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PawIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div className="bg-white text-amber-950 border border-amber-100 px-5 py-3.5 rounded-2xl rounded-tl-sm max-w-sm text-sm leading-relaxed shadow-sm">
              That guilt is one of the hardest parts of this kind of loss. Is
              there a specific moment you keep replaying, or is it more of a
              constant weight?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Community and support ─────────────────────────────────────────────────────

function CommunitySection() {
  return (
    <section className="px-6 py-24 bg-[#fdf6ee]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-10">
          A space that remembers.
        </h2>
        <div className="text-amber-800 text-lg leading-loose space-y-6">
          <p>
            Shared Leash is built on privacy and care. What you share here stays
            here — a quiet space that&apos;s entirely your own.
          </p>
          <p>
            Over time, Shared Leash learns your story. It remembers your
            pet&apos;s name. It knows what you&apos;ve carried. Each
            conversation picks up where the last left off, because grief
            isn&apos;t something you start over from scratch each time.
          </p>
          <p>
            You don&apos;t have to explain yourself here. You just have to show
            up.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── CTA footer ────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative px-6 py-28 text-center overflow-hidden bg-gradient-to-b from-[#fce8d5] to-[#fdf6ee]">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="150"
            cy="100"
            rx="200"
            ry="170"
            fill="#f0c48a"
            fillOpacity="0.18"
            transform="rotate(10 150 100)"
          />
          <ellipse
            cx="1080"
            cy="500"
            rx="240"
            ry="200"
            fill="#e8c4b8"
            fillOpacity="0.22"
            transform="rotate(-20 1080 500)"
          />
          <PawGroup x={100} y={80} scale={0.8} rotate={-15} opacity={0.09} />
          <PawGroup x={1000} y={350} scale={0.9} rotate={22} opacity={0.09} />
          <PawGroup x={600} y={450} scale={0.5} rotate={5} opacity={0.07} />
        </svg>
      </div>
      <div className="relative max-w-xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-8 leading-snug">
          Your pet&apos;s memory deserves
          <br className="hidden sm:block" /> a place to live.
        </h2>
        <Link
          href="/register"
          className="bg-amber-600 hover:bg-amber-700 text-white text-base font-medium px-8 py-4 rounded-2xl transition-colors shadow-sm mb-4"
        >
          Join the Community
        </Link>
        <p className="text-amber-600 text-sm">Free to start. No commitment.</p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#fdf6ee] border-t border-amber-100 px-6 py-8 text-center text-xs text-amber-700/70">
      <div className="flex justify-center gap-6 mb-2">
        <Link href="/terms" className="hover:text-amber-900 transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-amber-900 transition-colors">
          Privacy Policy
        </Link>
      </div>
      <p>&copy; {new Date().getFullYear()} Shared Leash. All rights reserved.</p>
    </footer>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <Nav />
      <HeroSection />
      <FeaturesSection />
      <WhoSection />
      <SampleSection />
      <CommunitySection />
      <CTASection />
      <Footer />
    </div>
  );
}
