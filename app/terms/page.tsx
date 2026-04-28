import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Shared Leash",
};

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="currentColor">
      <ellipse cx="14" cy="10" rx="5.5" ry="7" transform="rotate(-10 14 10)" />
      <ellipse cx="28" cy="8" rx="5" ry="6.5" transform="rotate(8 28 8)" />
      <ellipse cx="8" cy="22" rx="4.5" ry="6" transform="rotate(-20 8 22)" />
      <ellipse cx="38" cy="20" rx="4.5" ry="6" transform="rotate(20 38 20)" />
      <ellipse cx="23" cy="34" rx="13" ry="12" />
    </svg>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-amber-900 mb-4 pb-2 border-b border-amber-100">
      {children}
    </h2>
  );
}

function Callout({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "info" | "warning";
  children: React.ReactNode;
}) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-800",
    info: "border-blue-300 bg-blue-50 text-blue-800",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
  };
  return (
    <div className={`border-l-4 ${tones[tone]} rounded-r-lg px-5 py-4 my-5 text-sm`}>
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PawIcon className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-900 text-lg tracking-tight">
              Shared Leash
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            Back home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-amber-900 leading-relaxed">
        <header className="border-b border-amber-100 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <PawIcon className="w-4 h-4 text-amber-600" />
            </div>
            <span className="font-semibold text-amber-900">Shared Leash</span>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Beta
            </span>
          </div>
          <h1 className="text-4xl font-bold text-amber-950 mb-4 leading-tight">
            Terms of Service
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-amber-700">
            <span>Effective date: <strong className="text-amber-900 font-medium">July 1, 2025</strong></span>
            <span>Last updated: <strong className="text-amber-900 font-medium">April 28, 2026</strong></span>
            <span>Version: <strong className="text-amber-900 font-medium">1.2 (Beta)</strong></span>
          </div>
        </header>

        <div className="bg-white/60 border border-amber-100 rounded-2xl px-6 py-5 mb-12">
          <div className="text-xs uppercase tracking-wider text-amber-700 font-medium mb-3">
            Contents
          </div>
          <ol className="list-decimal pl-5 text-sm text-amber-700 sm:columns-2 gap-x-8 space-y-1.5">
            <li><a href="#acceptance" className="hover:underline">Acceptance of terms</a></li>
            <li><a href="#beta" className="hover:underline">Beta program &amp; service changes</a></li>
            <li><a href="#eligibility" className="hover:underline">Eligibility</a></li>
            <li><a href="#ai-disclaimer" className="hover:underline">AI &amp; mental health disclaimer</a></li>
            <li><a href="#veterinary" className="hover:underline">Veterinary &amp; medical disclaimer</a></li>
            <li><a href="#subscriptions" className="hover:underline">Subscriptions &amp; payments</a></li>
            <li><a href="#content" className="hover:underline">User content &amp; data</a></li>
            <li><a href="#acceptable-use" className="hover:underline">Acceptable use</a></li>
            <li><a href="#privacy" className="hover:underline">Privacy</a></li>
            <li><a href="#liability" className="hover:underline">Disclaimer &amp; limitation of liability</a></li>
            <li><a href="#disputes" className="hover:underline">Dispute resolution &amp; arbitration</a></li>
            <li><a href="#termination" className="hover:underline">Termination</a></li>
            <li><a href="#governing" className="hover:underline">Governing law</a></li>
            <li><a href="#changes" className="hover:underline">Changes to these terms</a></li>
            <li><a href="#contact" className="hover:underline">Contact information</a></li>
          </ol>
        </div>

        <div className="space-y-12 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_strong]:font-semibold [&_strong]:text-amber-950 [&_section]:scroll-mt-24">
          <section id="acceptance">
            <H2>1. Acceptance of terms</H2>
            <p>These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and DIGITAL PIER LLC, an Ohio limited liability company (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of the Shared Leash platform, website, mobile application, and all related services (collectively, the &quot;Service&quot;).</p>
            <p>By creating an account, accessing the Service, or clicking &quot;I agree,&quot; you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. <strong>If you do not agree, do not use the Service.</strong></p>
          </section>

          <section id="beta">
            <H2>2. Beta program &amp; service changes</H2>
            <Callout tone="warning">
              <strong>You are using a beta version of Shared Leash.</strong> The Service is provided in its current form for evaluation and early access. Features, pricing, data structures, and availability may change at any time without notice.
            </Callout>
            <p>The Service relies on third-party infrastructure and Artificial Intelligence providers (including but not limited to OpenAI or Anthropic). We are not liable for service interruptions, delays, inaccuracies, &quot;hallucinations&quot; (factually incorrect AI responses), or data loss caused by third-party providers or general internet outages.</p>
            <p>Data created during beta testing may not be preserved upon launch of a production version.</p>
          </section>

          <section id="eligibility">
            <H2>3. Eligibility</H2>
            <p>You must be at least 18 years of age to use the Service. By using the Service, you represent that you have the legal capacity to enter into a binding contract.</p>
            <p>The Service is not intended for individuals experiencing a mental health emergency.</p>
          </section>

          <section id="ai-disclaimer">
            <H2>4. AI &amp; mental health disclaimer</H2>
            <Callout tone="danger">
              <strong>Critical notice.</strong> Shared Leash uses artificial intelligence to provide pet grief support and emotional companionship resources. You are interacting with an artificial intelligence system, not a human.
            </Callout>
            <p>The Service is <strong>NOT</strong> a licensed mental health service, therapy, counseling, crisis intervention, or medical service of any kind. Use of the Service does not create a therapist-patient, counselor-client, or medical relationship.</p>
            <p><strong>No human monitoring.</strong> The Service is fully automated. The Company does not monitor conversations in real time and has no obligation to review, respond to, or act upon any user messages.</p>
            <p><strong>Not professional advice.</strong> AI-generated responses are produced by statistical models and do not reflect the advice or opinions of licensed professionals. Responses may be inaccurate, incomplete, or emotionally inappropriate for your specific situation.</p>
            <p><strong>Limitations of AI.</strong> You acknowledge that AI systems are inherently imperfect and may generate unpredictable or unintended outputs.</p>
            <p><strong>Crisis protocol.</strong> The Service must not be relied upon in crisis situations.</p>
            <Callout tone="info">
              <strong>If you are experiencing thoughts of self-harm or a mental health emergency, contact the 988 Suicide &amp; Crisis Lifeline by calling or texting 988, or contact emergency services at 911 immediately.</strong>
            </Callout>
          </section>

          <section id="veterinary">
            <H2>5. Veterinary &amp; medical disclaimer</H2>
            <p>Shared Leash is intended solely for emotional support related to pet loss.</p>
            <p>The Service is not a substitute for professional veterinary care and must not be used to diagnose, treat, or provide medical advice for any animal.</p>
            <p>The Company disclaims all liability for actions taken regarding the health or safety of animals based on AI-generated content.</p>
          </section>

          <section id="subscriptions">
            <H2>6. Subscriptions &amp; payments</H2>
            <p>Shared Leash may offer free and paid subscription tiers processed through third-party payment providers such as Stripe, Inc.</p>
            <ul>
              <li><strong>Billing:</strong> Paid subscriptions may include recurring monthly or annual charges.</li>
              <li><strong>Cancellation:</strong> You may cancel at any time through your account settings. Access will continue through the end of the current billing period.</li>
              <li><strong>Refunds:</strong> All fees are non-refundable except where required by applicable law.</li>
            </ul>
          </section>

          <section id="content">
            <H2>7. User content &amp; data</H2>
            <p>You retain ownership of any content you submit, including messages, images, and memorial data (&quot;User Content&quot;).</p>
            <p>By using the Service, you grant the Company a non-exclusive, worldwide license to use, store, process, and analyze User Content for the purpose of operating, maintaining, and improving the Service.</p>
            <p>User conversations may be stored and analyzed to improve system performance. Conversations are not monitored in real time.</p>
            <p><strong>Post-termination data.</strong> The Company reserves the right to delete User Content after a 30-day grace period following account closure or subscription expiration. You are responsible for exporting any data you wish to retain.</p>
          </section>

          <section id="acceptable-use">
            <H2>8. Acceptable use</H2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Engage in illegal activity</li>
              <li>Generate or distribute harmful, abusive, or explicit content</li>
              <li>Attempt to bypass, manipulate, or &quot;jailbreak&quot; AI safety systems</li>
              <li>Impersonate another person or misrepresent identity</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these rules.</p>
          </section>

          <section id="privacy">
            <H2>9. Privacy</H2>
            <p>Your use of the Service is subject to our <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link>. Because the Service may process sensitive emotional information, you acknowledge and consent to the storage and processing of such data as described in the <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section id="liability">
            <H2>10. Disclaimer &amp; limitation of liability</H2>
            <p><strong>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot;</strong></p>
            <p>To the maximum extent permitted by law, the Company disclaims all warranties, express or implied.</p>
            <p>You acknowledge that interacting with an AI system during bereavement may have unpredictable emotional effects. You voluntarily assume all risks associated with use of the Service.</p>
            <p>The Company is not responsible for any decisions, actions, or emotional outcomes resulting from your use of the Service.</p>
            <p>In no event shall the Company&apos;s total liability exceed the greater of:</p>
            <ul>
              <li>(a) the amount paid by you in the past 12 months, or</li>
              <li>(b) $100.00 USD.</li>
            </ul>
          </section>

          <section id="disputes">
            <H2>11. Dispute resolution &amp; arbitration</H2>
            <p>Any dispute arising out of or relating to these Terms shall be resolved through binding individual arbitration administered by the American Arbitration Association (AAA).</p>
            <p>You agree to waive any right to participate in a class action lawsuit or class-wide arbitration.</p>
          </section>

          <section id="termination">
            <H2>12. Termination</H2>
            <p>We reserve the right to suspend or terminate your access to the Service at any time, without notice, for conduct that violates these Terms or is harmful to the Service or its users.</p>
          </section>

          <section id="governing">
            <H2>13. Governing law</H2>
            <p>These Terms are governed by the laws of the State of Ohio, without regard to conflict of law principles.</p>
            <p>Any legal proceedings not subject to arbitration shall take place in the state or federal courts located in Summit County, Ohio.</p>
          </section>

          <section id="changes">
            <H2>14. Changes to these terms</H2>
            <p>We may update or modify these Terms at any time. Continued use of the Service after changes become effective constitutes your acceptance of the revised Terms.</p>
          </section>

          <section id="contact">
            <H2>15. Contact information</H2>
            <div className="bg-white border border-amber-100 rounded-2xl px-6 py-5 mt-4 text-sm text-amber-800 leading-loose">
              <strong className="block text-amber-950 text-base mb-1">DIGITAL PIER LLC</strong>
              Cleveland, Ohio, USA<br />
              Email: <a href="mailto:contact@sharedleash.com" className="text-amber-700 hover:underline">contact@sharedleash.com</a>
            </div>
          </section>
        </div>

        <div className="border-t border-amber-100 mt-16 pt-6 text-center text-xs text-amber-700/70 leading-relaxed">
          These terms were last updated April 28, 2026 · Shared Leash · All rights reserved<br />
          This document does not constitute legal advice. Consult a licensed attorney before relying on these terms in any legal matter.
        </div>
      </main>
    </div>
  );
}
